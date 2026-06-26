const staffOnly = (req, res, next) => {

  if (req.user.role !== "staff") {
    return res.status(403).json({
      success: false,
      message: "Only Staff Can Access"
    });
  }

  next();
};

module.exports = staffOnly;