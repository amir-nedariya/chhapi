// Mock User API

const initialUsers = [
  {
    _id: "user123",
    name: "Demo Admin",
    mobile: "123456890",
    role: "ADMIN",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-02-15T11:45:00.000Z",
    createdByName: "SYSTEM",
    createdByRole: "SYSTEM"
  },
  {
    _id: "superadmin1",
    name: "Demo Super Admin",
    mobile: "9999999999",
    role: "SUPER_ADMIN",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-01-10T08:30:00.000Z",
    createdByName: "SYSTEM",
    createdByRole: "SYSTEM"
  },
  {
    _id: "u1",
    name: "Rahul Sharma",
    mobile: "9876543210",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-03-20T14:20:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u2",
    name: "Priya Singh",
    mobile: "8765432109",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-03-22T10:15:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u3",
    name: "Amit Kumar",
    mobile: "7654321098",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-03-25T16:40:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u4",
    name: "Sunita Devi",
    mobile: "6543210987",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-03-28T09:30:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u5",
    name: "Vikram Raj",
    mobile: "5432109876",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-01T11:20:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u6",
    name: "Rohan Verma",
    mobile: "9812345678",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-03T14:15:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u7",
    name: "Neha Gupta",
    mobile: "8723456789",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-05T10:45:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u8",
    name: "Sandeep Mishra",
    mobile: "7634567890",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-08T15:30:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u9",
    name: "Anjali Rao",
    mobile: "6545678901",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-10T12:00:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u10",
    name: "Karan Johar",
    mobile: "9456789012",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-12T16:50:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u11",
    name: "Meera Patel",
    mobile: "8367890123",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-15T09:10:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u12",
    name: "Aarav Mehta",
    mobile: "9876500111",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-18T14:22:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u13",
    name: "Deepika Padukone",
    mobile: "8765400222",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-20T11:05:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u14",
    name: "Sanjay Dutt",
    mobile: "7654300333",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-22T15:35:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u15",
    name: "Kriti Sanon",
    mobile: "6543200444",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-25T10:12:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u16",
    name: "Ranbir Kapoor",
    mobile: "9988700555",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-04-28T16:45:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u17",
    name: "Alia Bhatt",
    mobile: "8877600666",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-01T09:55:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u18",
    name: "Gaurav Sen",
    mobile: "7766500777",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-03T11:30:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u19",
    name: "Siddharth Malhotra",
    mobile: "6655400888",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-05T14:18:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u20",
    name: "Vikram Malhotra",
    mobile: "9876500999",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-08T16:00:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u21",
    name: "Preeti Desai",
    mobile: "8765400888",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-10T10:25:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u22",
    name: "Ramesh Kumar",
    mobile: "7654300777",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-12T13:40:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u23",
    name: "Suresh Singh",
    mobile: "6543200666",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-15T09:15:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u24",
    name: "Kabir Roy",
    mobile: "9988700444",
    role: "USER",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-18T15:50:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  },
  {
    _id: "u25",
    name: "Zoya Khan",
    mobile: "8877600333",
    role: "USER",
    isActive: false, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: "2025-05-20T11:30:00.000Z",
    createdByName: "Demo Admin",
    createdByRole: "ADMIN"
  }
];

const getStoredUsers = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("chhapi_users");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return null;
};

const storedUsers = getStoredUsers();

export const dummyUsers = [];

if (storedUsers) {
  dummyUsers.push(...storedUsers);
} else {
  dummyUsers.push(...initialUsers);
}

dummyUsers.forEach(u => {
  if (!u.password) u.password = "password123";
});

export const saveUsersToStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("chhapi_users", JSON.stringify(dummyUsers));
  }
};


export const getAllUsersAPI = async () => {
  return { data: { data: dummyUsers.filter(u => !u.isDeleted) } };
};

export const activateUserAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.isActive = true;
    saveUsersToStorage();
  }
  return { data: { message: "User activated" } };
};

export const deactivateUserAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.isActive = false;
    saveUsersToStorage();
  }
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
    password: data.password || "password123",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: new Date().toISOString(),
    createdBy: "Demo Super Admin",
    totalDonations: 0,
    donationCount: 0,
    avgDonation: 0,
    yearlyStats: { "2025": 0, "2026": 0 },
    monthlyStats: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
  };
  dummyUsers.push(newAdmin);
  saveUsersToStorage();
  return { data: { message: "Admin created successfully", data: newAdmin } };
};

export const createUserAPI = async (data) => {
  const newUser = {
    _id: "u" + (dummyUsers.length + 1),
    name: data.name,
    mobile: data.mobile,
    role: data.role || "USER",
    password: data.password || "password123",
    isActive: true, paymentStatus: ['REGULAR', 'PARTIAL', 'NONE'][Math.floor(Math.random() * 3)],
    createdAt: new Date().toISOString(),
    createdBy: "Demo Super Admin",
    totalDonations: 0,
    donationCount: 0,
    avgDonation: 0,
    yearlyStats: { "2025": 0, "2026": 0 },
    monthlyStats: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
  };
  dummyUsers.push(newUser);
  saveUsersToStorage();
  return { data: { message: "User created successfully", data: newUser } };
};

export const changeUserRoleAPI = async (userId, data) => {
  const user = dummyUsers.find(u => u._id === userId);
  if (user) {
    user.role = data.role;
    saveUsersToStorage();
  }
  return { data: { message: "Role changed successfully" } };
};

export const uploadUserPhotoAPI = async (id, file) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.profilePhoto = { url: URL.createObjectURL(file) };
    saveUsersToStorage();
  }
  return { data: { message: "Photo uploaded" } };
};

export const deleteUserPhotoAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.profilePhoto = null;
    saveUsersToStorage();
  }
  return { data: { message: "Photo deleted" } };
};

export const softDeleteUserAPI = async (id) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    user.isDeleted = true;
    saveUsersToStorage();
  }
  return { data: { message: "User soft deleted successfully" } };
};

export const hardDeleteUserAPI = async (id) => {
  const index = dummyUsers.findIndex(u => u._id === id);
  if (index !== -1) {
    dummyUsers.splice(index, 1);
    saveUsersToStorage();
  }
  return { data: { message: "User permanently deleted" } };
};

export const updateUserStatsAPI = async (id, data) => {
  const user = dummyUsers.find(u => u._id === id);
  if (user) {
    if (data.monthlyStats) {
      user.monthlyStats = { ...user.monthlyStats, ...data.monthlyStats };
    }
    if (data.yearlyStats) {
      user.yearlyStats = { ...user.yearlyStats, ...data.yearlyStats };
    }
    // Update stats:
    const values = Object.values(user.monthlyStats || {});
    user.totalDonations = values.reduce((a, b) => a + b, 0);
    user.donationCount = values.filter(v => v > 0).length;
    user.avgDonation = user.donationCount > 0 ? user.totalDonations / user.donationCount : 0;
    
    // Update yearly stats based on monthlyStats
    const currentYear = new Date().getFullYear();
    if (!user.yearlyStats) user.yearlyStats = {};
    user.yearlyStats[String(currentYear)] = user.totalDonations;
    saveUsersToStorage();
  }
  return { data: { message: "Stats updated successfully" } };
};