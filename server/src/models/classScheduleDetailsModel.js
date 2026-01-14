const pool = require("../config/db");

const bulkInsertScheduleDetail = async (conn, data) => {
  const values = data.map((item) => [
    item.classchhdid,
    item.startDateTime,
    item.locationId,
  ]);

  const placeholders = data.map(() => "(?, ?, ?)").join(", ");

  const query = `
      INSERT INTO classschdetails
      (classschhdid, classdatetime, locationid)
      VALUES ${placeholders}
    `;

  const flatValues = values.flat();

  const [result] = await conn.execute(query, flatValues);
  return result.affectedRows;
};

const getClassScheduleDetail = async (
  page,
  limit,
  searchTerm = "",
  date,
  teacherId,
  scheduleId,
  nowDate = false
) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const timestamp = Number(date);
  const dateFilter = new Date(timestamp);

  const year = dateFilter.getFullYear();
  const month = dateFilter.getMonth() + 1;

  const conditions = [];
  const params = [];

  if (teacherId) {
    conditions.push("cs.teacherid=?");
    params.push(teacherId);
  }

  if (year) {
    conditions.push("YEAR(cd.classdatetime) = ?");
    params.push(year);
  }

  if (month) {
    conditions.push(" MONTH(cd.classdatetime) = ?");
    params.push(month);
  }
  console.log("ceeeeeeeeeeeee", scheduleId, nowDate);
  if (scheduleId) {
    conditions.push("cd.classschhdid=?");
    params.push(scheduleId);
  }

  if (nowDate) {
    conditions.push("DATE(cd.classdatetime) = CURDATE()");
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
    es.subjDesc as subjDesc,
    cd.startdatetime as classStartDateTime,
    
    t.teacherid as teacherId,   
    es.examsubjid as examSubjId,
    ese.examseriesid as examSeriesId,
    cl.classlocationid as classLocationId,
    cd.classdatetime as classDateTime 

    FROM classschdetails cd 
    LEFT JOIN classschhd cs ON cd.classschhdid = cs.classschhdid
    LEFT JOIN teacher t ON cs.teacherid = t.teacherid
    LEFT JOIN examsubj es ON cs.examsubjectid= es.examsubjid
    LEFT JOIN examseries ese ON cs.examseriesid=ese.examseriesid 
    LEFT JOIN classlocation cl on cs.locationid=cl.classlocationid
     ${whereClause}


    `;
  const queryParams = [...params];

  // if (page) {
  //   const offset = (page - 1) * page;
  //   query += ` LIMIT ? OFFSET ?`;
  //   queryParams.push(String(limit), String(offset));
  // }

  const [rows] = await pool.execute(query, queryParams);

  return { data: rows };
};

const deleteClassScheduleDetail = async (conn, id) => {
  try {
    const sql = `DELETE FROM classschdetails WHERE classschhdid  = ?;`;
    const [result] = await conn.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};

const startClassSession = async (classschhdid, hashToken) => {
  try {
    const sql = `
      UPDATE classschdetails cd
      JOIN classschhd cs ON cs.classschhdid = cd.classschhdid
      SET cd.classtoken = ?, cd.startdatetime = ?
      WHERE cs.classschhdid = ?
        AND DATE(cd.classdatetime) = CURDATE()
    `;

    const [result] = await pool.query(sql, [
      hashToken,
      new Date(),
      classschhdid,
    ]);

    return result;
  } catch (err) {
    throw err;
  }
};

const newTokenClassSession = async (classschhdid, hashToken) => {
  try {
    const sql = `
      UPDATE classschdetails cd
      JOIN classschhd cs ON cs.classschhdid = cd.classschhdid
      SET cd.classtoken = ?
      WHERE cs.classschhdid = ?
        AND DATE(cd.classdatetime) = CURDATE()
    `;

    const [result] = await pool.query(sql, [hashToken, classschhdid]);

    return result;
  } catch (err) {
    throw err;
  }
};

const openClassSession = async (classschhdid, hashToken) => {
  try {
    const sql = `
    SELECT cd.classdatetime as classDateTime FROM classschdetails cd  WHERE cd.classschhdid = ?
    AND DATE(cd.classdatetime) = CURDATE() 
    `;

    const [result] = await pool.query(sql, [classschhdid]);

    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bulkInsertScheduleDetail,
  getClassScheduleDetail,
  deleteClassScheduleDetail,
  startClassSession,
  openClassSession,
  newTokenClassSession,
};
