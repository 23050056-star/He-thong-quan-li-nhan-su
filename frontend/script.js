// Sample data (in a real application, this would come from a backend API)
let employees = [
  {
    id: 1,
    code: "NV001",
    name: "Nguyễn Văn A",
    email: "nva@company.com",
    department: "IT",
    position: "Developer",
    startDate: "2023-01-15",
    status: "active",
  },
  {
    id: 2,
    code: "NV002",
    name: "Trần Thị B",
    email: "ttb@company.com",
    department: "HR",
    position: "HR Manager",
    startDate: "2022-08-20",
    status: "active",
  },
];

let departments = [
  {
    id: 1,
    name: "IT",
    description: "Phòng Công nghệ thông tin",
    employeeCount: 1,
  },
  { id: 2, name: "HR", description: "Phòng Nhân sự", employeeCount: 1 },
  { id: 3, name: "Finance", description: "Phòng Tài chính", employeeCount: 0 },
];

let positions = [
  {
    id: 1,
    name: "Developer",
    description: "Lập trình viên",
    baseSalary: 15000000,
    employeeCount: 1,
  },
  {
    id: 2,
    name: "HR Manager",
    description: "Trưởng phòng nhân sự",
    baseSalary: 20000000,
    employeeCount: 1,
  },
  {
    id: 3,
    name: "Accountant",
    description: "Kế toán",
    baseSalary: 12000000,
    employeeCount: 0,
  },
];

let activities = [
  {
    type: "add",
    message: "Thêm nhân viên Nguyễn Văn A",
    time: "2024-01-15 09:30",
  },
  {
    type: "add",
    message: "Thêm nhân viên Trần Thị B",
    time: "2024-01-15 10:15",
  },
  {
    type: "update",
    message: "Cập nhật thông tin phòng IT",
    time: "2024-01-16 14:20",
  },
];

// DOM Elements
let currentEmployeeId = null;
let currentDepartmentId = null;
let currentPositionId = null;

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  loadDashboard();
  loadEmployees();
  loadDepartments();
  loadPositions();
  loadActivities();
});

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.getAttribute("data-section");

      // Update active nav link
      navLinks.forEach((nl) => nl.classList.remove("active"));
      this.classList.add("active");

      // Show corresponding section
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
      });
      document.getElementById(section).classList.add("active");

      // Load section data
      switch (section) {
        case "dashboard":
          loadDashboard();
          break;
        case "employees":
          loadEmployees();
          break;
        case "departments":
          loadDepartments();
          break;
        case "positions":
          loadPositions();
          break;
        case "reports":
          loadReports();
          break;
      }
    });
  });
}

// Dashboard
function loadDashboard() {
  // Update stats
  document.getElementById("totalEmployees").textContent = employees.length;
  document.getElementById("totalDepartments").textContent = departments.length;
  document.getElementById("totalPositions").textContent = positions.length;
}

// Employees Management
function loadEmployees() {
  const tbody = document.getElementById("employeesTableBody");
  const departmentFilter = document.getElementById("departmentFilter");

  // Populate department filter
  departmentFilter.innerHTML = '<option value="">Tất cả phòng ban</option>';
  departments.forEach((dept) => {
    departmentFilter.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
  });

  // Populate employee form departments
  const employeeDeptSelect = document.getElementById("employeeDepartment");
  employeeDeptSelect.innerHTML = '<option value="">Chọn phòng ban</option>';
  departments.forEach((dept) => {
    employeeDeptSelect.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
  });

  // Populate employee form positions
  const employeePosSelect = document.getElementById("employeePosition");
  employeePosSelect.innerHTML = '<option value="">Chọn chức vụ</option>';
  positions.forEach((pos) => {
    employeePosSelect.innerHTML += `<option value="${pos.name}">${pos.name}</option>`;
  });

  // Render employees table
  tbody.innerHTML = "";
  employees.forEach((emp) => {
    const statusClass =
      emp.status === "active" ? "status-active" : "status-inactive";
    const statusText =
      emp.status === "active" ? "Đang làm việc" : "Đã nghỉ việc";

    tbody.innerHTML += `
            <tr>
                <td>${emp.code}</td>
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>${formatDate(emp.startDate)}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>
                    <div class="btn-actions">
                        <button class="btn-edit" onclick="editEmployee(${
                          emp.id
                        })">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn-delete" onclick="deleteEmployee(${
                          emp.id
                        })">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
  });
}

function searchEmployees() {
  const searchTerm = document
    .getElementById("searchEmployee")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#employeesTableBody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
}

function filterEmployees() {
  const department = document.getElementById("departmentFilter").value;
  const rows = document.querySelectorAll("#employeesTableBody tr");

  rows.forEach((row) => {
    const deptCell = row.cells[3].textContent;
    if (!department || deptCell === department) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function showEmployeeForm(employeeId = null) {
  currentEmployeeId = employeeId;
  const modal = document.getElementById("employeeModal");
  const title = document.getElementById("employeeModalTitle");
  const form = document.getElementById("employeeForm");

  if (employeeId) {
    title.textContent = "Sửa thông tin nhân viên";
    const employee = employees.find((emp) => emp.id === employeeId);
    document.getElementById("employeeCode").value = employee.code;
    document.getElementById("employeeName").value = employee.name;
    document.getElementById("employeeEmail").value = employee.email;
    document.getElementById("employeeDepartment").value = employee.department;
    document.getElementById("employeePosition").value = employee.position;
    document.getElementById("employeeStartDate").value = employee.startDate;
    document.getElementById("employeeStatus").value = employee.status;
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

  const formData = {
    code: document.getElementById("employeeCode").value,
    name: document.getElementById("employeeName").value,
    email: document.getElementById("employeeEmail").value,
    department: document.getElementById("employeeDepartment").value,
    position: document.getElementById("employeePosition").value,
    startDate: document.getElementById("employeeStartDate").value,
    status: document.getElementById("employeeStatus").value,
  };

  if (currentEmployeeId) {
    // Update existing employee
    const index = employees.findIndex((emp) => emp.id === currentEmployeeId);
    employees[index] = { ...employees[index], ...formData };
    addActivity("update", `Cập nhật thông tin nhân viên ${formData.name}`);
  } else {
    // Add new employee
    const newId = Math.max(...employees.map((emp) => emp.id), 0) + 1;
    employees.push({ id: newId, ...formData });

    // Update department and position counts
    updateDepartmentCount(formData.department, 1);
    updatePositionCount(formData.position, 1);

    addActivity("add", `Thêm nhân viên ${formData.name}`);
  }

  closeEmployeeForm();
  loadEmployees();
  loadDashboard();
  loadDepartments();
  loadPositions();
  showNotification(
    currentEmployeeId ? "Cập nhật thành công!" : "Thêm nhân viên thành công!"
  );
}

function editEmployee(id) {
  showEmployeeForm(id);
}

function deleteEmployee(id) {
  if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
    const employee = employees.find((emp) => emp.id === id);
    employees = employees.filter((emp) => emp.id !== id);

    // Update department and position counts
    updateDepartmentCount(employee.department, -1);
    updatePositionCount(employee.position, -1);

    addActivity("delete", `Xóa nhân viên ${employee.name}`);
    loadEmployees();
    loadDashboard();
    loadDepartments();
    loadPositions();
    showNotification("Xóa nhân viên thành công!");
  }
}

// Departments Management
function loadDepartments() {
  const container = document.getElementById("departmentsContainer");
  container.innerHTML = "";

  departments.forEach((dept) => {
    container.innerHTML += `
            <div class="department-card">
                <h3>${dept.name}</h3>
                <p>${dept.description}</p>
                <div class="department-stats">
                    <span>${dept.employeeCount} nhân viên</span>
                    <div class="btn-actions">
                        <button class="btn-edit" onclick="editDepartment(${dept.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="deleteDepartment(${dept.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
  });
}

function showDepartmentForm(departmentId = null) {
  currentDepartmentId = departmentId;
  const modal = document.getElementById("departmentModal");
  const title = document.getElementById("departmentModalTitle");
  const form = document.getElementById("departmentForm");

  if (departmentId) {
    title.textContent = "Sửa thông tin phòng ban";
    const department = departments.find((dept) => dept.id === departmentId);
    document.getElementById("departmentName").value = department.name;
    document.getElementById("departmentDescription").value =
      department.description;
  } else {
    title.textContent = "Thêm phòng ban";
    form.reset();
  }

  modal.style.display = "block";
}

function closeDepartmentForm() {
  document.getElementById("departmentModal").style.display = "none";
  currentDepartmentId = null;
}

function saveDepartment(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("departmentName").value,
    description: document.getElementById("departmentDescription").value,
    employeeCount: 0,
  };

  if (currentDepartmentId) {
    // Update existing department
    const index = departments.findIndex(
      (dept) => dept.id === currentDepartmentId
    );
    departments[index] = { ...departments[index], ...formData };
    addActivity("update", `Cập nhật thông tin phòng ban ${formData.name}`);
  } else {
    // Add new department
    const newId = Math.max(...departments.map((dept) => dept.id), 0) + 1;
    departments.push({ id: newId, ...formData });
    addActivity("add", `Thêm phòng ban ${formData.name}`);
  }

  closeDepartmentForm();
  loadDepartments();
  loadDashboard();
  showNotification(
    currentDepartmentId ? "Cập nhật thành công!" : "Thêm phòng ban thành công!"
  );
}

function editDepartment(id) {
  showDepartmentForm(id);
}

function deleteDepartment(id) {
  const department = departments.find((dept) => dept.id === id);
  if (department.employeeCount > 0) {
    alert("Không thể xóa phòng ban đang có nhân viên!");
    return;
  }

  if (confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
    departments = departments.filter((dept) => dept.id !== id);
    addActivity("delete", `Xóa phòng ban ${department.name}`);
    loadDepartments();
    loadDashboard();
    showNotification("Xóa phòng ban thành công!");
  }
}

// Positions Management
function loadPositions() {
  const tbody = document.getElementById("positionsTableBody");
  tbody.innerHTML = "";

  positions.forEach((pos) => {
    tbody.innerHTML += `
            <tr>
                <td>${pos.name}</td>
                <td>${pos.description}</td>
                <td>${formatCurrency(pos.baseSalary)}</td>
                <td>${pos.employeeCount} nhân viên</td>
                <td>
                    <div class="btn-actions">
                        <button class="btn-edit" onclick="editPosition(${
                          pos.id
                        })">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn-delete" onclick="deletePosition(${
                          pos.id
                        })">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
  });
}

function showPositionForm(positionId = null) {
  currentPositionId = positionId;
  const modal = document.getElementById("positionModal");
  const title = document.getElementById("positionModalTitle");
  const form = document.getElementById("positionForm");

  if (positionId) {
    title.textContent = "Sửa thông tin chức vụ";
    const position = positions.find((pos) => pos.id === positionId);
    document.getElementById("positionName").value = position.name;
    document.getElementById("positionDescription").value = position.description;
    document.getElementById("positionSalary").value = position.baseSalary;
  } else {
    title.textContent = "Thêm chức vụ";
    form.reset();
  }

  modal.style.display = "block";
}

function closePositionForm() {
  document.getElementById("positionModal").style.display = "none";
  currentPositionId = null;
}

function savePosition(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("positionName").value,
    description: document.getElementById("positionDescription").value,
    baseSalary: parseInt(document.getElementById("positionSalary").value),
    employeeCount: 0,
  };

  if (currentPositionId) {
    // Update existing position
    const index = positions.findIndex((pos) => pos.id === currentPositionId);
    positions[index] = { ...positions[index], ...formData };
    addActivity("update", `Cập nhật thông tin chức vụ ${formData.name}`);
  } else {
    // Add new position
    const newId = Math.max(...positions.map((pos) => pos.id), 0) + 1;
    positions.push({ id: newId, ...formData });
    addActivity("add", `Thêm chức vụ ${formData.name}`);
  }

  closePositionForm();
  loadPositions();
  loadDashboard();
  showNotification(
    currentPositionId ? "Cập nhật thành công!" : "Thêm chức vụ thành công!"
  );
}

function editPosition(id) {
  showPositionForm(id);
}

function deletePosition(id) {
  const position = positions.find((pos) => pos.id === id);
  if (position.employeeCount > 0) {
    alert("Không thể xóa chức vụ đang có nhân viên!");
    return;
  }

  if (confirm("Bạn có chắc chắn muốn xóa chức vụ này?")) {
    positions = positions.filter((pos) => pos.id !== id);
    addActivity("delete", `Xóa chức vụ ${position.name}`);
    loadPositions();
    loadDashboard();
    showNotification("Xóa chức vụ thành công!");
  }
}

// Reports
function loadReports() {
  // Department chart
  const deptCtx = document.getElementById("departmentChart").getContext("2d");
  const deptLabels = departments.map((dept) => dept.name);
  const deptData = departments.map((dept) => dept.employeeCount);

  new Chart(deptCtx, {
    type: "bar",
    data: {
      labels: deptLabels,
      datasets: [
        {
          label: "Số nhân viên",
          data: deptData,
          backgroundColor: [
            "#667eea",
            "#764ba2",
            "#f093fb",
            "#f5576c",
            "#4facfe",
            "#00f2fe",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Position chart
  const posCtx = document.getElementById("positionChart").getContext("2d");
  const posLabels = positions.map((pos) => pos.name);
  const posData = positions.map((pos) => pos.employeeCount);

  new Chart(posCtx, {
    type: "doughnut",
    data: {
      labels: posLabels,
      datasets: [
        {
          data: posData,
          backgroundColor: [
            "#667eea",
            "#764ba2",
            "#f093fb",
            "#f5576c",
            "#4facfe",
            "#00f2fe",
          ],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// Activities
function loadActivities() {
  const container = document.getElementById("activitiesList");
  container.innerHTML = "";

  activities.slice(-5).forEach((activity) => {
    const iconClass =
      activity.type === "add"
        ? "activity-add"
        : activity.type === "update"
        ? "activity-update"
        : "activity-delete";
    const icon =
      activity.type === "add"
        ? "fa-user-plus"
        : activity.type === "update"
        ? "fa-edit"
        : "fa-trash";

    container.innerHTML += `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="activity-info">
                    <p>${activity.message}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `;
  });
}

function addActivity(type, message) {
  const now = new Date();
  const time = `${now.toLocaleDateString("vi-VN")} ${now.toLocaleTimeString(
    "vi-VN",
    { hour: "2-digit", minute: "2-digit" }
  )}`;

  activities.push({ type, message, time });
  loadActivities();
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function updateDepartmentCount(departmentName, change) {
  const dept = departments.find((dept) => dept.name === departmentName);
  if (dept) {
    dept.employeeCount += change;
  }
}

function updatePositionCount(positionName, change) {
  const pos = positions.find((pos) => pos.name === positionName);
  if (pos) {
    pos.employeeCount += change;
  }
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add CSS for notification animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    alert("Đã đăng xuất thành công!");
    // In a real application, you would redirect to login page
    // window.location.href = '/login';
  }
}

// Close modals when clicking outside
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
