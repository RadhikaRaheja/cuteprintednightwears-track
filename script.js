const sheetId = "1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw";
const sheetName = "Daily Sales record";
const courierMappingSheet = "CourierMapping";
const query = encodeURIComponent("SELECT A, B, C, D, E");
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}&tq=${query}`;

const courierLinkMap = {};

function loadCourierLinks() {
  const courierQuery = encodeURIComponent("SELECT A, B");
  const courierURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${courierMappingSheet}&tq=${courierQuery}`;

  return fetch(courierURL)
    .then(res => res.text())
    .then(data => {
      const json = JSON.parse(data.substr(47).slice(0, -2));
      json.table.rows.forEach(row => {
        const name = row.c[0]?.v?.trim();
        const link = row.c[1]?.v?.trim();
        if (name && link) {
          courierLinkMap[name.toLowerCase()] = link;
        }
      });
    });
}

function fetchData() {
  fetch(base)
    .then(res => res.text())
    .then(rep => {
      const data = JSON.parse(rep.substr(47).slice(0, -2));
      const rows = data.table.rows;
      const now = new Date();
      const past3Months = new Date();
      past3Months.setMonth(now.getMonth() - 3);

      const table = document.getElementById("tableBody");
      table.innerHTML = "";

      rows.forEach(row => {
        const [dateCell, nameCell, locationCell, courierCell, trackingIDCell] = row.c;

        const rowDate = new Date(dateCell?.f || dateCell?.v);
        if (rowDate < past3Months) return;

        const courierName = courierCell?.v || "";
        const courierLink = courierLinkMap[courierName.toLowerCase()] || "#";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${dateCell?.f || ""}</td>
          <td>${nameCell?.v || ""}</td>
          <td>${locationCell?.v || ""}</td>
          <td><a href="${courierLink}" target="_blank">${courierName}</a></td>
          <td>${trackingIDCell?.v || ""}</td>
          <td><a href="${courierLink}" target="_blank">Track</a></td>
        `;
        table.appendChild(tr);
      });
    });
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  input.addEventListener("keyup", function () {
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll("#tableBody tr");
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });
}

loadCourierLinks().then(() => {
  fetchData();
  setupSearch();
});
