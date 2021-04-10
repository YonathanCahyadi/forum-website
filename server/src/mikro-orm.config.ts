import { MikroORM } from "@mikro-orm/core";
import { Comment } from "./entities/Comment";
import { Thread } from "./entities/Thread";
import { User } from "./entities/User";
import { __db_name__, __db_password__, __db_user__, __prod__, __db_host__, __db_port__ } from "./env";
import path from "path";

export default {
  entities: [User, Thread, Comment],
  host: __db_host__,
  port: __db_port__,
  dbName: __db_name__,
  type: "postgresql",
  user: __db_user__,
  password: __db_password__,
  debug: !__prod__,
  migrations: {
    tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[jt]s$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: "js", // migration generation mode
  },
} as Parameters<typeof MikroORM.init>[0];
