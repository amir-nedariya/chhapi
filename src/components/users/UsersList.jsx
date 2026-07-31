"use client";
import { useEffect, useState, useMemo } from "react";
import {
  getAllUsersAPI,
  getCreatorsAPI,
} from "../../api/user.api";
import { Eye, UserPlus, BadgeCheck, AlertCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useSidebarColor } from "../../hooks/useSidebarColor";
import CreateUserModal from "../common/CreateUserModal";
import PasswordCell from "../common/PasswordCell";
import Table from "../common/Table";
import FilterBar from "../common/FilterBar";
import Button from "../common/Button";

const ITEMS_PER_PAGE = 10;

const roleStyles = {
  USER: "bg-blue-100 text-blue-700 border border-blue-200 font-medium",
  ADMIN: "bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium",
  SUPER_ADMIN: "bg-purple-100 text-purple-700 border border-purple-200 font-medium",
};

const UsersList = ({ currentRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sidebarColor = useSidebarColor();
  
  // Base path for navigation
  const basePath = currentRole === "SUPER_ADMIN" ? "/dashboard/super-admin" :
                   currentRole === "ADMIN" ? "/dashboard/admin" : 
                   "/dashboard/user";

  const getAvatarUrl = (userObj) => {
    if (userObj?.profilePhoto?.url) {
      if (userObj.profilePhoto.url.includes("ui-avatars.com")) {
        return userObj.profilePhoto.url.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`);
      }
      return userObj.profilePhoto.url;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj?.name || "User")}&background=${sidebarColor}&color=fff`;
  };

  const getPaymentBadge = (userObj) => {
    if (userObj.role !== "USER") return null;
    
    if (userObj.paymentStatus === "REGULAR") {
      return (
        <span title="Regular Donor" className="flex items-center">
          <BadgeCheck className="text-blue-500" size={18} fill="currentColor" stroke="white" />
        </span>
      );
    } else if (userObj.paymentStatus === "PARTIAL") {
      return (
        <span title="Partial Donor" className="flex items-center">
          <AlertCircle className="text-amber-500" size={16} />
        </span>
      );
    } else if (userObj.paymentStatus === "NONE") {
      return (
        <span title="No Donation" className="flex items-center">
          <XCircle className="text-rose-500" size={16} />
        </span>
      );
    }
    return null;
  };

  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [params, setParams] = useState({ search: "", role: "ALL", createdBy: "ALL" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatorsList, setCreatorsList] = useState([]);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersAPI({
        page,
        limit: ITEMS_PER_PAGE,
        search: params.search,
        role: params.role,
        creator: params.createdBy
      });
      setUsers(res?.data?.data || []);
      setTotalItems(res?.data?.total || 0);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // FETCH CREATORS
  const fetchCreators = async () => {
    try {
      const res = await getCreatorsAPI();
      setCreatorsList(res?.data?.data || []);
    } catch {
      console.error("Failed to fetch creators");
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, params.role, params.createdBy, params.search]);

  // PAGINATION
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search name or mobile..." },
    {
      type: "select",
      name: "role",
      options: [
        { label: "All Roles", value: "ALL" },
        { label: "USER", value: "USER" },
        { label: "ADMIN", value: "ADMIN" },
        { label: "SUPER ADMIN", value: "SUPER_ADMIN" }
      ]
    },
    {
      type: "select",
      name: "createdBy",
      options: [
        { label: "All Creators", value: "ALL" },
        ...creatorsList.map(name => ({ label: name, value: name }))
      ]
    }
  ];

  const columns = [
    {
      key: "user",
      header: "User",
      render: (_, u) => (
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(u)}
            className="w-9 h-9 rounded-full border border-gray-200 object-cover"
            alt=""
          />
          <div className="font-medium text-slate-800 flex items-center gap-1.5">
            {u.name}
            {getPaymentBadge(u)}
          </div>
        </div>
      )
    },
    { key: "mobile", header: "Mobile" },
    ...(currentRole === "SUPER_ADMIN" ? [{
      key: "password",
      header: "Password",
      align: "center",
      render: (_, u) => <PasswordCell password={u.password} />
    }] : []),
    {
      key: "role",
      header: "Role",
      render: (_, u) => (
        <span className={`px-2 py-0.5 rounded-sm text-[11px] font-semibold ${roleStyles[u.role]}`}>
          {u.role.replace("_", " ")}
        </span>
      )
    },
    {
      key: "createdBy",
      header: "Created By",
      render: (_, u) => (
        u.createdByName ? (
          <>
            <p className="font-medium text-slate-800">{u.createdByName}</p>
            <p className="text-gray-400 text-xs">{u.createdByRole}</p>
          </>
        ) : (
          <span className="text-gray-400">SYSTEM</span>
        )
      )
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (_, u) => (
        <span
          className={`px-2 py-0.5 rounded-sm text-[11px] font-semibold border ${
            u.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {u.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      )
    },
    {
      key: "action",
      header: "View",
      align: "center",
      render: (_, u) => (
        <button
          onClick={(e) => {
             e.stopPropagation();
             navigate(`${basePath}/users/${u._id}`);
          }}
          className="text-teal-700 hover:text-teal-900 transition flex items-center justify-center w-full"
        >
          <Eye size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 All Users</h2>
          <p className="text-sm text-gray-500">View platform members and roles</p>
        </div>
        {currentRole !== "USER" && (
          <Button 
             variant="solid" 
             onClick={() => setIsModalOpen(true)}
             iconLeft={UserPlus}
          >
            Create User
          </Button>
        )}
      </div>

      {/* SEARCH + FILTERS */}
      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      {/* TABLE */}
      <Table 
        columns={columns} 
        data={users} 
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setPage
        }}
        emptyStateProps={{
          entityName: "Users",
          search: params.search,
          onClearSearch: () => setParams(p => ({ ...p, search: "" }))
        }}
      />

      {currentRole !== "USER" && (
        <CreateUserModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            fetchUsers();
            setPage(1);
          }}
        />
      )}
    </div>
  );
};

export default UsersList;
