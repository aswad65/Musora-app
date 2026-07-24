import sql from "mssql";

let pool;

export const connectDB = async () => {
  try {
    if (pool) return pool;

    pool = await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,

      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    });

    console.log("✅ Azure SQL connected");
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export { sql };