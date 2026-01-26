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
  nowDate = false,
  usePagination = true,
) => {
  // ✅ Fix boolean dari query param (string -> boolean)
  usePagination = String(usePagination) !== "false";

  // ✅ Pagination safe cast
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  // ✅ Date safe handling
  let year, month;
  if (date) {
    const timestamp = Number(date);
    const dateFilter = new Date(timestamp);

    if (!isNaN(dateFilter)) {
      year = dateFilter.getFullYear();
      month = dateFilter.getMonth() + 1;
    }
  }

  const conditions = [];
  const params = [];

  // ✅ Filters
  if (teacherId) {
    conditions.push("cs.teacherid = ?");
    params.push(teacherId);
  }

  if (year) {
    conditions.push("YEAR(cd.classdatetime) = ?");
    params.push(year);
  }

  if (month) {
    conditions.push("MONTH(cd.classdatetime) = ?");
    params.push(month);
  }

  if (scheduleId) {
    conditions.push("cd.classschhdid = ?");
    params.push(scheduleId);
  }

  if (nowDate) {
    conditions.push("DATE(cd.classdatetime) = CURDATE()");
  }

  // ✅ Optional search
  if (searchTerm) {
    conditions.push("(es.subjDesc LIKE ? OR t.teachername LIKE ?)");
    params.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // ==============================
  // MAIN QUERY
  // ==============================

  let query = `
    SELECT 
      cs.classschhdid AS classschhdid,
      cs.startdatetime AS startDateTime,
      cs.enddatetime AS endDateTime,
      cs.repeatfreq AS repeatFreq, 
      cs.repeatvalue AS repeatValue,
      t.teachername AS teacherName,
      ese.examseriesdescription AS examSeriesDescription,
      es.subjDesc AS subjDesc,
      cd.startdatetime AS classStartDateTime,
      cd.classschdetailsid AS classSchDetailsId,
      t.teacherid AS teacherId,   
      es.examsubjid AS examSubjId,
      ese.examseriesid AS examSeriesId,
      cl.classlocationid AS classLocationId,
      cd.classdatetime AS classDateTime 
    FROM classschdetails cd 
    LEFT JOIN classschhd cs ON cd.classschhdid = cs.classschhdid
    LEFT JOIN teacher t ON cs.teacherid = t.teacherid
    LEFT JOIN examsubj es ON cs.examsubjectid = es.examsubjid
    LEFT JOIN examseries ese ON cs.examseriesid = ese.examseriesid 
    LEFT JOIN classlocation cl ON cs.locationid = cl.classlocationid
    ${whereClause}
    ORDER BY cd.classdatetime DESC
  `;

  const queryParams = [...params];

  // ✅ Apply pagination if enabled
  if (usePagination) {
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
  }

  const [rows] = await pool.execute(query, queryParams);

  // ==============================
  // NO PAGINATION MODE
  // ==============================

  if (!usePagination) {
    return {
      data: rows,
    };
  }

  // ==============================
  // COUNT QUERY FOR PAGINATION
  // ==============================

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM classschdetails cd
    LEFT JOIN classschhd cs ON cd.classschhdid = cs.classschhdid
    LEFT JOIN teacher t ON cs.teacherid = t.teacherid
    LEFT JOIN examsubj es ON cs.examsubjectid = es.examsubjid
    ${whereClause}
  `;

  const [countResult] = await pool.execute(countQuery, params);

  const totalItems = countResult[0]?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // ==============================
  // FINAL RESPONSE
  // ==============================

  return {
    data: rows,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems,
      totalPages,
    },
  };
};

const getClassScheduleDetailById = async (classSchDetailsId) => {
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
    cd.classschdetailsid as classSchDetailsId,
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
    
    WHERE cd.classschdetailsid = ?


    `;

  const [rows] = await pool.execute(query, [classSchDetailsId]);

  return { data: rows[0] };
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

const startClassSession = async (classschhdid, hashToken, newClass) => {
  try {
    let sql;
    let params;

    const nowDate = new Date();
    if (newClass) {
      sql = `
        UPDATE classschdetails cd
        JOIN classschhd cs ON cs.classschhdid = cd.classschhdid
        SET cd.classtoken = ?, cd.startdatetime = ?
        WHERE cs.classschhdid = ?
          AND DATE(cd.classdatetime) = CURDATE()
      `;
      params = [hashToken, new Date(), classschhdid];
    } else {
      sql = `
        UPDATE classschdetails cd
        JOIN classschhd cs ON cs.classschhdid = cd.classschhdid
        SET cd.classtoken = ?
        WHERE cs.classschhdid = ?
          AND DATE(cd.classdatetime) = CURDATE()
      `;
      params = [hashToken, classschhdid];
    }

    const [result] = await pool.query(sql, params);

    return { result, startDateTime: nowDate };
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
    SELECT cd.classdatetime as classDateTime, cd.startdatetime as startDateTime FROM classschdetails cd  WHERE cd.classschhdid = ?
    AND DATE(cd.classdatetime) = CURDATE() 
    `;

    const [result] = await pool.query(sql, [classschhdid]);

    return result[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bulkInsertScheduleDetail,
  getClassScheduleDetailById,
  getClassScheduleDetail,
  deleteClassScheduleDetail,
  startClassSession,
  openClassSession,
  newTokenClassSession,
};
