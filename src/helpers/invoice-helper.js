import { defaultInvoiceParticulars } from "../utils/constants";

export const getNextInvoiceNumber = (invoices) => {
  if (!invoices || invoices.length === 0) return "0001";

  // 🔥 get latest invoice (assuming sorted latest first)
  const latest = invoices[0]?.invoiceNo || "0000";

  const nextNumber = parseInt(latest, 10) + 1;

  return String(nextNumber).padStart(4, "0");
};

export const defaultInvoiceItems = defaultInvoiceParticulars.map((p, i) => ({
  key: Date.now() + i, // 🔥 must
  particular: p,
  qty: 1,
  rate: 0,
  amount: 0,
}));

import dayjs from "dayjs";

export const formatDate = (date) => {
  if (!date) return null;

  // ✅ if already string like "22-03-2026"
  if (typeof date === "string") {
    // convert manually
    return dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD");
  }

  // ✅ if dayjs object
  if (date?.format) {
    return date.format("YYYY-MM-DD");
  }

  // fallback
  return dayjs(date).format("YYYY-MM-DD");
};

export const formatDateTable = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getFinancialYear = (date) => {
  if (!date) return getFinancialYear(new Date());

  let d;

  // If format is DD-MM-YYYY
  if (typeof date === "string" && date.includes("-")) {
    const [day, month, year] = date.split("-");
    d = new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) {
    return null;
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

export const formatINR = (amount) => {
  if (amount === null || amount === undefined) return "0.00";

  return Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
