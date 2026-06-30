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

import { useSidebarColor } from "../../../../hooks/useSidebarColor";

const ITEMS_PER_PAGE = 10;

const roleStyles = {
  USER: "bg-blue-100 text-blue-700 border border-blue-200 font-medium",
  ADMIN: "bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium",
  SUPER_ADMIN: "bg-purple-100 text-purple-700 border border-purple-200 font-medium",
};

const GetAllUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sidebarColor = useSidebarColor();
  const getAvatarUrl = (userObj) => {
    if (userObj?.profilePhoto?.url) {
      if (userObj.profilePhoto.url.includes("ui-avatars.com")) {
        return userObj.profilePhoto.url.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`);
      }
      return userObj.profilePhoto.url;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj?.name || "User")}&background=${sidebarColor}&color=fff`;
  };

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
      <div className="mb-6 flex flex-col items-center text-center sm:items-start sm:text-left">
        <h2 className="text-2xl font-bold text-slate-800">👥 Users Management</h2>
        <p className="text-sm text-slate-500">Manage users & roles</p>
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
          className="w-full md:w-64 px-4 py-2 rounded-lg bg-white border border-gray-300 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition"
        />

        {/* ROLE FILTER */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition"
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
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition"
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
      <div className="hidden md:block overflow-x-auto rounded-2xl bg-white border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-slate-800">
          <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white border-b border-teal-950/20">
            <tr>
              <th className="p-4 text-left font-semibold">User</th>
              <th className="p-4 font-semibold">Mobile</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Created By</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">View</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              paginatedUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-100 hover:bg-slate-50 transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={getAvatarUrl(u)}
                      className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                      alt=""
                    />
                    <span className="font-medium text-slate-800">{u.name}</span>
                  </td>

                  <td className="p-4">{u.mobile}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[u.role]}`}
                    >
                      {u.role.replace("_", " ")}
                    </span>
                  </td>

                  {/* FIXED CREATED BY */}
                  <td className="p-4 text-xs">
                    {u.createdByName ? (
                      <>
                        <p className="font-medium text-slate-800">{u.createdByName}</p>
                        <p className="text-slate-500">{u.createdByRole}</p>
                      </>
                    ) : (
                      <span className="text-slate-500">SYSTEM</span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        u.isActive
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
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
                      className="text-cyan-600 hover:text-cyan-800 hover:scale-110 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u) => (
          <div
            key={u._id}
            className="rounded-2xl p-4 bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={getAvatarUrl(u)}
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                alt=""
              />
              <div>
                <p className="font-semibold text-slate-800">{u.name}</p>
                <p className="text-xs text-slate-500">{u.mobile}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Created By: <span className="font-medium text-slate-700">{u.createdByName || "SYSTEM"}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs mb-3 pt-3 border-t border-gray-100">
              <span className={`px-3 py-1 rounded-full ${roleStyles[u.role]}`}>
                {u.role.replace("_", " ")}
              </span>

              <span
                className={`px-3 py-1 rounded-full border font-medium ${
                  u.isActive
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {u.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <button
              onClick={() =>
                navigate(`/dashboard/admin/users/${u._id}`)
              }
              className="mt-2 w-full py-2 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-sm font-semibold transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center md:justify-end items-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm text-slate-600 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GetAllUser;
