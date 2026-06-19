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
    "bg-purple-600/20 text-purple-300 border border-purple-500/40",
  ADMIN:
    "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40",
  USER:
    "bg-sky-600/20 text-sky-300 border border-sky-500/40",
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
        {/* <h2 className="text-xl sm:text-2xl font-semibold text-white">
          👥 User Management
        </h2> */}
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white">
  <Users size={22} className="text-cyan-400" />
  User Management
</h2>


        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* SEARCH */}
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search user..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 text-white
              border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          {/* FILTER */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44 px-4 py-2 rounded-xl bg-[#0b1224] text-white
            border border-white/20 focus:ring-2 focus:ring-cyan-400"
          >
            <option className="bg-[#0b1224]" value="ALL">All Roles</option>
            <option className="bg-[#0b1224]" value="USER">User</option>
            <option className="bg-[#0b1224]" value="ADMIN">Admin</option>
            <option className="bg-[#0b1224]" value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-xl">
        <table className="w-full text-sm text-white">
          <thead className="bg-white/10 text-white/60">
            <tr>
              <th className="p-4 text-left">User Info</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={u.profilePhoto?.url || "/avatar.jpeg"}
                    className="w-10 h-10 rounded-full border border-white/30"
                  />
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-white/50">{u.mobile}</p>
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
                      className={`w-11 h-6 rounded-full p-1 flex items-center ${
                        u.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <span
                        className={`bg-white w-4 h-4 rounded-full transition ${
                          u.isActive ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  )}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => openUserModal(u._id)}
                    className="text-cyan-400 hover:scale-110"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u) => (
          <div key={u._id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <img
                src={u.profilePhoto?.url || "/avatar.jpeg"}
                className="w-12 h-12 rounded-full border border-white/30"
              />
              <div className="flex-1">
                <p className="font-semibold text-white">{u.name}</p>
                <p className="text-xs text-white/50">{u.mobile}</p>
              </div>
              <button onClick={() => openUserModal(u._id)} className="text-cyan-400">
                <Eye size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className={`px-3 py-1 rounded-full text-xs ${roleStyles[u.role]}`}>
                {u.role.replace("_", " ")}
              </span>

              {u.role !== "SUPER_ADMIN" && (
                <button
                  onClick={() => toggleStatus(u)}
                  className={`w-11 h-6 rounded-full p-1 flex items-center ${
                    u.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full transition ${
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
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300"
          >
            <ChevronLeft />
          </button>

          <span className="text-white/70 text-sm">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-[#0b1224] w-[95%] sm:max-w-md rounded-2xl border border-white/20">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">User Details</h3>
              <button onClick={() => setViewUser(null)} className="text-white/50">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={viewUser.profilePhoto?.url || "/avatar.jpeg"}
                  className="w-16 h-16 rounded-full border border-white/30"
                />
                <div>
                  <p className="text-lg font-semibold text-white">{viewUser.name}</p>
                  <p className="text-sm text-white/50">{viewUser.mobile}</p>
                </div>
              </div>

              {viewUser.role !== "SUPER_ADMIN" && (
                <select
                  value={viewUser.role}
                  onChange={(e) => changeRole(viewUser._id, e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              )}

              <div className="flex gap-6">
                <label className="cursor-pointer text-cyan-400 flex items-center gap-1">
                  <Upload size={16} /> Upload
                  <input hidden type="file" accept="image/*"
                    onChange={(e) =>
                      handlePhotoUpload(viewUser._id, e.target.files[0])
                    }
                  />
                </label>

                {viewUser.profilePhoto && (
                  <button
                    onClick={() => handlePhotoDelete(viewUser._id)}
                    className="text-red-400 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
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
