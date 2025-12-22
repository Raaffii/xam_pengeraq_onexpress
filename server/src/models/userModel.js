const pool = require("../config/db");

const UserModel = {
  async createUser(userData) {
    const { name, email, password, phone } = userData;
    const [result] = await pool.query(
      `INSERT INTO users (name, emailaddress, password, phone, entereddate) 
     VALUES (?, ?, ?, ?, NOW())`,
      [name, email, password, phone]
    );
    return result.insertId;
  },

  async findUserByEmail(email) {
    const [rows] = await pool.query(
      `SELECT userid, name, emailaddress as email, password, active 
     FROM users WHERE emailaddress = ? AND active = true`,
      [email]
    );
    return rows[0];
  },

  async updateUser(userid, updateData) {
    const { editedby } = updateData;
    const [result] = await pool.query(
      `UPDATE users 
     SET editedby = ?, editeddate = NOW()
     WHERE userid = ?`,
      [editedby, userid]
    );
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
