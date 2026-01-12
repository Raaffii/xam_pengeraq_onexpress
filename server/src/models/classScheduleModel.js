const pool = require("../config/db");

const getClassSchedule = async (page, limit, searchTerm = "", date) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const conditions = [];
  const params = [];

  if (date) {
    console.log("date", date);
  }

  const query = `
    SELECT 
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
    ORDER BY cs.createddate DESC
    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM classschhd cs`;
  const [countResult] = await pool.query(countQuery);
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

const putClassSchedule = async (conn, id, data, userId) => {
  const {
    teacherId,
    examSeriesId,
    examSubjId,
    locationId,
    startDateTime,
    repeatValue,
    repeatFreq,
  } = data;

  try {
    const sql = ` UPDATE classschhd SET teacherid = ?, examseriesid = ?, examsubjectid = ?, locationid=?, startdatetime=?, repeatValue=?, repeatFreq =?, editedby=?, editeddate=? WHERE classschhdid = ? ;`;
    const [result] = await conn.query(sql, [
      teacherId,
      examSeriesId,
      examSubjId,
      locationId,
      startDateTime,
      repeatValue,
      repeatFreq,
      userId,
      new Date(),
      id,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getClassSchedule,
  postClassSchedule,
  deleteClassSchedule,
  putClassSchedule,
};
