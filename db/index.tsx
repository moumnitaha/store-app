import { Pool, QueryResultRow } from "pg";

// Creates a global connection pool
const pool = new Pool({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "db",
  port: 5432,
});

export const query = <Result extends QueryResultRow>(
  text: string,
  params: any[] = []
) => {
  return pool.query<Result>(text, params);
};
