import express, { Express } from "express";
import morgan from "morgan";
import { __db_name__, __jwt_secret__, __prod__ } from "./env";
import { ApolloServer } from "apollo-server-express";
import dbConfig from "./mikro-orm.config";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/User";
import AppContext from "./AppContext";
import { verifyToken } from "./authentication";
import { ThreadResolver } from "./resolvers/Thread";
import cors from "cors";
import CommentResolver from "./resolvers/Comment";

class Server {
  port: number;
  private app: Express;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.configMiddleware();
  }

  private configMiddleware() {
    this.app.use(cors());
    this.app.use(morgan(__prod__ ? "common" : "dev"));
  }

  private async connectToDatabase() {
    const orm = await MikroORM.init(dbConfig);

    const migrator = orm.getMigrator();

    await migrator.createMigration();
    await migrator.up();

    return orm;
  }

  private async startApolloServer(app: Express, db_connection: MikroORM<IDatabaseDriver<Connection>>) {
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver, ThreadResolver, CommentResolver],
        validate: false,
      }),
      context: ({ req, res }): AppContext => {
        const context: AppContext = {
          em: db_connection.em,
          auth: {
            valid: false,
            userId: null,
          },
        };

        // do authenthication
        const authHeader = req.headers.authorization;
        const authToken = authHeader?.split(" ")[1];

        // no token is provided
        if (!authToken) return context;

        // check for token validity
        const userId = verifyToken(authToken);
        if (userId) {
          context.auth.valid = true;
          context.auth.userId = userId;
        }

        // not authenticated
        return context;
      },
    });

    apolloServer.applyMiddleware({ app });
  }

  start(): Promise<number | string> {
    return new Promise(async (resolve, reject) => {
      const databaseConnection = await this.connectToDatabase();

      await this.startApolloServer(this.app, databaseConnection);

      this.app
        .listen(this.port, () => {
          resolve(this.port);
        })
        .on("error", (err) => reject(err.message));
    });
  }
}

export default Server;
