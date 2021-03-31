import { MikroORM } from "@mikro-orm/core";
import { Comment } from "./entities/Comment";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { __db_name__, __prod__ } from "./env";
import path from "path";

export default {
  entities: [User, Post, Comment],
  dbName: __db_name__,
  type: "postgresql",
  user: "postgres",
  password: "N@t524908",
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
    emit: "js" // migration generation mode
  }
} as Parameters<typeof MikroORM.init>[0];
