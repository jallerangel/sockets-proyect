const { Server } = require("net");

const END = "END";
const host = "0.0.0.0";

//127.0.0.1 -> 'Pepe'
//127.0.0.1 -> 'Karola'
const connections = new Map();

const error = require("./error");

const sendMessage = (message, origin) => {
  //Mandar a todos, menos a origin el message.
  for (const socket of connections.keys()) {
    if (socket !== origin) socket.write(`${message}`);
  }
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
        connections.delete(socket);
        socket.end();
      } else {
        for (const username of connections.values()) {
          console.log(username);
        }
        //Enviar mensajes al resto de clientes
        const fullMessage = `[${connections.get(socket)}]: ${message} `;
        console.log(`${remoteSocket} -> ${fullMessage}`);
        sendMessage(fullMessage, socket);
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

  server.on("error", (err) => error(err));
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
