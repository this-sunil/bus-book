import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({debug:true,encoding:"utf-8"});
console.log(`User=>${process.env.DB_USER}`);


const pool=new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // 🔐 Required for Render-hosted PostgreSQL
  }
  // host:process.env.DB_HOST,
  // database:process.env.DB_NAME,
  // port:process.env.DB_PORT,
  // user:process.env.DB_USER,
  // password:""
});
const connect=async()=>{
  pool.connect()
  .then(() => console.log("Database Connected Successfully !!!"))
  .catch((err) => {
    console.error("Error Connecting Database=>", err.message);
  });
};
connect();
export default pool;