const sheetURL = 'https://opensheet.elk.sh/1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw/Daily%20Sales%20record';
const courierMapURL = 'https://opensheet.elk.sh/1UMul8nt25GR8MUM-_EdwAR0q6Ne2ovPv_R-m1-CHeXw/CourierMapping';

let allData = [], courierMap = {};

async function fetchData() {
  const [records, couriers] = await Promise.all([
    fetch(sheetURL).then(res => res.json()),
    fetch(courierMapURL).then(res => res.json())
  ]);

  records.forEach(row => {
    if (row['Date']) {
      const entryDate = new Date(row['Date']);
      const today = new Date();
      const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
      if (entryDate >= threeMonthsAgo) {
        allData.push(row);
      }
    }
  });

  couriers.forEach(c => {
    courierMap[c['Courier Name']] = c['Link'];
  });

  renderTable(allData);
}

function renderTable(data) {
  const wrapper = document.getElementById('tableWrapper');
  let html = `<table><thead><tr>`;
  const keys = ['Date', 'Customer Name', 'Location-Pincode', 'Courier Name', 'Tracking ID'];
  keys.forEach(k => html += `<th>${k}</th>`);
  html += `</tr></thead><tbody>`;

  data.forEach(row => {
    html += `<tr onclick='showModal(${JSON.stringify(row).replace(/'/g, "\\'")})'>`;
    keys.forEach(k => {
      if (k === 'Courier Name' && courierMap[row[k]]) {
        html += `<td><a href="${courierMap[row[k]]}" target="_blank">${row[k]}</a></td>`;
      } else {
        html += `<td>${row[k] || ''}</td>`;
      }
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  wrapper.innerHTML = html;
}

function showModal(row) {
  const modal = document.getElementById('modal');
  const modalData = document.getElementById('modalData');
  modalData.innerHTML = Object.entries(row)
    .map(([key, value]) => `<p><strong>${key}</strong>: ${value}</p>`)
    .join('');
  modal.classList.remove('hidden');
}

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

document.getElementById('searchBox').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const filtered = allData.filter(row =>
    Object.values(row).some(v => v && v.toLowerCase().includes(query))
  );
  renderTable(filtered);
});

document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

fetchData();
