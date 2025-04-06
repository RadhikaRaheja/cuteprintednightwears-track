const publicSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLNwC1zVRxQRYm20Aaz4iynXUezIe5vaWWGJhtnathB6rerHyCifpFWOlEXIw2QNejEmg6yfPcfhCM/pubhtml';
let data = [], filteredData = [], couriers = {}, currentPage = 1, entriesPerPage = 10;

    function handleSearchFieldChange() {
      const field = document.getElementById('searchField').value;
      document.getElementById('searchInput').style.display = (field === 'Date' || field === 'Courier Name') ? 'none' : 'inline-block';
      document.getElementById('dateInput').style.display = field === 'Date' ? 'inline-block' : 'none';
      document.getElementById('courierDropdown').style.display = field === 'Courier Name' ? 'inline-block' : 'none';
    }

    function formatDate(inputDate) {
      const date = new Date(inputDate);
      if (isNaN(date)) return '';
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    }

    function showPopup(row) {
  const content = `
    <div class="popup-content">
      <p><b>Date:</b> ${formatDate(row.Date)}</p>
      <p><b>Name:</b> ${row["Customer Name"]}</p>
      <p><b>Location:</b> ${row["Location (Pincode)"]}</p>
      <p><b>Courier:</b> <a href="${couriers[row["Courier Name"]] || '#'}" target="_blank">${row["Courier Name"]}</a></p>
      <p><b>Tracking ID:</b> ${row["Tracking ID"]}</p>
    </div>
    <button class="close-btn" onclick="hidePopup()">Close</button>
  `;
  document.getElementById('popupContent').innerHTML = content;
  document.getElementById('popupOverlay').style.display = 'flex';
}
    function hidePopup() {
      document.getElementById('popupOverlay').style.display = 'none';
    }

    function paginate(data, page) {
      const start = (page - 1) * entriesPerPage;
      return data.slice(start, start + entriesPerPage);
    }

    function renderPaginationControls() {
      const totalPages = Math.ceil(filteredData.length / entriesPerPage);
      document.getElementById('totalPages').textContent = totalPages;
      document.getElementById('pageNumber').value = currentPage;
    }

    function prevPage() {
      if (currentPage > 1) {
        currentPage--;
        renderResults();
      }
    }

    function nextPage() {
      const totalPages = Math.ceil(filteredData.length / entriesPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderResults();
      }
    }

    function jumpToPage() {
      const input = parseInt(document.getElementById('pageNumber').value);
      const totalPages = Math.ceil(filteredData.length / entriesPerPage);
      if (input >= 1 && input <= totalPages) {
        currentPage = input;
        renderResults();
      }
    }

    async function fetchData() {
      document.querySelector('.loading').style.display = 'block';
      const response = await fetch('https://opensheet.elk.sh/1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw/Daily%20Sales%20record');
      let result = await response.json();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      data = result.filter(row => new Date(row.Date) >= threeMonthsAgo);
      filteredData = data;
      document.querySelector('.loading').style.display = 'none';
      renderResults();
    }

    async function loadCouriers() {
      const resp = await fetch('https://opensheet.elk.sh/1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw/CourierMapping');
      const map = await resp.json();
      const dropdown = document.getElementById('courierDropdown');
      map.forEach(entry => {
        couriers[entry['Courier Name']] = entry['Courier Website Link'];
        dropdown.innerHTML += `<option value="${entry['Courier Name']}">${entry['Courier Name']}</option>`;
      });
    }

    function filterResults() {
      let field = document.getElementById('searchField').value;
      let query = '';
      if (field === 'Date') query = formatDate(document.getElementById('dateInput').value);
      else if (field === 'Courier Name') query = document.getElementById('courierDropdown').value;
      else query = document.getElementById('searchInput').value.toLowerCase();

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
          <td><a href="${couriers[row["Courier Name"]] || '#'}" target="_blank">${row["Courier Name"]}</a></td>
          <td>${row["Tracking ID"]}</td>
        `;
        tr.onclick = () => showPopup(row);
        table.appendChild(tr);
      });
      renderPaginationControls();
    }

    fetchData();
    loadCouriers();
