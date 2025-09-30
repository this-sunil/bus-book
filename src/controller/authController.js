import pool from "../DBHelper/DBHelper.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/token.js";

const admin = async () => {
  const query = `INSERT INTO users(name,email,phone,pass,role,gender,deviceToken,photo) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
  const hashPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);
  const { rows } = await pool.query(query, [
    "admin",
    "admin@gmail.com",
    "123456789",
    hashPass,
    "admin",
    "male",
    "12345678",
    "",
  ]);
  if (rows.length > 0) {
    console.log(`Admin Inserted Data`);
  }
};

const createUserTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY,name VARCHAR(255) NOT NULL,phone BIGINT NOT NULL,email VARCHAR(255) NOT NULL,pass VARCHAR(255) NOT NULL,role VARCHAR(255) NOT NULL,gender VARCHAR(255) NOT NULL,deviceToken varchar(255) NOT NULL,photo TEXT NOT NULL,created_at DATE DEFAULT CURRENT_DATE)`;
  pool.query(query, async (err) => {
    if (err) {
      throw err;
    }
    console.log(`User Table Created !!!`);
    const existUser = "SELECT * FROM users";
    const result = await pool.query(existUser);
    if (result.rows.length === 0) {
      admin();
    }
  });
};

createUserTable();

export const registerController = async (req, res) => {
  const { name, email, phone, pass, gender, deviceToken } = req.body;
  try {
    if (!name || !email || !phone || !pass || !gender || !deviceToken) {
      return res.status(404).json({
        status: false,
        msg: "Missing required field",
      });
    }
    const role = "user";
    const hashPass = await bcrypt.hash(pass, 10);
    const query =
      "INSERT INTO users(name,email,phone,pass,role,gender,deviceToken,photo) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *";
    const { rows } = await pool.query(query, [
      name,
      email,
      phone,
      hashPass,
      role,
      gender,
      deviceToken,
      "",
    ]);
    delete rows[0].pass;
    if (rows.length > 0) {
      const token = await generateToken(role);
      return res.status(200).json({
        status: true,
        msg: "User Register Successfully",
        token: token,
        result: rows[0],
      });
    }
  } catch (error) {
    console.log(`Error in register=> ${error.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const loginController = async (req, res) => {
  const { phone, pass } = req.body;
  try {
    if (!phone || !pass) {
      return res.status(404).json({
        status: false,
        msg: "Missing required field",
      });
    }
    const existUser = `SELECT * FROM users WHERE phone=$1`;
    const { rows } = await pool.query(existUser, [phone]);
    const isMatch = await bcrypt.compare(pass, rows[0].pass);
    const token = await generateToken(rows[0].role);
    delete rows[0].pass;
    if (!isMatch) {
      return res.status(404).json({
        status: false,
        msg: "Password doesn't Match",
      });
    }
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "User Login Successfully!!!",
        token: token,
        result: rows[0],
      });
    }
  } catch (error) {
    console.log(`Error in =>${error.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const deleteUserController = async (req, res) => {
  const id = req.body.id;
  try {
    const query = `DELETE FROM users WHERE id=$1`;
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Delete User Successfully",
        result: rows[0],
      });
    }
  } catch (e) {
    console.log(`Error in User Delete Operation=>${e.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const updateUserController = async (req, res) => {
  const { name, email, phone, gender } = req.body;
  try {
    const field = [];
    const value = [];
    const photo = req.file ? req.file.filename : "";
    let index = 2;
    const data = { name, email, phone, gender };
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        field.push(`${key}=$${index++}`);
        value.push(value);
      }
    }
    field.push(`photo=$${index}`);
    value.push(photo);
    const query = `UPDATE users SET ${field.join(",")} WHERE id=$1`;
    const { rows } = await pool.query(query, [name, email, phone, gender,id]);
    if(rows.length==0){
      return res.status(400).json({
        status:false,
        msg:"No Updates"
      })
    }
    if (rows.length > 0) {
      return res.status(200).json({
        status: true,
        msg: "Update User Successfully",
        result: rows[0],
      });
    }
  } catch (error) {
    console.log(`Error in Update Controller=>${error.message}`);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
