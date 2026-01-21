const pool = require("../config/db");

const ExamModel = {
  async getExam(options = {}) {
    const { page, pageSize, searchTerm } = options;

    const conditions = [];
    const params = [];

    if (searchTerm) {
      conditions.push("(e.examname LIKE ? OR e.examdescription LIKE ?)");
      const searchValue = `%${searchTerm}%`;
      params.push(searchValue, searchValue);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let query = `
      SELECT 
        e.examname as examName, 
        e.examdescription as examDesc, 
        e.examid as examId
      FROM exam e 
      ${whereClause}
      ORDER BY e.createddate DESC`;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM exam e 
      ${whereClause}`;

    const [countResult] = await pool.execute(countQuery, params);

    const total = countResult[0].total;
    return { data: rows, total };
  },

  async getExamById(examId) {
    const sql = `SELECT  
        examname as examName, 
        examdescription as examDesc, 
        examid as examId 
      FROM exam WHERE examid = ?`;
    const [result] = await pool.execute(sql, [examId]);
    return result[0];
  },

  async postExam(data) {
    const { examName, examDesc, enteredBy } = data;
    try {
      const sql =
        "INSERT INTO exam (examname, examdescription, createdby) VALUES (?, ?, ?)";
      const [result] = await pool.execute(sql, [examName, examDesc, enteredBy]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async putExam(id, data) {
    const { examName, examDesc, examNotes, active, editedBy } = data;

    const fields = [];
    const params = [];

    if (examName !== undefined) {
      fields.push("examname = ?");
      params.push(examName);
    }
    if (examDesc !== undefined) {
      fields.push("examdescription = ?");
      params.push(examDesc);
    }
    if (examNotes !== undefined) {
      fields.push("notes = ?");
      params.push(examNotes);
    }
    if (active !== undefined) {
      fields.push("active = ?");
      params.push(active);
    }
    if (editedBy !== undefined) {
      fields.push("editedby = ?");
      params.push(editedBy);
    }

    fields.push("editeddate = NOW()");

    try {
      const sql = `UPDATE exam SET ${fields.join(", ")} WHERE examid = ?`;
      params.push(id);
      const [result] = await pool.execute(sql, params);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async deleteExam(id) {
    try {
      const sql = `DELETE FROM exam WHERE examid = ?`;
      const [result] = await pool.execute(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = ExamModel;
