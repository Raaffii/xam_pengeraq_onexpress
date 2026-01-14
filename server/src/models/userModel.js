const pool = require("../config/db");

const UserModel = {
  async findAll(options = {}) {
    const { page, pageSize, role, searchTerm, isActive } = options;

    const conditions = [];
    const params = [];

    if (isActive === true) {
      conditions.push("u.active = ?");
      params.push(1);
    } else if (isActive === false) {
      conditions.push("u.active = ?");
      params.push(0);
    }

    if (role) {
      conditions.push("LOWER(u.role) = ?");
      params.push(role.toLowerCase());
    }

    if (searchTerm) {
      conditions.push("(LOWER(u.name) LIKE ? OR LOWER(u.emailaddress) LIKE ?)");
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM users u
      LEFT JOIN students s ON s.studentid = u.studentid
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Build base query
    let query = `
      SELECT 
        u.userid AS userId,
        u.emailaddress AS emailAddress,
        u.name AS userName,
        u.role,
        u.active,
        u.studentid AS studentId,
        s.studentname AS studentName,
        u.createddate AS enteredDate,
        u.editeddate AS editedDate
      FROM users u
      LEFT JOIN students s ON s.studentid = u.studentid
      ${whereClause}
      ORDER BY u.createddate DESC
    `;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    return {
      users: rows,
      total,
      page: page || null,
      pageSize: pageSize || null,
    };
  },

  async createUser(userData) {
    const {
      userName,
      emailAddress,
      hashedPassword,
      role,
      enteredBy,
      studentId,
    } = userData;

    const query = `
      INSERT INTO users (name, emailaddress, password, role, createdby, studentid, createddate)
      VALUES (?, ?, ?, ?, ?, ?,NOW())
    `;

    const [result] = await pool.execute(query, [
      userName,
      emailAddress,
      hashedPassword,
      role,
      enteredBy || null,
      studentId || null,
    ]);

    return result.insertId;
  },

  async findUserByEmail(email) {
    const [rows] = await pool.query(
      `SELECT userid, name, emailaddress as email, password,role, teacherid, active 
     FROM users WHERE emailaddress = ? AND active = true`,
      [email]
    );
    return rows[0];
  },

  async updateUser(updateData) {
    const {
      userId,
      editedBy,
      userName,
      emailAddress,
      role,
      active,
      hashedPassword,
      studentId,
    } = updateData;

    const fields = [];
    const params = [];

    if (userName) {
      fields.push("name = ?");
      params.push(userName);
    }

    if (emailAddress) {
      fields.push("emailaddress = ?");
      params.push(emailAddress);
    }

    if (role) {
      fields.push("role = ?");
      params.push(role);
    }

    if (active !== undefined) {
      fields.push("active = ?");
      params.push(active);
    }

    if (hashedPassword) {
      fields.push("password = ?");
      params.push(hashedPassword);
    }

    if (studentId !== undefined) {
      fields.push("studentid = ?");
      params.push(studentId);
    }

    fields.push("editedby = ?");
    params.push(editedBy);

    fields.push("editeddate = NOW()");

    const sql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE userid = ?
    `;

    params.push(userId);

    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
  },

  async softDeleteUser(conn, data) {
    const { userToDelete, editedBy } = data;
    const sql = `
      UPDATE users 
      SET active = false, editedby = ?, editeddate = NOW()
      WHERE userid = ?
    `;

    const [result] = await conn.execute(sql, [editedBy, userToDelete]);

    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }

    return true;
  },

  async fetchUserById(userId) {
    const [rows] = await pool.execute(
      `SELECT 
      u.userid AS userId, 
      u.name AS userName, 
      u.emailaddress AS emailAddress, 
      u.role,
      u.studentid AS studentId,
      s.studentname AS studentName,
      u.createddate AS enteredDate,
      u.editeddate AS editedDate,
      u.active
     FROM users u
     LEFT JOIN students s ON s.studentid = u.studentid
     WHERE u.userid = ? AND u.active = true`,
      [userId]
    );

    return rows[0];
  },
};

module.exports = UserModel;
