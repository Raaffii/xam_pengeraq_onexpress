const pool = require("../config/db");

const getClassSchedule = async (options = {}) => {
  const { page = 1, limit = 10, searchTerm, date, teacherId } = options;

  const conditions = [];
  const params = [];

  if (teacherId) {
    conditions.push("cs.teacherid=?");
    params.push(teacherId);
  }
  if (searchTerm) {
    conditions.push("(t.teachername LIKE ? OR es.subjdesc LIKE ? )");
    const searchValue = `%${searchTerm}%`;
    params.push(searchValue, searchValue);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  let query = `
    SELECT 
    cs.classschhdid as classschhdid,
    cs.startdatetime as startDateTime,
    cs.enddatetime as endDateTime,
    cs.repeatfreq as repeatFreq, 
    cs.repeatvalue as repeatValue,
    t.teachername as teacherName,
    ese.examseriesdescription as examSeriesDescription,
    es.subjdesc as subjDesc,
    
    t.teacherid as teacherId,   
    es.examsubjid as examSubjId,
    ese.examseriesid as examSeriesId,
    cl.classlocationid as classLocationId

    FROM classschhd cs 
    LEFT JOIN teacher t ON cs.teacherid = t.teacherid
    LEFT JOIN examsubj es ON cs.examsubjectid= es.examsubjid
    LEFT JOIN examseries ese ON cs.examseriesid=ese.examseriesid 
    LEFT JOIN classlocation cl on cs.locationid=cl.classlocationid
    ${whereClause}
    ORDER BY cs.createddate DESC`;

  const queryParams = [...params];

  if (page) {
    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(String(limit), String(offset));
  }

  const [rows] = await pool.execute(query, queryParams);

  const countQuery = `SELECT COUNT(*) AS total FROM classschhd cs  LEFT JOIN teacher t ON cs.teacherid = t.teacherid
    LEFT JOIN examsubj es ON cs.examsubjectid= es.examsubjid  ${whereClause}`;
  const [countResult] = await pool.query(countQuery, params);
  const total = countResult[0].total;

  return { data: rows, total };
};

const postClassSchedule = async (conn, data, userId) => {
  const {
    teacherId,
    examSeriesId,
    examSubjId,
    locationId,
    startDateTime,
    repeatValue,
    repeatFreq,
    endDateTime,
  } = data;

  try {
    const sql =
      "INSERT INTO classschhd (teacherid, examseriesid, examsubjectid, locationid, startdatetime, repeatvalue, repeatfreq,enddatetime, createdby, createddate) VALUES (?,?,?,?,?,?,?,?,?,?)";
    const [result] = await conn.query(sql, [
      teacherId,
      examSeriesId,
      examSubjId,
      locationId,
      startDateTime,
      repeatValue || null,
      repeatFreq,
      endDateTime || null,
      userId,
      new Date(),
    ]);
    return result.insertId;
  } catch (err) {
    throw err;
  }
};

const deleteClassSchedule = async (conn, id) => {
  try {
    const sql = `DELETE FROM classschhd WHERE classschhdid  = ?;`;
    const [result] = await conn.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};

const getClassScheduleById = async (conn, id) => {
  try {
    const sql = `SELECT * FROM classschhd WHERE classschhdid = ?`;
    const [rows] = await conn.query(sql, [id]);
    return rows[0] || null;
  } catch (err) {
    throw err;
  }
};

const putClassSchedule = async (conn, id, data, userId) => {
  try {
    const updates = [];
    const values = [];

    if (data.teacherId !== undefined) {
      updates.push("teacherid = ?");
      values.push(data.teacherId);
    }
    if (data.examSeriesId !== undefined) {
      updates.push("examseriesid = ?");
      values.push(data.examSeriesId);
    }
    if (data.examSubjId !== undefined) {
      updates.push("examsubjectid = ?");
      values.push(data.examSubjId);
    }
    if (data.locationId !== undefined) {
      updates.push("locationid = ?");
      values.push(data.locationId);
    }
    if (data.startDateTime !== undefined) {
      updates.push("startdatetime = ?");
      values.push(data.startDateTime);
    }
    if (data.repeatValue !== undefined) {
      updates.push("repeatValue = ?");
      values.push(data.repeatValue);
    }
    if (data.repeatFreq !== undefined) {
      updates.push("repeatFreq = ?");
      values.push(data.repeatFreq);
    }
    if (data.endDateTime !== undefined) {
      updates.push("enddatetime = ?");
      values.push(data.endDateTime);
    }

    updates.push("editedby = ?", "editeddate = ?");
    values.push(userId, new Date());

    values.push(id);

    if (updates.length === 2) {
      return { affectedRows: 0 };
    }

    const sql = `UPDATE classschhd SET ${updates.join(", ")} WHERE classschhdid = ?`;
    const [result] = await conn.query(sql, values);
    return result;
  } catch (err) {
    throw err;
  }
};

const getScheduleById = async (scheduleId) => {
  const sql = `SELECT 
    cs.classschhdid as classschhdid,
    cs.startdatetime as startDateTime,
    cs.enddatetime as endDateTime,
    cs.repeatfreq as repeatFreq, 
    cs.repeatvalue as repeatValue,
    t.teachername as teacherName,
    ese.examseriesdescription as examSeriesDescription,
    es.subjDesc as subjDesc,
    
    t.teacherid as teacherId,   
    es.examsubjid as examSubjId,
    ese.examseriesid as examSeriesId,
    cl.classlocationid as classLocationId

    FROM classschhd cs 
    LEFT JOIN teacher t ON cs.teacherid = t.teacherid
    LEFT JOIN examsubj es ON cs.examsubjectid= es.examsubjid
    LEFT JOIN examseries ese ON cs.examseriesid=ese.examseriesid 
    LEFT JOIN classlocation cl on cs.locationid=cl.classlocationid
    
    WHERE cs.classschhdid = ?`;
  const [result] = await pool.execute(sql, [scheduleId]);

  return result[0];
};

module.exports = {
  getClassSchedule,
  postClassSchedule,
  deleteClassSchedule,
  putClassSchedule,
  getScheduleById,
  getClassScheduleById,
};
