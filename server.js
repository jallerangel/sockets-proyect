const { Server } = require("net");
const { argv } = require("process");

const END = "END";
const host = "0.0.0.0";

//127.0.0.1 -> 'Pepe'
//127.0.0.1 -> 'Karola'
const connections = new Map();

const error = (message) => {
  console.error(message);
  process.exit(1);
};
const sendMessage = (message, origin) => {
  //Mandar a todos, menos a origin el message.
};
const listen = (port) => {
  const server = new Server();

  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}: ${socket.remotePort}`;
    console.log(`New connection from ${remoteSocket}`);
    socket.setEncoding("utf-8");

    socket.on("data", (message) => {
      if (!connections.has(socket)) {
        console.log(`Username ${message} set for connetions ${remoteSocket}`);
        connections.set(socket, message);
      } else if (message === END) {
        socket.end();
      } else {
        //Enviar mensajes al resto de clientes
        console.log(`${remoteSocket} -> ${message} `);
      }
    });
    socket.on("close", () => {
      console.log(`Connection with ${remoteSocket} closed.`);
    });
    socket.on("error", (err) => {
      error(err.message);
    });
  });

  server.listen({ port, host }, () => {
    console.log(`Listening on ${port}`);
  });

  server.on("error", (err) => error(err.message));
};

const main = () => {
  if (process.argv.length !== 3) {
    error(`Usage: node ${__filename} port`);
  }
  let port = process.argv[2];
  if (isNaN(port)) {
    error(`Invalid port ${port}`);
  }
  port = Number(port);

  listen(port);
};
if (require.main === module) return main();

module.exports = error;
