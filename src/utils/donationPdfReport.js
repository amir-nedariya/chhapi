import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fullMonthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getMonthlyAmountForUser = (user, year, monthIndex) => {
  let ms = user?.monthlyStats || {};
  if (typeof ms === "string") {
    try {
      ms = JSON.parse(ms);
    } catch (e) {
      ms = {};
    }
  }

  const shortName = monthsList[monthIndex]; // "Jan"
  const fullName = fullMonthsList[monthIndex]; // "January"
  const numKey = String(monthIndex + 1); // "1"

  let yearData = ms[String(year)] || ms[year];

  // Fallback for flat structure without year wrapper
  if (!yearData && (ms["Jan"] !== undefined || ms["January"] !== undefined || ms["jan"] !== undefined)) {
    if (String(year) === String(new Date().getFullYear())) {
      yearData = ms;
    }
  }

  if (!yearData || typeof yearData !== "object") return 0;

  const val =
    yearData[shortName] ??
    yearData[fullName] ??
    yearData[shortName.toLowerCase()] ??
    yearData[numKey] ??
    0;

  return Number(val) || 0;
};

export const createDonationPDFDocument = ({
  users = [],
  year = new Date().getFullYear(),
  title = "CHHAPI DONATION STATEMENT"
}) => {
  const doc = new jsPDF("l", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. BRAND LOGO & HEADER (MATCHING USER LIST UI TEAL THEME)
  const logoX = 14;
  const logoY = 9;
  const logoSize = 18;

  // Teal Emblem Container matching Image 2 UI buttons (#007A78)
  doc.setFillColor(0, 122, 120); // UI Teal #007A78
  doc.roundedRect(logoX, logoY, logoSize, logoSize, 3.5, 3.5, "F");

  // Logo Letters "CD" in White
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("CD", logoX + 4.5, logoY + 12.5);

  // Title & Subtitle (Next to Logo)
  doc.setTextColor(0, 122, 120); // Teal Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Chhapi Donation Statement", logoX + logoSize + 6, 16);

  doc.setTextColor(71, 85, 105); // Slate 600
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Annual Donation Report — Year ${year}`, logoX + logoSize + 6, 22.5);

  const formattedDate = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`Generated: ${formattedDate}  |  Chhapi Support Portal`, logoX + logoSize + 6, 28.5);

  // 2. COMPUTATIONS (WITHOUT ROLE COLUMN)
  const monthTotals = Array(12).fill(0);
  let grandTotal = 0;
  let activeDonorsCount = 0;

  const tableBody = users.map((u, idx) => {
    let userYearTotal = 0;
    const monthCells = monthsList.map((_, mIdx) => {
      const amt = getMonthlyAmountForUser(u, year, mIdx);
      userYearTotal += amt;
      monthTotals[mIdx] += amt;
      return amt > 0 ? `${amt}` : "-";
    });

    const finalTotal = userYearTotal > 0 ? userYearTotal : Number(u.totalDonations || 0);
    grandTotal += finalTotal;
    if (finalTotal > 0) activeDonorsCount++;

    return [
      idx + 1,
      (u.name || "N/A").toUpperCase(),
      u.mobile || "N/A",
      ...monthCells,
      `RS. ${finalTotal.toLocaleString("en-IN")}`,
    ];
  });

  // 3. SUMMARY BOX (RIGHT TOP - TEAL & EMERALD ACCENTS)
  const sumBoxWidth = 110;
  const sumBoxHeight = 22;
  const sumBoxX = pageWidth - sumBoxWidth - 14;
  const sumBoxY = 7.5;

  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.4);
  doc.roundedRect(sumBoxX, sumBoxY, sumBoxWidth, sumBoxHeight, 3, 3, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  // Total Collection
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL COLLECTION:", sumBoxX + 6, sumBoxY + 9);
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text(`RS. ${grandTotal.toLocaleString("en-IN")}`, sumBoxX + 42, sumBoxY + 9);

  // Total Users
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL USERS:", sumBoxX + 6, sumBoxY + 17);
  doc.setTextColor(15, 23, 42);
  doc.text(`${users.length}`, sumBoxX + 42, sumBoxY + 17);

  // Active Donors
  doc.setTextColor(100, 116, 139);
  doc.text("ACTIVE DONORS:", sumBoxX + 65, sumBoxY + 17);
  doc.setTextColor(0, 122, 120); // Teal
  doc.text(`${activeDonorsCount}`, sumBoxX + 93, sumBoxY + 17);

  // Top Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, 33, pageWidth - 14, 33);

  // 4. GRAND TOTAL SUMMARY ROW (WITHOUT ROLE COLUMN)
  const totalRow = [
    "",
    "GRAND TOTAL",
    "",
    ...monthTotals.map((amt) => (amt > 0 ? `${amt}` : "-")),
    `RS. ${grandTotal.toLocaleString("en-IN")}`,
  ];

  // Headers without ROLE column
  const headers = [["#", "DONOR NAME", "MOBILE", ...monthsList, "TOTAL"]];

  // 5. RENDER CLEAN TEAL TABLE MATCHING IMAGE 2 USER LIST UI
  autoTable(doc, {
    startY: 37,
    margin: { left: 14, right: 14 },
    head: headers,
    body: [...tableBody, totalRow],
    theme: "grid",
    tableLineColor: [226, 232, 240], // Light clean border
    tableLineWidth: 0.25,
    headStyles: {
      fillColor: [0, 122, 120], // Teal header matching Image 2 UI table!
      textColor: [255, 255, 255], // Pure White Text
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "center",
      cellPadding: { top: 3.5, bottom: 3.5, left: 1, right: 1 }
    },
    bodyStyles: {
      fontSize: 8,
      halign: "center",
      textColor: [30, 41, 59],
      cellPadding: { top: 3, bottom: 3, left: 1, right: 1 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Light clean alternate row
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 45, halign: "left", fontStyle: "bold", textColor: [15, 23, 42] },
      2: { cellWidth: 28, halign: "center", textColor: [71, 85, 105] },
      ...Object.fromEntries(
        monthsList.map((_, i) => [3 + i, { cellWidth: 13.5, halign: "center" }])
      ),
      15: { cellWidth: 24, halign: "right", fontStyle: "bold", textColor: [0, 122, 120] },
    },
    didParseCell: (data) => {
      // Clean cell text colors: Paid amounts green, unpaid muted (no harsh cell background fills!)
      if (data.section === "body" && data.row.index < tableBody.length) {
        if (data.column.index >= 3 && data.column.index <= 14) {
          if (data.cell.text[0] !== "-") {
            data.cell.styles.textColor = [5, 150, 105]; // Emerald 600
            data.cell.styles.fontStyle = "bold";
          } else {
            data.cell.styles.textColor = [148, 163, 184]; // Muted Slate 400
          }
        }
      }

      // Grand Total Footer Row Styling
      if (data.row.index === tableBody.length) {
        data.cell.styles.fillColor = [241, 245, 249]; // Slate 100
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [15, 23, 42];
        if (data.column.index === 15) {
          data.cell.styles.textColor = [0, 122, 120]; // Teal 700
          data.cell.styles.fontSize = 8.5;
        }
      }
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth - 25, pageHeight - 8);
      doc.text("Chhapi Donation Management System — Official Statement", 14, pageHeight - 8);
    },
  });

  return doc;
};

export const exportAllUsersDonationPDF = ({ users, year, title }) => {
  const doc = createDonationPDFDocument({ users, year, title });
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

export const getDonationPDFBase64 = ({ users, year, title }) => {
  const doc = createDonationPDFDocument({ users, year, title });
  return doc.output("datauristring");
};
