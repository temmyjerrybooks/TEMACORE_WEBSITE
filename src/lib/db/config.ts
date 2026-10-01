export function getDatabaseConfig() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  return { isConfigured: Boolean(connectionString), connectionString };
}
