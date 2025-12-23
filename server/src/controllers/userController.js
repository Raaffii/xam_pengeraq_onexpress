const userService = require("../services/userService");

const fetchUsers = async (req, res) => {
  try {
    const { page, pageSize, byRole, searchTerm, isActive } = req.query;
    const filterOptions = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      role: byRole,
      searchTerm,
      isActive: isActive === undefined ? true : isActive,
    };
    const result = await userService.getAllUsers(filterOptions);

    const response = {
      data: result.users,
    };

    if (page && pageSize) {
      response.pagination = {
        currentPage: result.page,
        pageSize: result.pageSize,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Fetch users error:", error.message);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

module.exports = {
  fetchUsers,
};
