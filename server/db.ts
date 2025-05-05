import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/quotation_craft";

// Mejor manejo de la conexión
const client = postgres(connectionString, {
  max: 1,
  onnotice: () => {},
  onparameter: () => {},
  debug: (connection, query, params) => {
    console.log('DB Query:', query, params);
  },
  connection: {
    application_name: "quotation_craft",
  },
  types: {
    bigint: postgres.BigInt,
  },
});

// Verificar la conexión
async function checkConnection() {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

checkConnection();

export const db = drizzle(client, { schema }); 