const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m";

const tbody = document.getElementById("data");
const info = document.getElementById("info");
const errorBox = document.getElementById("error");

function formatTime(iso) {
  // "2026-10-17T14:00" -> "Sab, 17 Okt 2026 14.00"
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    weekday: "short", day: "numeric", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

async function loadWeather() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Status HTTP " + res.status);
    const json = await res.json();

    const times = json.hourly.time;
    const temps = json.hourly.temperature_2m;
    const unit = json.hourly_units.temperature_2m; // "°C"

    const rows = times.map((t, i) => {
      const temp = temps[i];
      const cls = temp >= 32 ? "hot" : temp <= 25 ? "cool" : "";
      return `<tr>
        <td>${formatTime(t)}</td>
        <td class="num ${cls}">${temp.toFixed(1)} ${unit}</td>
      </tr>`;
    });

    tbody.innerHTML = rows.join("");
    info.textContent = `${times.length} data per jam · zona waktu ${json.timezone}`;
  } catch (err) {
    info.textContent = "";
    errorBox.hidden = false;
    errorBox.textContent = "Gagal memuat data: " + err.message + ". Periksa koneksi internet lalu muat ulang halaman.";
  }
}

loadWeather();
