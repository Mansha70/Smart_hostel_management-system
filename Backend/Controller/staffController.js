const User = require('../Models/user');


// Lists staff users (for admin assignment UI)
// protected by adminOnly in route
const getAllStaff = async (req, res) => {
  const staff = await User.find(
    { role: 'staff' },
    'name email role department created_at roomNumber'
  );

  const mappedStaff = staff.map((s) => ({
    id: String(s._id),
    email: s.email,
    full_name: s.name,
    role: s.role,
    department: s.department,
    roomNumber: s.roomNumber,
    created_at: s.created_at,
  }));

  res.json({
    success: true,
    staff: mappedStaff,
  });
};

module.exports = {
  getAllStaff,
};

