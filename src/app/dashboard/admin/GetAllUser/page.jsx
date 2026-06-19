"use client";
import { useEffect, useState, useMemo } from "react";
import {
  getAllUsersOnlyAPI,
  getAllAdminsOnlyAPI,
  getAllSuperAdminsOnlyAPI,
} from "../../../../api/user.api";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const roleStyles = {
  USER: "bg-blue-500/20 text-blue-300",
  ADMIN: "bg-green-500/20 text-green-300",
  SUPER_ADMIN: "bg-purple-500/20 text-purple-300",
};

const GetAllUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [createdByFilter, setCreatedByFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      let res;

      if (user?.role === "ADMIN") {
        if (roleFilter === "ADMIN") res = await getAllAdminsOnlyAPI();
        else if (roleFilter === "SUPER_ADMIN")
          res = await getAllSuperAdminsOnlyAPI();
        else res = await getAllUsersOnlyAPI();
      }

      if (user?.role === "SUPER_ADMIN") {
        res = await getAllUsersOnlyAPI();
      }

      setUsers(res?.data?.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setPage(1);
  }, [roleFilter]);

  // UNIQUE CREATED BY LIST
  const createdByList = useMemo(() => {
    return [
      ...new Set(users.map((u) => u.createdByName).filter(Boolean)),
    ];
  }, [users]);

  // FILTER USERS
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile?.includes(search);

      const matchRole =
        roleFilter === "ALL" || u.role === roleFilter;

      const matchCreator =
        createdByFilter === "ALL" ||
        u.createdByName === createdByFilter;

      return matchSearch && matchRole && matchCreator;
    });
  }, [users, search, roleFilter, createdByFilter]);

  // PAGINATION
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">👥 Users Management</h2>
        <p className="text-sm text-white/60">Manage users & roles</p>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name or mobile..."
          className="w-full md:w-64 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        {/* ROLE FILTER */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
        >
          <option value="ALL">All Roles</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER ADMIN</option>
        </select>

        {/* CREATED BY FILTER */}
        <select
          value={createdByFilter}
          onChange={(e) => setCreatedByFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
        >
          <option value="ALL">All Creators</option>
          {createdByList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <table className="w-full text-sm text-white">
          <thead className="bg-white/10 text-white/80">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Role</th>
              <th className="p-4">Created By</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              paginatedUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={u.profilePhoto?.url || "/avatar.png"}
                      className="w-9 h-9 rounded-full border border-white/20"
                      alt=""
                    />
                    <span className="font-medium">{u.name}</span>
                  </td>

                  <td className="p-4">{u.mobile}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* FIXED CREATED BY */}
                  <td className="p-4 text-xs">
                    {u.createdByName ? (
                      <>
                        <p className="font-medium">{u.createdByName}</p>
                        <p className="text-white/50">{u.createdByRole}</p>
                      </>
                    ) : (
                      <span className="text-white/50">SYSTEM</span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {u.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/admin/users/${u._id}`)
                      }
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u) => (
          <div
            key={u._id}
            className="rounded-2xl p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={u.profilePhoto?.url || "/avatar.png"}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-xs text-white/60">{u.mobile}</p>
                <p className="text-xs text-white/50">
                  Created By: {u.createdByName || "SYSTEM"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs mb-2">
              <span className={`px-3 py-1 rounded-full ${roleStyles[u.role]}`}>
                {u.role}
              </span>

              <span
                className={`px-3 py-1 rounded-full ${
                  u.isActive
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {u.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <button
              onClick={() =>
                navigate(`/dashboard/admin/users/${u._id}`)
              }
              className="mt-3 w-full py-2 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 text-sm font-semibold"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-6 text-white">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white/10 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-white/10 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GetAllUser;
