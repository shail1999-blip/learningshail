// ========= CONFIG =========
// Frontend will call your Render backend, which returns JSON like:
// { symbol, price, change, changePct }

// Indian indices (demo symbols – your backend should understand them if you want).
const indiaIndices = [
  { name: "NIFTY 50", symbol: "NIFTYBEES" },
  { name: "NIFTY Bank", symbol: "BANKBEES" },
  { name: "SENSEX (ETF)", symbol: "SENSEXETF" }
];

// Watchlist (Indian stocks or any you support on backend)
let watchlist = ["RELIANCE", "TCS", "HDFCBANK", "SBIN"];

// Top movers arrays – still mock on frontend
let nseGainers = [];
let nseLosers = [];
let bseGainers = [];
let bseLosers = [];

// ========= fetchQuote: calls Render backend =========
async function fetchQuote(symbol) {
  const res = await fetch(
    "https://indian-market-backend.onrender.com/api/quote?symbol=" +
      encodeURIComponent(symbol)
  ); // replace with your actual Render URL
  if (!res.ok) throw new Error("Network error: " + res.status);
  const data = await res.json();

  return {
    symbol: data.symbol,
    price: data.price,
    change: data.change,
    changePct: data.changePct
  };
}

// ========= UI helpers =========
function formatNumber(num) {
  if (isNaN(num)) return "-";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function changeClass(change) {
  return change >= 0 ? "up" : "down";
}

// ========= Indian indices under navbar =========
async function loadIndiaIndices() {
  const container = document.getElementById("india-indices-grid");
  if (!container) return;
  container.innerHTML = "";

  for (const idx of indiaIndices) {
    const card = document.createElement("div");
    card.className = "index-card";

    const header = document.createElement("div");
    header.className = "index-header";
    header.innerHTML = `
      <span class="index-name">${idx.name}</span>
      <span>${idx.symbol}</span>
    `;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "index-body";
    body.innerHTML = `
      <span class="index-price">Loading...</span>
      <span class="index-change">--</span>
    `;
    card.appendChild(body);
    container.appendChild(card);

    try {
      const q = await fetchQuote(idx.symbol);
      body.querySelector(".index-price").textContent = formatNumber(q.price);
      const changeText =
        (q.change >= 0 ? "+" : "") +
        formatNumber(q.change) +
        " (" +
        (q.changePct >= 0 ? "+" : "") +
        q.changePct.toFixed(2) +
        "%)";
      const changeEl = body.querySelector(".index-change");
      changeEl.textContent = changeText;
      if (q.change < 0) changeEl.classList.add("down");
    } catch (e) {
      body.querySelector(".index-price").textContent = "N/A";
      body.querySelector(".index-change").textContent = "--";
    }
  }
}

// ========= Top gainers/losers (still mock on frontend) =========
function renderMoversTable(rows, tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector("tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.classList.add(row.change >= 0 ? "up" : "down");
    tr.innerHTML = `
      <td>${row.symbol}</td>
      <td>${formatNumber(row.ltp)}</td>
      <td>${(row.change >= 0 ? "+" : "") + row.change.toFixed(2)}</td>
      <td>${(row.changePct >= 0 ? "+" : "") + row.changePct.toFixed(2)}%</td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadTopMovers() {
  function makeRow(symbol, base) {
    const change = (Math.random() - 0.5) * (base * 0.04);
    const ltp = base + change;
    const changePct = (change / base) * 100;
    return { symbol, ltp, change, changePct };
  }

  nseGainers = [
    makeRow("RELIANCE", 3200),
    makeRow("TCS", 4100),
    makeRow("HDFCBANK", 1750)
  ].sort((a, b) => b.changePct - a.changePct);

  nseLosers = [
    makeRow("INFY", 1500),
    makeRow("ITC", 430),
    makeRow("SBIN", 840)
  ].sort((a, b) => a.changePct - b.changePct);

  bseGainers = [
    makeRow("BSESTK1", 500),
    makeRow("BSESTK2", 900)
  ].sort((a, b) => b.changePct - a.changePct);

  bseLosers = [
    makeRow("BSESTK3", 600),
    makeRow("BSESTK4", 750)
  ].sort((a, b) => a.changePct - b.changePct);

  renderMoversTable(nseGainers, "nse-gainers-table");
  renderMoversTable(nseLosers, "nse-losers-table");
  renderMoversTable(bseGainers, "bse-gainers-table");
  renderMoversTable(bseLosers, "bse-losers-table");
}

// ========= Watchlist =========
async function loadWatchlist() {
  const table = document.getElementById("watchlist-table");
  if (!table) return;
  const tbody = table.querySelector("tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  for (const symbol of watchlist) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${symbol}</td>
      <td>Loading...</td>
      <td></td>
      <td></td>
    `;
    tbody.appendChild(tr);

    try {
      const q = await fetchQuote(symbol);
      const tds = tr.querySelectorAll("td");
      tds[1].textContent = formatNumber(q.price);
      tds[2].textContent =
        (q.change >= 0 ? "+" : "") + q.change.toFixed(2);
      tds[3].textContent =
        (q.changePct >= 0 ? "+" : "") + q.changePct.toFixed(2) + "%";
      tr.classList.add(changeClass(q.change));
    } catch (e) {
      const tds = tr.querySelectorAll("td");
      tds[1].textContent = "N/A";
      tds[2].textContent = "-";
      tds[3].textContent = "-";
    }
  }
}

// ========= Search =========
async function handleSearch() {
  const input = document.getElementById("search-input");
  const resultBox = document.getElementById("search-result");
  const symbol = input.value.trim().toUpperCase();

  if (!symbol) {
    resultBox.textContent = "Enter a stock symbol to search.";
    return;
  }

  resultBox.textContent = "Searching...";

  try {
    const q = await fetchQuote(symbol);
    resultBox.innerHTML = `
      <div>
        <span class="symbol">${q.symbol}</span> •
        <span class="price">${formatNumber(q.price)}</span>
        <span class="${changeClass(q.change)}">
          ${(q.change >= 0 ? "+" : "") + q.change.toFixed(2)}
          (${(q.changePct >= 0 ? "+" : "") + q.changePct.toFixed(2)}%)
        </span>
        <button class="add-btn">Add to watchlist</button>
      </div>
    `;

    const btn = resultBox.querySelector(".add-btn");
    btn.addEventListener("click", () => {
      if (!watchlist.includes(q.symbol)) {
        watchlist.push(q.symbol);
        loadWatchlist();
      }
    });
  } catch (e) {
    resultBox.textContent = "Error loading data.";
  }
}

// ========= Auto refresh =========
function startAutoRefresh() {
  loadIndiaIndices();
  loadTopMovers();
  loadWatchlist();

  setInterval(() => {
    loadIndiaIndices();
    loadTopMovers();
    loadWatchlist();
  }, 60000);
}

// ========= Init =========
window.addEventListener("DOMContentLoaded", () => {
  startAutoRefresh();
  document
    .getElementById("search-btn")
    .addEventListener("click", handleSearch);
  document
    .getElementById("search-input")
    .addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch();
    });
});
