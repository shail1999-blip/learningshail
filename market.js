// MARKET OPEN / CLOSE LOGIC (IST)
function updateMarketStatus() {
  const statusEl = document.getElementById("marketStatus");

  const now = new Date();

  // Convert to IST
  const istTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday

  // Market closed on weekends
  if (day === 0 || day === 6) {
    setClosed(statusEl);
    return;
  }

  // Market hours: 9:15 AM to 3:30 PM IST
  const marketOpen =
    (hours > 9 || (hours === 9 && minutes >= 15)) &&
    (hours < 15 || (hours === 15 && minutes <= 30));

  if (marketOpen) {
    statusEl.textContent = "Open";
    statusEl.className = "status open";
  } else {
    setClosed(statusEl);
  }
}

function setClosed(el) {
  el.textContent = "Closed";
  el.className = "status closed";
}

// Update every minute
updateMarketStatus();
setInterval(updateMarketStatus, 60000);

// ------------------------------
// INDEX DATA (DELAYED)
async function loadIndexData() {
  const url =
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=^NSEI,^BSESN,^NSE ";

  const res = await fetch(url);
  const data = await res.json();
  const result = data.quoteResponse.result;

  result.forEach(index => {
    const change = index.regularMarketChange;
    const percent = index.regularMarketChangePercent.toFixed(2);
    const cls = change >= 0 ? "positive" : "negative";

    if (index.symbol === "^NSEI") {
      niftyPrice.textContent = index.regularMarketPrice;
      niftyChange.innerHTML =
        `<span class="${cls}">${change.toFixed(2)} (${percent}%)</span>`;
    }

    if (index.symbol === "^BSESN") {
      sensexPrice.textContent = index.regularMarketPrice;
      sensexChange.innerHTML =
        `<span class="${cls}">${change.toFixed(2)} (${percent}%)</span>`;
    }

    if (index.symbol === "^NSEBANK") {
      bankniftyPrice.textContent = index.regularMarketPrice;
      bankniftyChange.innerHTML =
        `<span class="${cls}">${change.toFixed(2)} (${percent}%)</span>`;
    }
  });
}

// Static chart
new Chart(document.getElementById("marketChart"), {
  type: "line",
  data: {
    labels: ["9:15", "10:30", "11:30", "12:30", "1:30", "2:30", "3:30"],
    datasets: [{
      label: "NIFTY 50 (Sample)",
      data: [22150, 22210, 22180, 22240, 22310, 22290, 22320],
      borderWidth: 2,
      tension: 0.4
    }]
  }
});

// Load data every 5 minutes
loadIndexData();
setInterval(loadIndexData, 300000);
