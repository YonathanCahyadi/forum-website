import { IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";

type AppContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  auth: {
    valid: boolean;
    userId: string | null;
  };
};

export default AppContext;
