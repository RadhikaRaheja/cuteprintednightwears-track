const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKKzDCXAx_Yg7AzpqRcb8ulYErjzrPAmpzyEVLVWLPjQIv_EicraRL0vHf3VPmJ3EOIgDRgtDkewNR/pub?output=csv';

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch(SHEET_URL);
  const csvText = await response.text();
  const data = parseCSV(csvText);

  const filteredData = data.filter(entry => {
    const entryDate = new Date(entry['Date']);
    const today = new Date();
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
    return entryDate >= threeMonthsAgo;
  });

  renderTable(filteredData);

  document.getElementById('searchInput').addEventListener('input', e => {
    const searchTerm = e.target.value.toLowerCase();
    const results = filteredData.filter(row =>
      Object.values(row).some(val =>
        val.toLowerCase().includes(searchTerm)
      )
    );
    renderTable(results);
  });
});

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() ?? '';
    });
    return row;
  });
}

function renderTable(data) {
  const container = document.getElementById('tableContainer');
  if (data.length === 0) {
    container.innerHTML = '<p>No records found.</p>';
    return;
  }

  const headers = Object.keys(data[0]);
  let html = '<table><thead><tr>';
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    headers.forEach(key => {
      let cell = row[key];
      if (key.toLowerCase().includes('courier')) {
        // Optional: hyperlink logic from 'CourierMapping'
        cell = `<a href=\"https://www.google.com/search?q=${cell}+courier+tracking\" target=\"_blank\">${cell}</a>`;
      }
      html += `<td>${cell}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}
