// Mock Report API

export const jsonReportAPI = async (params) => {
  return { data: { data: [] } };
};

export const pdfReportAPI = async (params) => {
  // Return an empty blob to simulate file download
  return { data: new Blob(["Dummy PDF"], { type: "application/pdf" }) };
};

export const excelReportAPI = async (params) => {
  // Return an empty blob to simulate file download
  return { data: new Blob(["Dummy Excel"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }) };
};
