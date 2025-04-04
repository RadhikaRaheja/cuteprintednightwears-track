let data = [], filteredData = [], couriers = {}, currentPage = 1, entriesPerPage = 10;

async function fetchData() {
  document.querySelector('.loading').style.display = 'block';
  const response = await fetch('https://opensheet.elk.sh/1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw/Daily%20Sales%20record');
  data = await response.json();
  filteredData = data;
  document.querySelector('.loading').style.display = 'none';
  renderResults();
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
}

function filterResults() {
  let field = document.getElementById('searchField').value;
  let query = document.getElementById('searchInput').value.toLowerCase();
  if (field === 'Date') query = formatDate(document.getElementById('dateInput').value);

  filteredData = data.filter(row => {
    if (!row[field]) return false;
    let value = field === 'Date' ? formatDate(row[field]) : row[field].toLowerCase();
    return value.includes(query);
  });

  currentPage = 1;
  renderResults();
}

function renderResults() {
  const table = document.getElementById('resultsTable');
  table.innerHTML = '';
  paginate(filteredData, currentPage).forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(row.Date)}</td>
      <td>${row["Customer Name"]}</td>
      <td>${row["Location (Pincode)"]}</td>
      <td>${row["Courier Name"]}</td>
      <td>${row["Tracking ID"]}</td>
    `;
    table.appendChild(tr);
  });

  document.getElementById('totalPages').textContent = Math.ceil(filteredData.length / entriesPerPage);
}

function paginate(data, page) {
  return data.slice((page - 1) * entriesPerPage, page * entriesPerPage);
}

function prevPage() { if (currentPage > 1) currentPage--; renderResults(); }
function nextPage() { if (currentPage < Math.ceil(filteredData.length / entriesPerPage)) currentPage++; renderResults(); }

fetchData();
