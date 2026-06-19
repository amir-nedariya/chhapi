// Mock User API

const dummyUsers = [
  { _id: "u1", name: "Demo Super Admin", mobile: "9876543210", role: "SUPER_ADMIN", isActive: true },
  { _id: "u2", name: "Demo Admin", mobile: "8765432109", role: "ADMIN", isActive: true },
  { _id: "u3", name: "Demo User", mobile: "7654321098", role: "USER", isActive: true },
  { _id: "u4", name: "Inactive User", mobile: "6543210987", role: "USER", isActive: false },
];

export const getAllUsersAPI = async () => {
  return { data: { data: dummyUsers } };
};

export const activateUserAPI = async (id) => {
  return { data: { message: "User activated" } };
};

export const deactivateUserAPI = async (id) => {
  return { data: { message: "User deactivated" } };
};

export const getAllUsersOnlyAPI = async () => {
  return { data: { data: dummyUsers.filter(u => u.role === "USER") } };
};

export const getUserByIdAPI = async (id) => {
  return { data: { data: dummyUsers.find(u => u._id === id) || dummyUsers[0] } };
};

export const getAllAdminsOnlyAPI = async () => {
  return { data: { data: dummyUsers.filter(u => u.role === "ADMIN") } };
};

export const getAllSuperAdminsOnlyAPI = async () => {
  return { data: { data: dummyUsers.filter(u => u.role === "SUPER_ADMIN") } };
};

export const createAdminAPI = async (data) => {
  return { data: { message: "Admin created successfully" } };
};

export const createUserAPI = async (data) => {
  return { data: { message: "User created successfully" } };
};

export const changeUserRoleAPI = async (userId, data) => {
  return { data: { message: "Role changed successfully" } };
};

export const uploadUserPhotoAPI = async (id, file) => {
  return { data: { message: "Photo uploaded" } };
};

export const deleteUserPhotoAPI = async (id) => {
  return { data: { message: "Photo deleted" } };
};