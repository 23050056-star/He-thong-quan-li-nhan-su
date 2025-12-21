// Lấy lịch sử chấm công
let attendanceHistory =
  JSON.parse(localStorage.getItem("attendanceHistory")) || [];

// Lấy ngày hôm nay theo format YYYY-MM-DD
function getTodayDate() {
  const today = new Date();
  return (
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0")
  );
}

// Kiểm tra hôm nay đã chấm công chưa
function isTodayMarked() {
  const today = getTodayDate();
  return attendanceHistory.some((r) => r.date === today);
}

// Disable nút nếu đã chấm hôm nay
function updateButtons() {
  const btnPresent = document.querySelector(".btn-primary");
  const btnLeave = document.querySelector(".btn-danger");

  if (isTodayMarked()) {
    btnPresent.disabled = true;
    btnLeave.disabled = true;
    btnPresent.style.opacity = 0.6;
    btnLeave.style.opacity = 0.6;
  } else {
    btnPresent.disabled = false;
    btnLeave.disabled = false;
    btnPresent.style.opacity = 1;
    btnLeave.style.opacity = 1;
  }
}

// Cập nhật trạng thái hôm nay
function renderTodayStatus() {
  const statusEl = document.getElementById("todayStatus");
  const today = getTodayDate();
  const record = attendanceHistory.find((r) => r.date === today);

  if (record) {
    statusEl.textContent = `Trạng thái: ${record.status}`;
  } else {
    statusEl.textContent = "Trạng thái: Chưa chấm công";
  }
}

// Chấm công Đi làm
function markPresent() {
  const today = getTodayDate();
  attendanceHistory.push({
    date: today,
    status: "Đi làm",
    reason: "",
  });
  saveAndRender();
}

// Chấm công Nghỉ
function submitLeave() {
  const reason = document.getElementById("leaveReason").value.trim();
  if (!reason) {
    alert("Vui lòng nhập lý do nghỉ!");
    return;
  }

  const today = getTodayDate();
  attendanceHistory.push({
    date: today,
    status: "Nghỉ",
    reason: reason,
  });

  document.getElementById("leaveForm").classList.add("hidden");
  document.getElementById("leaveReason").value = "";
  saveAndRender();
}

// Show form nghỉ
function showLeaveForm() {
  if (isTodayMarked()) {
    alert("Hôm nay bạn đã chấm công rồi!");
    return;
  }
  document.getElementById("leaveForm").classList.toggle("hidden");
}

// Render bảng chấm công
function renderAttendanceTable() {
  const tbody = document.getElementById("attendanceTable");
  tbody.innerHTML = "";
  attendanceHistory
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((record) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${record.date}</td>
                <td>${record.status}</td>
                <td>${record.reason || "-"}</td>
            `;
      tbody.appendChild(tr);
    });
}

// Lưu localStorage và cập nhật giao diện
function saveAndRender() {
  localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));
  renderAttendanceTable();
  renderTodayStatus();
  updateButtons();
}

// Logout
function logout() {
  window.location.href = "/login";
}

// Khi load trang
document.addEventListener("DOMContentLoaded", () => {
  renderAttendanceTable();
  renderTodayStatus();
  updateButtons();
});
