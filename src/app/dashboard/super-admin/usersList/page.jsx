"use client";
import { useEffect, useMemo, useState } from "react";
import {
  getAllUsersAPI,
  activateUserAPI,
  deactivateUserAPI,
  changeUserRoleAPI,
  uploadUserPhotoAPI,
  deleteUserPhotoAPI,
  getUserByIdAPI,
} from "../../../../api/user.api";
import { toast } from "react-hot-toast";
import {
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  X,
  Users,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

/* ================= ROLE STYLES ================= */
const roleStyles = {
  SUPER_ADMIN:
    "bg-purple-100 text-purple-700 border border-purple-200 font-medium",
  ADMIN:
    "bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium",
  USER:
    "bg-sky-100 text-sky-700 border border-sky-200 font-medium",
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await getAllUsersAPI();
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ACTIONS ================= */
  const toggleStatus = async (u) => {
    try {
      setLoadingId(u._id);
      u.isActive
        ? await deactivateUserAPI(u._id)
        : await activateUserAPI(u._id);
      fetchUsers();
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await changeUserRoleAPI(id, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Role update failed");
    }
  };

  const handlePhotoUpload = async (id, file) => {
    if (!file) return;
    try {
      await uploadUserPhotoAPI(id, file);
      toast.success("Profile updated");
      fetchUsers();
    } catch {
      toast.error("Upload failed");
    }
  };

  const handlePhotoDelete = async (id) => {
    if (!confirm("Delete profile photo?")) return;
    try {
      await deleteUserPhotoAPI(id);
      toast.success("Photo deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openUserModal = async (id) => {
    try {
      const res = await getUserByIdAPI(id);
      setViewUser(res.data.data);
    } catch {
      toast.error("Failed to load user");
    }
  };

  /* ================= FILTER ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const s =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile.includes(search);
      const r = roleFilter === "ALL" || u.role === roleFilter;
      return s && r;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-1 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-800">
          <Users size={24} className="text-cyan-600" />
          User Management
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* SEARCH */}
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search user..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white text-slate-800
              border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm transition"
            />
          </div>

          {/* FILTER */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44 px-4 py-2 rounded-xl bg-white text-slate-800
            border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm transition"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-slate-800">
          <thead className="bg-slate-50 text-slate-600 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left font-semibold">User Info</th>
              <th className="p-4 text-center font-semibold">Role</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={u.profilePhoto?.url || "/avatar.jpeg"}
                    className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.mobile}</p>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${roleStyles[u.role]}`}>
                    {u.role.replace("_", " ")}
                  </span>
                </td>

                <td className="p-4 text-center">
                  {u.role !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`w-11 h-6 rounded-full p-1 flex items-center shadow-inner transition-colors duration-300 ${
                        u.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                          u.isActive ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  )}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => openUserModal(u._id)}
                    className="text-cyan-600 hover:text-cyan-800 hover:scale-110 transition"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u) => (
          <div key={u._id} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={u.profilePhoto?.url || "/avatar.jpeg"}
                className="w-12 h-12 rounded-full border border-gray-200 object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{u.name}</p>
                <p className="text-xs text-slate-500">{u.mobile}</p>
              </div>
              <button onClick={() => openUserModal(u._id)} className="text-cyan-600 p-2 bg-cyan-50 rounded-lg">
                <Eye size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className={`px-3 py-1 rounded-full text-xs ${roleStyles[u.role]}`}>
                {u.role.replace("_", " ")}
              </span>

              {u.role !== "SUPER_ADMIN" && (
                <button
                  onClick={() => toggleStatus(u)}
                  className={`w-11 h-6 rounded-full p-1 flex items-center shadow-inner transition-colors duration-300 ${
                    u.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                      u.isActive ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center sm:justify-end items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-slate-600 text-sm font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {viewUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full sm:max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">User Details</h3>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={viewUser.profilePhoto?.url || "/avatar.jpeg"}
                  className="w-20 h-20 rounded-full border-2 border-gray-100 shadow-sm object-cover"
                />
                <div className="text-center sm:text-left pt-2">
                  <p className="text-xl font-bold text-slate-800">{viewUser.name}</p>
                  <p className="text-slate-500">{viewUser.mobile}</p>
                </div>
              </div>

              {viewUser.role !== "SUPER_ADMIN" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Change Role</label>
                  <select
                    value={viewUser.role}
                    onChange={(e) => changeRole(viewUser._id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition shadow-sm"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                <label className="cursor-pointer text-cyan-600 bg-cyan-50 hover:bg-cyan-100 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
                  <Upload size={18} /> Upload Photo
                  <input hidden type="file" accept="image/*"
                    onChange={(e) =>
                      handlePhotoUpload(viewUser._id, e.target.files[0])
                    }
                  />
                </label>

                {viewUser.profilePhoto && (
                  <button
                    onClick={() => handlePhotoDelete(viewUser._id)}
                    className="text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Trash2 size={18} /> Delete Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
