/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:npg_fup0Y5PqarLE@ep-proud-thunder-a5ttxx10-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
  };