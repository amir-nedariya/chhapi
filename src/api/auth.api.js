// Mock Auth API

export const loginAPI = async (data) => {
  return { data: { token: "dummy-jwt-token-12345" } };
};

export const meAPI = async () => {
  return {
    data: {
      data: {
        _id: "user123",
        name: "Demo Super Admin",
        mobile: "123456890",
        role: "SUPER_ADMIN", // Gives access to all pages
        profilePhoto: { url: "https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff" },
      }
    }
  };
};

export const changePasswordAPI = async (data) => {
  return { data: { message: "Password changed successfully" } };
};
