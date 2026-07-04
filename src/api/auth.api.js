// Mock Auth API
import { dummyUsers } from "./user.api";

export const loginAPI = async (data) => {
  if (typeof window !== 'undefined' && data?.mobile) {
    localStorage.setItem("userMobile", data.mobile);
  }
  return { data: { token: "dummy-jwt-token-12345" } };
};

export const meAPI = async () => {
  const enteredMobile = typeof window !== 'undefined' ? localStorage.getItem("userMobile") : "";
  
  if (enteredMobile) {
    const matchedUser = dummyUsers.find(u => u.mobile === enteredMobile);
    if (matchedUser) {
      return {
        data: {
          data: {
            _id: matchedUser._id,
            name: matchedUser.name,
            mobile: matchedUser.mobile,
            role: matchedUser.role,
            profilePhoto: matchedUser.profilePhoto || { url: `https://ui-avatars.com/api/?name=${encodeURIComponent(matchedUser.name)}&background=0f172a&color=fff` },
          }
        }
      };
    }
  }

  // Fallback defaults
  return {
    data: {
      data: {
        _id: "user123",
        name: "Demo Admin",
        mobile: "123456890",
        role: "ADMIN",
        profilePhoto: { url: "https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff" },
      }
    }
  };
};

export const changePasswordAPI = async (data) => {
  return { data: { message: "Password changed successfully" } };
};
