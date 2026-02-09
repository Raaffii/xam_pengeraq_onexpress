const pool = require("../config/db");

const SetupModel = {
  async getSetup(options = {}) {
    const { page, pageSize, searchTerm } = options;

    const conditions = [];
    const params = [];

    if (searchTerm) {
      conditions.push("(coyname LIKE ?)");
      const searchValue = `%${searchTerm}%`;
      params.push(searchValue);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let query = `
      SELECT 
        setupid as setupId,
        coyname as coyName, 
        addr1, 
        addr2,
        addr3,
        signaturename1 as signatureName1,
        titlename1 as titleName1,
        signaturename2 as signatureName2,
        titlename2 as titleName2
      FROM xamsetup
      ${whereClause}
      ORDER BY createddate DESC`;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM xamsetup 
      ${whereClause}`;

    const [countResult] = await pool.execute(countQuery, params);

    const total = countResult[0].total;
    return { data: rows, total };
  },

  async getSetupById(setupId) {
    const sql = `SELECT  
        setupid as setupId,
        coyname as coyName, 
        addr1, 
        addr2,
        addr3,
        signaturename1 as signatureName1,
        titlename1 as titleName1,
        signaturename2 as signatureName2,
        titlename2 as titleName2
      FROM xamsetup WHERE setupid = ?`;
    const [result] = await pool.execute(sql, [setupId]);
    return result[0];
  },

  async postSetup(data) {
    const {
      coyName,
      addr1,
      addr2,
      addr3,
      signatureName1,
      signatureName2,
      titleName1,
      titleName2,
      enteredBy,
    } = data;
    try {
      const sql =
        "INSERT INTO setup (coyname, addr1, addr2, addr3, signaturename1, titlename1, signaturename2, titlename2, createdby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const [result] = await pool.execute(sql, [
        coyName,
        addr1,
        addr2,
        addr3,
        signatureName1,
        titleName1,
        signatureName2,
        titleName2,
        enteredBy,
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async putSetup(id, data) {
    const {
      coyName,
      addr1,
      addr2,
      addr3,
      signatureName1,
      signatureName2,
      titleName1,
      titleName2,
      active,
      editedBy,
    } = data;

    const fields = [];
    const params = [];

    if (coyName !== undefined) {
      fields.push("coyname = ?");
      params.push(coyName);
    }
    if (addr1 !== undefined) {
      fields.push("addr1 = ?");
      params.push(addr1);
    }
    if (addr2 !== undefined) {
      fields.push("addr2 = ?");
      params.push(addr2);
    }
    if (addr3 !== undefined) {
      fields.push("addr3 = ?");
      params.push(addr3);
    }
    if (signatureName1 !== undefined) {
      fields.push("signaturename1 = ?");
      params.push(signatureName1);
    }
    if (signatureName2 !== undefined) {
      fields.push("signaturename2 = ?");
      params.push(signatureName2);
    }
    if (titleName1 !== undefined) {
      fields.push("titlename1 = ?");
      params.push(titleName1);
    }
    if (titleName2 !== undefined) {
      fields.push("titlename2 = ?");
      params.push(titleName2);
    }
    if (active !== undefined) {
      fields.push("active = ?");
      params.push(active);
    }
    if (editedBy !== undefined) {
      fields.push("modifiedby = ?");
      params.push(editedBy);
    }

    fields.push("modifieddate = utc_timestamp()");

    try {
      const sql = `UPDATE setup SET ${fields.join(", ")} WHERE setupid = ?`;
      params.push(id);
      const [result] = await pool.execute(sql, params);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async deleteSetup(id) {
    try {
      const sql = `DELETE FROM setup WHERE setupid = ?`;
      const [result] = await pool.execute(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = SetupModel;
