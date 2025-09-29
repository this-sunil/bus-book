import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({debug:true,encoding:"utf-8"});
console.log(`User=>${process.env.DB_USER}`);


const pool=new Pool({
  host:process.env.DB_HOST,
  database:process.env.DB_NAME,
  port:process.env.DB_PORT,
  user:process.env.DB_USER,
  password:""
});
const connect=async()=>{
  pool.connect((err)=>{
    if(err){
        console.log(`Error Connecting Database=>${err.message}`);
    }
    console.log(`Database Connected Successfully !!!`);
  });
};
connect();
export default pool;