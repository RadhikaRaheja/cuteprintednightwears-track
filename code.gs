function doGet() {
  return HtmlService.createTemplateFromFile("Index").evaluate().setTitle("Order Tracker").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function fetchTrackingData() {
  const sheet = SpreadsheetApp.openById("1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw");
  const dataSheet = sheet.getSheetByName("Daily Sales record");

  const values = dataSheet.getDataRange().getValues();
  const headers = values[0];
  const rows = values.slice(1);

  const data = rows.map(row => {
    let item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });

  return data; // JSON is handled on the client side
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
