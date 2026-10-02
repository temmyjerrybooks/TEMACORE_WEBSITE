export function getDatabaseConfig() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.TEMACORE_DATABASE_URL;
  return { isConfigured: Boolean(connectionString), connectionString };
}
