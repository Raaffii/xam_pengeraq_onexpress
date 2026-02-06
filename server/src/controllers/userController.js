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

const createUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const userData = {
      ...req.body,
      enteredBy: userId,
    };

    const newUser = await userService.createUser(userData);
    res
      .status(201)
      .json({ data: newUser, message: "User created successfully" });
  } catch (error) {
    console.error("Create user error:", error.message);
    if (
      error.message.includes("duplicate") ||
      error.message.includes("already exists") ||
      error.message.includes("Duplicate entry")
    ) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = {
      ...req.body,
      userId,
      editedBy: req.user.userId,
    };

    const updatedUser = await userService.updateUser(userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error.message);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      error.message.includes("duplicate") ||
      error.message.includes("already exists")
    ) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = {
      userToDelete: userId,
      editedBy: req.user.userId,
    };

    await userService.deleteUser(userData);
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Bind parameters")) {
      return res.status(409).json({
        message: "User data is being used, can't be deleted",
      });
    }
    res.status(500).json({ message: "Failed to delete" });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    await userService.resetPassword(userId, password);

    res.status(200).json({
      message: "Password resetted successfully",
    });
  } catch (error) {
    console.error("Failed to reset user password:", error.message);
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to reset user password" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    await userService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error.message);
    if (error.message === "User not found") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (error.message === "Current password is incorrect") {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }
    res.status(500).json({
      message: "Failed to change password. Please try again later.",
    });
  }
};

module.exports = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  changePassword,
};
