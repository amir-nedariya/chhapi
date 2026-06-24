// Mock User API

const dummyUsers = [
  {
    _id: "u1",
    name: "Demo Super Admin",
    mobile: "9876543210",
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: "2025-01-10T08:30:00.000Z",
    createdBy: "System",
    totalDonations: 0,
    donationCount: 0,
    avgDonation: 0,
    yearlyStats: { "2025": 0, "2026": 0 },
    monthlyStats: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
  },
  {
    _id: "u2",
    name: "Demo Admin",
    mobile: "8765432109",
    role: "ADMIN",
    isActive: true,
    createdAt: "2025-02-15T11:45:00.000Z",
    createdBy: "Demo Super Admin",
    totalDonations: 500,
    donationCount: 2,
    avgDonation: 250,
    yearlyStats: { "2025": 300, "2026": 200 },
    monthlyStats: { Jan: 100, Feb: 100, Mar: 100, Apr: 100, May: 100, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
  },
  {
    _id: "u3",
    name: "Demo User",
    mobile: "7654321098",
    role: "USER",
    isActive: true,
    createdAt: "2025-03-20T14:20:00.000Z",
    createdBy: "Demo Admin",
    totalDonations: 4850,
    donationCount: 15,
    avgDonation: 323.33,
    yearlyStats: { "2025": 2800, "2026": 2050 },
    monthlyStats: { Jan: 400, Feb: 650, Mar: 800, Apr: 300, May: 500, Jun: 200, Jul: 500, Aug: 300, Sep: 400, Oct: 300, Nov: 200, Dec: 300 }
  },
  {
    _id: "u4",
    name: "Inactive User",
    mobile: "6543210987",
    role: "USER",
    isActive: false,
    createdAt: "2025-04-05T09:15:00.000Z",
    createdBy: "Demo Admin",
    totalDonations: 1200,
    donationCount: 4,
    avgDonation: 300,
    yearlyStats: { "2025": 1200, "2026": 0 },
    monthlyStats: { Jan: 300, Feb: 300, Mar: 300, Apr: 300, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
  },
];

export const getAllUsersAPI = async () => {
  return { data: { data: dummyUsers.filter(u => !u.isDeleted) } };
};

export const activateUserAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) user.isActive = true;
  return { data: { message: "User activated" } };
};

export const deactivateUserAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) user.isActive = false;
  return { data: { message: "User deactivated" } };
};

export const getAllUsersOnlyAPI = async () => {
  return { data: { data: dummyUsers.filter(u => u.role === "USER" && !u.isDeleted) } };
};

export const getUserByIdAPI = async (id) => {
  return { data: { data: dummyUsers.find(u => u._id === id) || dummyUsers[0] } };
};

export const getAllAdminsOnlyAPI = async () => {
  return { data: { data: dummyUsers.filter(u => u.role === "ADMIN" && !u.isDeleted) } };
};

export const getAllSuperAdminsOnlyAPI = async () => {
  return { data: { data: dummyUsers.filter(u => u.role === "SUPER_ADMIN" && !u.isDeleted) } };
};

export const createAdminAPI = async (data) => {
  const newAdmin = {
    _id: "u" + (dummyUsers.length + 1),
    name: data.name,
    mobile: data.mobile,
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy: "Demo Super Admin",
    totalDonations: 0,
    donationCount: 0,
    avgDonation: 0,
    yearlyStats: { "2025": 0, "2026": 0 },
    monthlyStats: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
  };
  dummyUsers.push(newAdmin);
  return { data: { message: "Admin created successfully", data: newAdmin } };
};

export const createUserAPI = async (data) => {
  const newUser = {
    _id: "u" + (dummyUsers.length + 1),
    name: data.name,
    mobile: data.mobile,
    role: data.role || "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy: "Demo Super Admin",
    totalDonations: 0,
    donationCount: 0,
    avgDonation: 0,
    yearlyStats: { "2025": 0, "2026": 0 },
    monthlyStats: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
  };
  dummyUsers.push(newUser);
  return { data: { message: "User created successfully", data: newUser } };
};

export const changeUserRoleAPI = async (userId, data) => {
  const user = dummyUsers.find(u => u._id === userId);
  if (user) user.role = data.role;
  return { data: { message: "Role changed successfully" } };
};

export const uploadUserPhotoAPI = async (id, file) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.profilePhoto = { url: URL.createObjectURL(file) };
  }
  return { data: { message: "Photo uploaded" } };
};

export const deleteUserPhotoAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.profilePhoto = null;
  }
  return { data: { message: "Photo deleted" } };
};

export const softDeleteUserAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.isDeleted = true;
  }
  return { data: { message: "User soft deleted successfully" } };
};

export const hardDeleteUserAPI = async (id) => {
  const index = dummyUsers.findIndex(u => u._id === id);
  if (index !== -1) {
    dummyUsers.splice(index, 1);
  }
  return { data: { message: "User permanently deleted" } };
};