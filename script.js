let data = [], filteredData = [], currentPage = 1, entriesPerPage = 10;

function handleSearchFieldChange() {
  const field = document.getElementById('searchField').value;
  document.getElementById('searchInput').style.display = field === 'Date' ? 'none' : 'inline-block';
  document.getElementById('dateInput').style.display = field === 'Date' ? 'inline-block' : 'none';
}

function fetchData() {
  fetch('https://opensheet.elk.sh/1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw/Daily%20Sales%20record')
    .then(response => response.json())
    .then(result => {
      data = result.filter(row => row["Date"]);
      filteredData = data;
      renderResults();
    });
}

function renderResults() {
  const table = document.getElementById('resultsTable');
  table.innerHTML = "";
  paginate(filteredData, currentPage).forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row["Date"] || '-'}</td>
      <td>${row["Customer Name"]}</td>
      <td>${row["Location (Pincode)"]}</td>
      <td>${row["Courier Name"] || '-'}</td>
      <td>${row["Tracking ID"] || '-'}</td>
    `;
    tr.onclick = () => showPopup(row);
    table.appendChild(tr);
  });
}

function showPopup(row) {
  document.getElementById('popupContent').innerHTML = `
    <p><b>Name:</b> ${row["Customer Name"]}</p>
    <p><b>Pincode:</b> ${row["Location (Pincode)"]}</p>
    <p><b>Tracking ID:</b> ${row["Tracking ID"] || '-'}</p>
  `;
  document.getElementById('popupOverlay').style.display = 'flex';
}

function hidePopup() {
  document.getElementById('popupOverlay').style.display = 'none';
}

fetchData();
