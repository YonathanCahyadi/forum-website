import Server from "./server";

const server = new Server(3001);

server
  .start()
  .then((port) => console.log(`Server is running on port ${port}`))
  .catch((err) => console.log(err));
