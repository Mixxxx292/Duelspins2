const socketio = require("socket.io");
const chatController = require("./chat");
const cupsController = require("./games/cups");
const shuffleController = require("./games/shuffle");
const kingController = require("./games/king");
const rouletteController = require("./games/roulette");
const crashController = require("./games/crash");
const slotsController = require("./games/slots");
const battlesController = require("./games/battles");

let io; // Declare the io variable outside the function

// Configure Socket.io
const startSocketServer = (server, app) => {
  try {
    // Main socket.io instance
    io = socketio(server);

    // Make the socket connection accessible at the routes
    app.set("socketio", io);

    // Start listeners
    chatController.listen(io);
    cupsController.listen(io);
    slotsController.listen(io);
    battlesController.listen(io);
    shuffleController.listen(io);
    kingController.listen(io);
    rouletteController.listen(io);
    crashController.listen(io);

    console.log("WebSocket >>", "Connected!");
    return io;
  } catch (error) {
    console.log(`WebSocket ERROR >> ${error.message}`);

    // Exit current process with failure
    process.exit(1);
  }
};

// Export functions and io instance
module.exports = { startSocketServer, io };