import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

const checkAuth = (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET(req) {
  try {
    const decoded = checkAuth(req);
    if (!decoded || decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized: Super Admin access required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");
    const targetYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    // 1. Fetch KPI Aggregates concurrently
    const [
      totalUsersCount,
      usersByRole,
      approvedDonationsAgg,
      pendingDonationsCount,
      pendingFundRequestsCount,
      fundUsagesAgg,
      fundsAgg,
      donationsForYear,
      fundUsagesForYear,
      usersList,
      recentDonations,
      recentUsers
    ] = await Promise.all([
      // Total active users
      prisma.user.count({ where: { isDeleted: false } }).catch(() => 0),
      
      // Users grouped by role
      prisma.user.groupBy({
        by: ['role'],
        where: { isDeleted: false },
        _count: { role: true }
      }).catch(() => []),

      // Total donations sum (status: Success or Approved)
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: { in: ["Success", "Approved"] } }
      }).catch(() => ({ _sum: { amount: 0 } })),

      // Pending donations count
      prisma.donation.count({
        where: { status: "Pending" }
      }).catch(() => 0),

      // Pending fund requests count
      prisma.fundRequest.count({
        where: { status: "Pending" }
      }).catch(() => 0),

      // Fund usage total sum from FundUsage model
      prisma.fundUsage.aggregate({
        _sum: { amount: true }
      }).catch(() => ({ _sum: { amount: 0 } })),

      // Used amount total from Fund model
      prisma.fund.aggregate({
        _sum: { usedAmount: true }
      }).catch(() => ({ _sum: { usedAmount: 0 } })),

      // Donations for the specific target year
      prisma.donation.findMany({
        where: {
          year: targetYear,
          status: { in: ["Success", "Approved"] }
        },
        select: {
          id: true,
          amount: true,
          month: true,
          donorId: true,
          donorName: true,
          collectedById: true
        }
      }).catch(() => []),

      // Fund usages for target year
      prisma.fundUsage.findMany({
        where: {
          createdAt: {
            gte: new Date(`${targetYear}-01-01T00:00:00.000Z`),
            lte: new Date(`${targetYear}-12-31T23:59:59.999Z`)
          }
        },
        select: {
          id: true,
          amount: true,
          createdAt: true
        }
      }).catch(() => []),

      // All users basic info for role mapping & monthly stats
      prisma.user.findMany({
        where: { isDeleted: false },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      }).catch(() => []),

      // Recent 5 donations
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          donorName: true,
          amount: true,
          status: true,
          month: true,
          year: true,
          createdAt: true
        }
      }).catch(() => []),

      // Recent 5 users
      prisma.user.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      }).catch(() => [])
    ]);

    // Role Counts
    let superAdminCount = 0;
    let adminCount = 0;
    let userCount = 0;

    usersByRole.forEach(item => {
      if (item.role === "SUPER_ADMIN") superAdminCount = item._count.role;
      if (item.role === "ADMIN") adminCount = item._count.role;
      if (item.role === "USER") userCount = item._count.role;
    });

    const totalDonations = (approvedDonationsAgg._sum && approvedDonationsAgg._sum.amount) ? approvedDonationsAgg._sum.amount : 0;
    const pendingApprovals = (pendingDonationsCount || 0) + (pendingFundRequestsCount || 0);
    const fundUses = (fundUsagesAgg._sum && fundUsagesAgg._sum.amount) ? fundUsagesAgg._sum.amount : ((fundsAgg._sum && fundsAgg._sum.usedAmount) ? fundsAgg._sum.usedAmount : 0);

    // Map user roles for quick lookup
    const userRoleMap = new Map();
    usersList.forEach(u => userRoleMap.set(u.id, u.role));

    // Construct 12 Month (Jan to Dec) Data
    const monthlyTrends = MONTH_NAMES.map((monthName, idx) => {
      const monthNumber = idx + 1;

      // Filter donations for this month
      const monthDonations = donationsForYear.filter(d => d.month === monthNumber);
      const totalMonthDonationAmount = monthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

      // Donations breakdown by role
      let superAdminDonation = 0;
      let adminDonation = 0;
      let userDonation = 0;

      monthDonations.forEach(d => {
        const role = userRoleMap.get(d.donorId) || "USER";
        if (role === "SUPER_ADMIN") superAdminDonation += d.amount || 0;
        else if (role === "ADMIN") adminDonation += d.amount || 0;
        else userDonation += d.amount || 0;
      });

      // Filter fund usages for this month
      const monthFundUsages = fundUsagesForYear.filter(f => {
        const date = new Date(f.createdAt);
        return date.getMonth() === idx;
      });
      const totalMonthFundUse = monthFundUsages.reduce((sum, f) => sum + (f.amount || 0), 0);

      // Cumulative / Joined users up to this month
      const usersUpToMonth = usersList.filter(u => {
        const createdDate = new Date(u.createdAt);
        return createdDate.getFullYear() < targetYear || 
          (createdDate.getFullYear() === targetYear && createdDate.getMonth() <= idx);
      });

      const mSuperAdmins = usersUpToMonth.filter(u => u.role === "SUPER_ADMIN").length;
      const mAdmins = usersUpToMonth.filter(u => u.role === "ADMIN").length;
      const mUsers = usersUpToMonth.filter(u => u.role === "USER").length;

      return {
        month: monthName,
        monthIndex: monthNumber,
        amount: totalMonthDonationAmount,
        fundUses: totalMonthFundUse,
        superAdminDonation,
        adminDonation,
        userDonation,
        userBreakdown: {
          superAdminCount: mSuperAdmins,
          adminCount: mAdmins,
          userCount: mUsers,
          total: usersUpToMonth.length
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsersCount || usersList.length,
        totalDonations,
        pendingApprovals,
        fundUses,
        roleBreakdown: {
          superAdminCount,
          adminCount,
          userCount,
          totalUsers: totalUsersCount || usersList.length
        },
        monthlyTrends,
        recentDonations: recentDonations.map(d => ({
          _id: d.id,
          name: d.donorName || "Unknown",
          amount: d.amount,
          date: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : `${d.year}-${String(d.month).padStart(2, '0')}-01`,
          status: d.status
        })),
        recentUsers: recentUsers.map(u => ({
          _id: u.id,
          name: u.name || "User",
          email: u.email || `${u.name ? u.name.toLowerCase().replace(/\s+/g, '') : 'user'}@example.com`,
          role: u.role,
          date: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }))
      }
    });

  } catch (error) {
    console.error("Super Admin Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load dashboard data" }, { status: 500 });
  }
}
