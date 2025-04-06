const publicSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLNwC1zVRxQRYm20Aaz4iynXUezIe5vaWWGJhtnathB6rerHyCifpFWOlEXIw2QNejEmg6yfPcfhCM/pubhtml';
let originalData = [];
let currentPage = 1;
const rowsPerPage = 10;

window.addEventListener('DOMContentLoaded', init);

function init() {
  Tabletop.init({
    key: publicSpreadsheetURL,
    simpleSheet: true,
    callback: function(data) {
      originalData = data;
      displayTable(data);
    }
  });

  document.getElementById('searchInput').addEventListener('input', filterData);
  document.getElementById('searchBy').addEventListener('change', filterData);
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
  document.getElementById('prevBtn').addEventListener('click', () => changePage(-1));
  document.getElementById('nextBtn').addEventListener('click', () => changePage(1));
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function displayTable(data) {
  const tableBody = document.querySelector('#trackingTable tbody');
  tableBody.innerHTML = '';

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = data.slice(start, end);

  pageData.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.Date}</td>
      <td>${row['Customer Name']}</td>
      <td>${row.Location}</td>
      <td>${row.Courier}</td>
      <td>${row['Tracking ID']}</td>
      <td><a href="${row['Tracking Link']}" target="_blank">Track</a></td>
    `;
    tr.addEventListener('click', () => showModal(row));
    tableBody.appendChild(tr);
  });

  document.getElementById('pageInfo').textContent = `Page ${currentPage}`;
}

function filterData() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const searchBy = document.getElementById('searchBy').value;

  const filtered = originalData.filter(row =>
    row[searchBy] && row[searchBy].toLowerCase().includes(query)
  );

  currentPage = 1;
  displayTable(filtered);
}

function changePage(direction) {
  const totalPages = Math.ceil(originalData.length / rowsPerPage);
  currentPage += direction;

  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  displayTable(originalData);
}

function showModal(row) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');

  modalBody.innerHTML = `
    <h3>Tracking Details</h3>
    <p><strong>Date:</strong> ${row.Date}</p>
    <p><strong>Customer:</strong> ${row['Customer Name']}</p>
    <p><strong>Location:</strong> ${row.Location}</p>
    <p><strong>Courier:</strong> ${row.Courier}</p>
    <p><strong>Tracking ID:</strong> ${row['Tracking ID']}</p>
    <p><a href="${row['Tracking Link']}" target="_blank">Go to Tracking</a></p>
  `;
  modal.classList.remove('hidden');
}
