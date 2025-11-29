// =======================
// Sample Data
// =======================
let employees = [
  { id: 1, code: "NV001", name: "Nguyễn Văn A", email: "nva@company.com", department: "IT", position: "Developer", startDate: "2023-01-15", status: "active" },
  { id: 2, code: "NV002", name: "Trần Thị B", email: "ttb@company.com", department: "HR", position: "HR Manager", startDate: "2022-08-20", status: "active" },
];

let departments = [
  { id: 1, name: "IT", description: "Phòng Công nghệ thông tin", employeeCount: 1 },
  { id: 2, name: "HR", description: "Phòng Nhân sự", employeeCount: 1 },
  { id: 3, name: "Finance", description: "Phòng Tài chính", employeeCount: 0 },
];

let positions = [
  { id: 1, name: "Developer", description: "Lập trình viên", baseSalary: 15000000, employeeCount: 1 },
  { id: 2, name: "HR Manager", description: "Trưởng phòng nhân sự", baseSalary: 20000000, employeeCount: 1 },
  { id: 3, name: "Accountant", description: "Kế toán", baseSalary: 12000000, employeeCount: 0 },
];

let activities = [
  { type: "add", message: "Thêm nhân viên Nguyễn Văn A", time: "2024-01-15 09:30" },
  { type: "add", message: "Thêm nhân viên Trần Thị B", time: "2024-01-15 10:15" },
  { type: "update", message: "Cập nhật thông tin phòng IT", time: "2024-01-16 14:20" },
];

let currentEmployeeId = null;
let currentDepartmentId = null;
let currentPositionId = null;

// Chart instances để tránh vẽ trùng
let departmentChartInstance = null;
let positionChartInstance = null;

// =======================
// Initialize App
// =======================
document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  loadDashboard();
  loadEmployees();
  loadDepartments();
  loadPositions();
  loadActivities();
});

// =======================
// Navigation
// =======================
function initNavigation() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const section = this.dataset.section;

      document.querySelectorAll(".nav-link").forEach(nl => nl.classList.remove("active"));
      this.classList.add("active");

      document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
      document.getElementById(section).classList.add("active");

      if (section === "reports") loadReports();
    });
  });
}

// =======================
// Dashboard
// =======================
function loadDashboard() {
  document.getElementById("totalEmployees").textContent = employees.length;
  document.getElementById("totalDepartments").textContent = departments.length;
  document.getElementById("totalPositions").textContent = positions.length;
}

// =======================
// Employees Management
// =======================
function loadEmployees() {
  const tbody = document.getElementById("employeesTableBody");
  const departmentFilter = document.getElementById("departmentFilter");
  const employeeDeptSelect = document.getElementById("employeeDepartment");
  const employeePosSelect = document.getElementById("employeePosition");

  // Populate department filter and form
  let deptOptions = '<option value="">Tất cả phòng ban</option>';
  let formDeptOptions = '<option value="">Chọn phòng ban</option>';
  departments.forEach(d => {
    deptOptions += `<option value="${d.name}">${d.name}</option>`;
    formDeptOptions += `<option value="${d.name}">${d.name}</option>`;
  });
  departmentFilter.innerHTML = deptOptions;
  employeeDeptSelect.innerHTML = formDeptOptions;

  // Populate positions in form
  let posOptions = '<option value="">Chọn chức vụ</option>';
  positions.forEach(p => posOptions += `<option value="${p.name}">${p.name}</option>`);
  employeePosSelect.innerHTML = posOptions;

  // Render employees table
  tbody.innerHTML = "";
  employees.forEach(emp => {
    const statusClass = emp.status === "active" ? "status-active" : "status-inactive";
    const statusText = emp.status === "active" ? "Đang làm việc" : "Đã nghỉ việc";
    tbody.innerHTML += `
      <tr>
        <td>${emp.code}</td>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.position}</td>
        <td>${formatDate(emp.startDate)}</td>
        <td>${emp.attendanceDate ? formatDate(emp.attendanceDate) : ""}</td>
        <td>${emp.leaveDate ? formatDate(emp.leaveDate) : ""}</td>
        <td><span class="${emp.status === "active" ? "status-active" : "status-inactive"}">
          ${emp.status === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
        </span></td>
        <td>
          <div class="btn-actions">
            <button class="btn-edit" onclick="editEmployee(${emp.id})">Sửa</button>
            <button class="btn-delete" onclick="deleteEmployee(${emp.id})">Xóa</button>
          </div>
        </td>
      </tr>`;
  });
}

function searchEmployees() {
  const searchTerm = document.getElementById("searchEmployee").value.toLowerCase();
  document.querySelectorAll("#employeesTableBody tr").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
  });
}

function filterEmployees() {
  const dept = document.getElementById("departmentFilter").value;
  document.querySelectorAll("#employeesTableBody tr").forEach(row => {
    const rowDept = row.cells[3].textContent;
    row.style.display = !dept || rowDept === dept ? "" : "none";
  });
}

function showEmployeeForm(id = null) {
  currentEmployeeId = id;
  const modal = document.getElementById("employeeModal");
  const title = document.getElementById("employeeModalTitle");
  const form = document.getElementById("employeeForm");

  if (id) {
    title.textContent = "Sửa thông tin nhân viên";
    const emp = employees.find(e => e.id === id);
    form.employeeCode.value = emp.code;
    form.employeeName.value = emp.name;
    form.employeeEmail.value = emp.email;
    form.employeeDepartment.value = emp.department;
    form.employeePosition.value = emp.position;
    form.employeeStartDate.value = emp.startDate;
    form.employeeStatus.value = emp.status;
  } else {
    title.textContent = "Thêm nhân viên";
    form.reset();
  }
  modal.style.display = "block";
}

function closeEmployeeForm() {
  document.getElementById("employeeModal").style.display = "none";
  currentEmployeeId = null;
}

function saveEmployee(event) {
  event.preventDefault();
  const form = document.getElementById("employeeForm");
  const data = {
    code: form.employeeCode.value,
    name: form.employeeName.value,
    email: form.employeeEmail.value,
    department: form.employeeDepartment.value,
    position: form.employeePosition.value,
    startDate: form.employeeStartDate.value,
    status: form.employeeStatus.value,
  };

  if (currentEmployeeId) {
    const index = employees.findIndex(e => e.id === currentEmployeeId);
    if (employees[index].department !== data.department) {
      updateDepartmentCount(employees[index].department, -1);
      updateDepartmentCount(data.department, 1);
    }
    if (employees[index].position !== data.position) {
      updatePositionCount(employees[index].position, -1);
      updatePositionCount(data.position, 1);
    }
    employees[index] = { ...employees[index], ...data };
    addActivity("update", `Cập nhật thông tin nhân viên ${data.name}`);
  } else {
    const newId = Math.max(...employees.map(e => e.id), 0) + 1;
    employees.push({ id: newId, ...data });
    updateDepartmentCount(data.department, 1);
    updatePositionCount(data.position, 1);
    addActivity("add", `Thêm nhân viên ${data.name}`);
  }

  closeEmployeeForm();
  loadEmployees();
  loadDashboard();
  loadDepartments();
  loadPositions();
  showNotification(currentEmployeeId ? "Cập nhật thành công!" : "Thêm nhân viên thành công!");
}

function editEmployee(id) { showEmployeeForm(id); }

function deleteEmployee(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
  const emp = employees.find(e => e.id === id);
  employees = employees.filter(e => e.id !== id);
  updateDepartmentCount(emp.department, -1);
  updatePositionCount(emp.position, -1);
  addActivity("delete", `Xóa nhân viên ${emp.name}`);
  loadEmployees();
  loadDashboard();
  loadDepartments();
  loadPositions();
  showNotification("Xóa nhân viên thành công!");
}

// =======================
// Departments Management
// =======================
function loadDepartments() {
  const container = document.getElementById("departmentsContainer");
  container.innerHTML = "";
  departments.forEach(d => {
    container.innerHTML += `
      <div class="department-card">
        <h3>${d.name}</h3>
        <p>${d.description}</p>
        <div class="department-stats">
          <span>${d.employeeCount} nhân viên</span>
          <div class="btn-actions">
            <button class="btn-edit" onclick="editDepartment(${d.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-delete" onclick="deleteDepartment(${d.id})"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>`;
  });
}

function showDepartmentForm(id = null) {
  currentDepartmentId = id;
  const modal = document.getElementById("departmentModal");
  const title = document.getElementById("departmentModalTitle");
  const form = document.getElementById("departmentForm");
  if (id) {
    title.textContent = "Sửa thông tin phòng ban";
    const dept = departments.find(d => d.id === id);
    form.departmentName.value = dept.name;
    form.departmentDescription.value = dept.description;
  } else {
    title.textContent = "Thêm phòng ban";
    form.reset();
  }
  modal.style.display = "block";
}

function closeDepartmentForm() { document.getElementById("departmentModal").style.display = "none"; currentDepartmentId = null; }

function saveDepartment(event) {
  event.preventDefault();
  const form = document.getElementById("departmentForm");
  const data = { name: form.departmentName.value, description: form.departmentDescription.value, employeeCount: 0 };
  if (currentDepartmentId) {
    const index = departments.findIndex(d => d.id === currentDepartmentId);
    departments[index] = { ...departments[index], ...data };
    addActivity("update", `Cập nhật thông tin phòng ban ${data.name}`);
  } else {
    const newId = Math.max(...departments.map(d => d.id), 0) + 1;
    departments.push({ id: newId, ...data });
    addActivity("add", `Thêm phòng ban ${data.name}`);
  }
  closeDepartmentForm();
  loadDepartments();
  loadDashboard();
  showNotification(currentDepartmentId ? "Cập nhật thành công!" : "Thêm phòng ban thành công!");
}

function editDepartment(id) { showDepartmentForm(id); }

function deleteDepartment(id) {
  const dept = departments.find(d => d.id === id);
  if (dept.employeeCount > 0) { alert("Không thể xóa phòng ban đang có nhân viên!"); return; }
  if (!confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) return;
  departments = departments.filter(d => d.id !== id);
  addActivity("delete", `Xóa phòng ban ${dept.name}`);
  loadDepartments();
  loadDashboard();
  showNotification("Xóa phòng ban thành công!");
}

// =======================
// Positions Management
// =======================
function loadPositions() {
  const tbody = document.getElementById("positionsTableBody");
  tbody.innerHTML = "";
  positions.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.description}</td>
        <td>${formatCurrency(p.baseSalary)}</td>
        <td>${p.employeeCount} nhân viên</td>
        <td>
          <div class="btn-actions">
            <button class="btn-edit" onclick="editPosition(${p.id})"><i class="fas fa-edit"></i> Sửa</button>
            <button class="btn-delete" onclick="deletePosition(${p.id})"><i class="fas fa-trash"></i> Xóa</button>
          </div>
        </td>
      </tr>`;
  });
}

function showPositionForm(id = null) {
  currentPositionId = id;
  const modal = document.getElementById("positionModal");
  const title = document.getElementById("positionModalTitle");
  const form = document.getElementById("positionForm");
  if (id) {
    title.textContent = "Sửa thông tin chức vụ";
    const pos = positions.find(p => p.id === id);
    form.positionName.value = pos.name;
    form.positionDescription.value = pos.description;
    form.positionSalary.value = pos.baseSalary;
  } else {
    title.textContent = "Thêm chức vụ";
    form.reset();
  }
  modal.style.display = "block";
}

function closePositionForm() { document.getElementById("positionModal").style.display = "none"; currentPositionId = null; }

function savePosition(event) {
  event.preventDefault();
  const form = document.getElementById("positionForm");
  const data = { name: form.positionName.value, description: form.positionDescription.value, baseSalary: parseInt(form.positionSalary.value), employeeCount: 0 };
  if (currentPositionId) {
    const index = positions.findIndex(p => p.id === currentPositionId);
    positions[index] = { ...positions[index], ...data };
    addActivity("update", `Cập nhật thông tin chức vụ ${data.name}`);
  } else {
    const newId = Math.max(...positions.map(p => p.id), 0) + 1;
    positions.push({ id: newId, ...data });
    addActivity("add", `Thêm chức vụ ${data.name}`);
  }
  closePositionForm();
  loadPositions();
  loadDashboard();
  showNotification(currentPositionId ? "Cập nhật thành công!" : "Thêm chức vụ thành công!");
}

function editPosition(id) { showPositionForm(id); }

function deletePosition(id) {
  const pos = positions.find(p => p.id === id);
  if (pos.employeeCount > 0) { alert("Không thể xóa chức vụ đang có nhân viên!"); return; }
  if (!confirm("Bạn có chắc chắn muốn xóa chức vụ này?")) return;
  positions = positions.filter(p => p.id !== id);
  addActivity("delete", `Xóa chức vụ ${pos.name}`);
  loadPositions();
  loadDashboard();
  showNotification("Xóa chức vụ thành công!");
}

// =======================
// Reports
// =======================
function loadReports() {
  const deptCtx = document.getElementById("departmentChart").getContext("2d");
  const deptLabels = departments.map(d => d.name);
  const deptData = departments.map(d => d.employeeCount);

  if (departmentChartInstance) departmentChartInstance.destroy();
  departmentChartInstance = new Chart(deptCtx, {
    type: "bar",
    data: { labels: deptLabels, datasets: [{ label: "Số nhân viên", data: deptData, backgroundColor: ["#667eea","#764ba2","#f093fb","#f5576c","#4facfe","#00f2fe"] }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  const posCtx = document.getElementById("positionChart").getContext("2d");
  const posLabels = positions.map(p => p.name);
  const posData = positions.map(p => p.employeeCount);

  if (positionChartInstance) positionChartInstance.destroy();
  positionChartInstance = new Chart(posCtx, {
    type: "doughnut",
    data: { labels: posLabels, datasets: [{ data: posData, backgroundColor: ["#667eea","#764ba2","#f093fb","#f5576c","#4facfe","#00f2fe"] }] },
    options: { responsive: true }
  });
}

// =======================
// Activities
// =======================
function loadActivities() {
  const container = document.getElementById("activitiesList");
  container.innerHTML = "";
  activities.slice(-5).forEach(act => {
    const iconClass = act.type === "add" ? "activity-add" : act.type === "update" ? "activity-update" : "activity-delete";
    const icon = act.type === "add" ? "fa-user-plus" : act.type === "update" ? "fa-edit" : "fa-trash";
    container.innerHTML += `
      <div class="activity-item">
        <div class="activity-icon ${iconClass}"><i class="fas ${icon}"></i></div>
        <div class="activity-info"><p>${act.message}</p><span class="activity-time">${act.time}</span></div>
      </div>`;
  });
}

function addActivity(type, message) {
  const now = new Date();
  const time = `${now.toLocaleDateString("vi-VN")} ${now.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})}`;
  activities.push({ type, message, time });
  loadActivities();
}

// =======================
// Utility
// =======================
function formatDate(dateStr) { return new Date(dateStr).toLocaleDateString("vi-VN"); }
function formatCurrency(amount) { return new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(amount); }
function updateDepartmentCount(name, change) { const d = departments.find(dept => dept.name === name); if(d) d.employeeCount += change; }
function updatePositionCount(name, change) { const p = positions.find(pos => pos.name === name); if(p) p.employeeCount += change; }
function showNotification(msg) { 
  const notif = document.getElementById("notification"); 
  notif.textContent = msg; 
  notif.style.display = "block"; 
  setTimeout(()=>notif.style.display="none",3000); 
}
