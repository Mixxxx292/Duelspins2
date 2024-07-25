// Require Dependencies
const axios = require("axios");
const config = require("../config");


async function createDepositAddress() {
  try {
    let btc, ltc, doge;
    
    const header = {
      "Content-Type": "application/json"
    };

    await axios.post(`${config.authentication.apirone.base_url}/v2/accounts/${config.authentication.apirone.account_id}/addresses`,
      {
        "currency": "btc",
        "addr-type": "p2wpkh",
        "callback": {
            "method": "POST",
            "url": config.authentication.apirone.callback_url,
            "data": {
              "id": config.authentication.apirone.callback_sercret,
            }
        },
      }, { headers: header})
      .then(response => {
        btc = response.data.address;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
    await axios.post(`${config.authentication.apirone.base_url}/v2/accounts/${config.authentication.apirone.account_id}/addresses`,
      {
        "currency": "ltc",
        "callback": {
            "method": "POST",
            "url": config.authentication.apirone.callback_url,
            "data": {
              "id": config.authentication.apirone.callback_sercret,
            }
        }
      }, { headers: header})
      .then(response => {
        ltc = response.data.address;
      })
      .catch(error => {
        console.error('Error:', error);
      });

    await axios.post(`${config.authentication.apirone.base_url}/v2/accounts/${config.authentication.apirone.account_id}/addresses`,
      {
        "currency": "doge",
        "callback": {
            "method": "POST",
            "url": config.authentication.apirone.callback_url,
            "data": {
              "id": config.authentication.apirone.callback_sercret,
            }
        }
      }, { headers: header})
      .then(response => {
        doge = response.data.address;
      })
      .catch(error => {
        console.error('Error:', error);
      });

    return {
      btc: btc,
      ltc: ltc,
      doge: doge,
    }
  } catch (error) {
    console.log(error);
  }
}


async function createWithdrawTransaction() {
  try {

  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  createDepositAddress,
  createWithdrawTransaction,
};
