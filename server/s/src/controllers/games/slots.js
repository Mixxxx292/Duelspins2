// Require Dependencies
const jwt = require("jsonwebtoken");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");


const { readFileSync } = require("node:fs");
const { createSign, createVerify, generateKeySync } = require("node:crypto");
const axios = require("axios"); 
const { v4: uuidv4 } = require('uuid');

const fs = require("fs");
const path = require('path');
const User = require("../../models/User");
const crypto = require('crypto');

// Declareing functions to verify signatures for caleta
function verify(msg, key, signature) {
  const verify = createVerify("SHA256");
  verify.write(msg);
  verify.end();
  return verify.verify(key, signature, "base64");
}

function encrypt(msg, key) {
  const sign = createSign("SHA256");
  sign.write(msg);
  sign.end();
  return sign.sign(key, "base64");
}

// Declareing functions to verify signatures for bgaming
function generateRequestSignature(body, authToken) {
  const hmac = crypto.createHmac('sha256', authToken);
  return hmac.update(body).digest('hex');
}

function validateRequestSignature(body, authToken, receivedSignature) {
  const expectedSignature = generateRequestSignature(body, authToken);
  return expectedSignature === receivedSignature;
}

const public = readFileSync(path.resolve("keys/public.pem"), "utf-8");
const private = readFileSync(path.resolve("keys/key.pem"), "utf-8");
const caleta_pub = readFileSync(path.resolve("keys/caleta.pem"), "utf-8");

// Get socket.io instance
const listen = io => {
  // Listen for new websocket connections
  io.of("/slots").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    // Throttle connnections
    socket.use(throttlerController(socket));

    // Authenticate websocket connection
    socket.on("auth", async token => {
      if (!token) {
        loggedIn = false;
        user = null;
        return socket.emit(
          "error",
          "No authentication token provided, authorization declined"
        );
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.authentication.jwtSecret);

        user = await User.findOne({ _id: decoded.user.id });
        if (user) {
          if (parseInt(user.banExpires) > new Date().getTime()) {
            // console.log("banned");
            loggedIn = false;
            user = null;
            return socket.emit("user banned");
          } else {
            loggedIn = true;
            socket.join(String(user._id));
            // socket.emit("notify-success", "Successfully authenticated!");
          }
        }
        // return socket.emit("alert success", "Socket Authenticated!");
      } catch (error) {
        loggedIn = false;
        user = null;
        return socket.emit("notify-error", "Authentication token is not valid");
      }
    });

    // Check for users ban status
    socket.use(async (packet, next) => {
      if (loggedIn && user) {
        try {
          const dbUser = await User.findOne({ _id: user.id });

          // Check if user is banned
          if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
            return socket.emit("user banned");
          } else {
            return next();
          }
        } catch (error) {
          return socket.emit("user banned");
        }
      } else {
        return next();
      }
    });
  });

  
}




const getSlotData = async () => {
  try {    
    let r = [];

    // Read the file
    fs.readFile('src/controllers/games/list.json', 'utf8', (err, data) => { 
      r.push(JSON.parse(data)); 
    });

    const msg = `{"operator_id":"${config.authentication.caleta.operator.operator_id}"}`;

    // Generates Signature using private key.
    const signature = encrypt(msg, private);
  
    const body = {
      "operator_id": "moonbet"
    }
    
    const headers = {
      "X-Auth-Signature": signature,
      "accept": "application/json",
      "Content-Type": "application/json"
    }
  
    // Gets possible games
    await axios.post(`${config.authentication.caleta.caleta.base_url}/game/list`, body, { headers })
      .then(res => {
        r.push(res.data);
      }).catch(err => {
        console.log(err)
      });
    return r
  } catch (error) {
    throw error;
  }
}

const getSlotURL = async (gameData, id, ip) => {
  try {
    if(!id) {
      return getDemoURL(gameData);
    }
    if(gameData.provider) {
      const token = await generateToken(id);
      const user = await User.findOne({ _id: id });

      /*
              "ip": `46.53.162.55`,
          "email": "test@example.com",
          "firstname": "N/A",
          "lastname": "N/A",
          "nickname": `${user.username}`,
          "city": "Berlin",
          "country": "DE",
          "date_of_birth": "2000-01-01",
          "gender": "m",
          "registered_at": `${user.created.toISOString().substring(0, 10)}`
        "urls": {
          "deposit_url": "https://moonbet.vip",
          "return_url": "https://moonbet.vip"
        },
      */
      
      const body =  {
        "casino_id": `${config.authentication.bgaming.CASINO_ID}`,
        "game": `${gameData.identifier}`,
        "currency": "USD",
        "locale": "en",
        "balance": Number(((user.wallet/1.4)*100).toFixed(0)),
        "client_type": "desktop",
        "user": {
          "id": id,
        }
      }
      
      const signature = generateRequestSignature(JSON.stringify(body), config.authentication.bgaming.AUTH_TOKEN);

      const headers = {
        "X-REQUEST-SIGN": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      }
    
      let p;
      await axios.post(`${config.authentication.bgaming.GCP_URL}/sessions`, body, { headers })
        .then(async (res) => {
          p = res.data;
          await User.findOneAndUpdate({ _id: id }, { $set: { session: p.session_id }});
        }).catch(err => {
          console.log(err)
        });

      return p.launch_options.game_url;
    } else if(gameData.product) {
      const token = await generateToken(id);
    
      const body = {
        "user": `${id}`,
        "token": `${token}`,
        "operator_id":`${config.authentication.caleta.operator.operator_id}`,
        "lang":"en",
        "game_id":`${gameData.game_id}`,
        "game_code":`${gameData.game_code}`,
        "currency":"USD",
        "country":"EE"
      };

      // Generates Signature using private key.
      const signature = encrypt(JSON.stringify(body), private);
      
      const headers = {
        "X-Auth-Signature": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      }
    
      // Gets possible games
      let p;
      await axios.post(`${config.authentication.caleta.caleta.base_url}/game/url`, body, { headers })
        .then(res => {
          p = res.data;
        }).catch(err => {
          console.log(err)
        });
      return p.url;
    }
  } catch (error) {
    throw error;
  }
}

// gets the demo url if the user isn't signed in
const getDemoURL = async (gameData) => {
  try {
    if(gameData.provider) {      
      const body =  {
        "casino_id": `${config.authentication.bgaming.CASINO_ID}`,
        "game": `${gameData.identifier}`,
        "currency": "USD",
        "locale": "en",
        "client_type": "desktop",
      }
      
      const signature = generateRequestSignature(JSON.stringify(body), config.authentication.bgaming.AUTH_TOKEN);

      const headers = {
        "X-REQUEST-SIGN": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      }
    
      let p;
      await axios.post(`${config.authentication.bgaming.GCP_URL}/demo`, body, { headers })
        .then(async (res) => {
          p = res.data;
        }).catch(err => {
          console.log(err)
        });

      return p.launch_options.game_url;
    } else if(gameData.product) {    
      const body = {
        "operator_id":`${config.authentication.caleta.operator.operator_id}`,
        "lang":"en",
        "game_id":`${gameData.game_id}`,
        "game_code":`${gameData.game_code}`,
        "currency":"FUN",
        "country":"EE"
      };

      // Generates Signature using private key.
      const signature = encrypt(JSON.stringify(body), private);
      
      const headers = {
        "X-Auth-Signature": signature,
        "accept": "application/json",
        "Content-Type": "application/json"
      }
    
      // Gets possible games
      let p;
      await axios.post(`${config.authentication.caleta.caleta.base_url}/game/url`, body, { headers })
        .then(res => {
          p = res.data;
        }).catch(err => {
          console.log(err)
        });
      return p.url;
    }
  } catch (error) {
    throw error;
  }
}

// Generates a session token and saves it with a user ID
const generateToken = async (id) => {
  const token = uuidv4();

  await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        session: token,
      },
    }
  );

  return token;
};

// Export functions
module.exports = {
  getSlotData,
  getSlotURL,
  generateToken,
  listen,
};
