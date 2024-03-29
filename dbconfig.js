/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:41
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-08-13 15:22:45
 */
const sql = require("mssql");

const config = {
  // Live Credentials
  connectionLimit: 100,
  user: "aaprobicsdb",
  password: "g&z6Wx635",
  server: "103.160.107.235",
  database: "klwkthvp_aaprobics",

    // Local Credentials
  // connectionLimit: 100,
  // user: "sa",
  // password: "vss",
  // server: "localhost",
  // database: "AA_Probics",

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    encrypt: false,
    trustServerCertificate: false,
    instancename: "SQLEXPRESS", // SQL Server instance name
  },
  port: 1433,
};



async function connectDB() {
  const pool = new sql.ConnectionPool(config);

  try {
    await pool.connect();
    console.log(
      "SQL SERVER IS LIVE and  Connected to database ✌ ☮ "
    );

    return pool;
  } catch (err) {
    console.log("Database connection failed!", err);

    return err;
  }
}

async function getAll() {
  const DB = await connectDB();

  try {
    const result = await DB.request().query("select * from [COUNTRY]");
    return result.recordset;
  } catch (err) {
    console.log("Error querying database", err);
    return err;
  } finally {
    DB.close();
  }
}

async function execute() {
  let result = await getAll();
  console.dir(JSON.stringify(result));

  return result;
}

execute();
module.exports = config;
