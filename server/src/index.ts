import { __port__ } from "./env";
import Server from "./lib/server";

const server = new Server(__port__);

server
  .start()
  .then((port) => console.log(`Server is running on port ${port}`))
  .catch((err) => console.log(err));
