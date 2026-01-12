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

const getClassScheduleDetail = async (page, limit, searchTerm = "", date) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const timestamp = Number(date);
  const dateFilter = new Date(timestamp);

  const year = dateFilter.getFullYear();
  const month = dateFilter.getMonth() + 1;

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
    cl.classlocationid as classLocationId,
    cd.classdatetime as classDateTime 

    FROM classschdetails cd 
    LEFT JOIN classschhd cs ON cd.classschhdid = cs.classschhdid
    LEFT JOIN teacher t ON cs.teacherid = t.teacherid
    LEFT JOIN examsubj es ON cs.examsubjectid= es.examsubjid
    LEFT JOIN examseries ese ON cs.examseriesid=ese.examseriesid 
    LEFT JOIN classlocation cl on cs.locationid=cl.classlocationid
    
    WHERE YEAR(cd.classdatetime) = ?
    AND MONTH(cd.classdatetime) = ?
  

    `;
  const [rows] = await pool.query(query, [year, month]);

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
module.exports = {
  bulkInsertScheduleDetail,
  getClassScheduleDetail,
  deleteClassScheduleDetail,
};
