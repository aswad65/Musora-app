import sql from "mssql/msnodesqlv8.js";

let pool;

export const connectDB = async () => {
  try {
    if (pool) return pool; 

    pool = await sql.connect({
      server: "localhost",
      database: "Musicappdata",
      driver: "msnodesqlv8",
      options: {
        trustedConnection: true
      }
    });

    console.log("✅ SQL Server connected");
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export { sql };
