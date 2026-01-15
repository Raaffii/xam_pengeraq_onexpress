const classScheduleDetailService = require("../services/examScheduleDetailService");
const crypto = require("crypto");

const getClassScheduleDetail = async (req, res) => {
  try {
    let { page, limit, searchTerm, date, scheduleId, nowDate } = req.query;
    console.log("sssssssss", req.query);
    const { teacherId } = req.user;

    const result = await classScheduleDetailService.getClassScheduleDetail(
      page,
      limit,
      searchTerm,
      date,
      teacherId,
      scheduleId,
      nowDate
    );
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(result.total / limit),
        totalItems: result.total,
      },
    });
  } catch (error) {
    console.error("get student error:", error);

    res.status(500).json({
      success: false,
      message: "get student failed",
      error: error.message,
    });
  }
};

const startClassSession = async (req, res) => {
  try {
    const { userId } = req.user;

    const { classschhdid } = req.body;

    const token = crypto.randomUUID();
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const data = await classScheduleDetailService.startClassSession(
      classschhdid,
      hashToken
    );

    const dataToken = {
      data: data,
      token: token,
      startDateTime: data.startDateTime,
    };

    res.status(201).json(dataToken);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "edit student failed",
      error: error.message,
    });
  }
};

const openClassSession = async (req, res) => {
  try {
    const classschhdid = req.params.id;

    const data = await classScheduleDetailService.openClassSession(
      classschhdid
    );

    console.log("data", data);
    const token = crypto.randomUUID();
    let dataToken;

    if (data.startDateTime) {
      console.log("haloman");
      const hashToken = crypto.createHash("sha256").update(token).digest("hex");
      await classScheduleDetailService.startClassSession(
        classschhdid,
        hashToken,
        false
      );

      dataToken = {
        token: token,
        startDateTime: data.startDateTime,
        classDateTime: data.classDateTime,
      };
    } else {
      dataToken = {
        token: null,
        startDateTime: null,
        classDateTime: null,
      };
    }

    res.status(201).json(dataToken);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "edit student failed",
      error: error.message,
    });
  }
};

module.exports = {
  getClassScheduleDetail,
  startClassSession,
  openClassSession,
};
