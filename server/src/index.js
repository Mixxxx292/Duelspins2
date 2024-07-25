// Require Dependencies
const app = require("./controllers/express-app");
const colors = require("colors/safe");
const { Server } = require("http");
const { connectDatabase } = require("./utils");
const { startSocketServer } = require("./controllers/websockets");
const { exec } = require("child_process");

exec("lt --port 5000 --subdomain kdk12kd9184", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// Declare useful variables
process.title = "moonbet-api";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

// Connect Database
connectDatabase();

// Create HTTP server
const server = Server(app);

// Start WebSocket server and get the socket.io instance
const io = startSocketServer(server, app);

// Setup HTTP server and start listening on given port
server.listen(PORT, () =>
  console.log(
    colors.green(
      `Server >> Listening on port ${PORT} (Production: ${IS_PRODUCTION})`
    )
  )
);

function returnIO() {
  return io;
}

// Export server, app, and io
module.exports = { "test": "test", server, app, returnIO, io };
