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
    const { userName, emailAddress, hashedPassword, role, enteredBy } =
      userData;

    const query = `
      INSERT INTO users (name, emailaddress, password, role, createdby, createddate)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(query, [
      userName,
      emailAddress,
      hashedPassword,
      role,
      enteredBy || null,
    ]);

    return result.insertId;
  },

  async findUserByEmail(email) {
    const [rows] = await pool.query(
      `SELECT userid, name, emailaddress as email, password, active 
     FROM users WHERE emailaddress = ? AND active = true`,
      [email],
    );
    return rows[0];
  },

  async updateUser(userid, updateData) {
    const { editedby } = updateData;
    const [result] = await pool.query(
      `UPDATE users 
     SET editedby = ?, editeddate = NOW()
     WHERE userid = ?`,
      [editedby, userid],
    );
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
