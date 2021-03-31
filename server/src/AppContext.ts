import { IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";

export default interface AppContext {
  em: EntityManager<IDatabaseDriver<Connection>>;
  auth: {
    valid: boolean;
    userId: string | null;
  };
}
