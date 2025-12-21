// =======================
// Dữ liệu giả lập
// =======================
let employees = []
let departments = []
let positions = []

// =======================
// Sidebar: Ẩn/Hiện section
// =======================
function showSection(id) {
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(sec => sec.classList.remove("active"));
    const target = document.getElementById(id);
    if(target) target.classList.add("active");
}

// =======================
// Employees
// =======================
function renderEmployees() {
    const tbody = document.getElementById("employeesTableBody");
    tbody.innerHTML = "";
    employees.forEach(emp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.dept}</td>
            <td>${emp.pos}</td>
            <td>${emp.startDate}</td>
            <td>${emp.workingDays}</td>
            <td>${emp.leaveDays}</td>
            <td>${emp.status}</td>
            <td>
                <button onclick="editEmployee(${emp.id})">Sửa</button>
                <button onclick="deleteEmployee(${emp.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Cập nhật filter phòng ban
    const deptSelect = document.getElementById("departmentFilter");
    deptSelect.innerHTML = `<option value="">Tất cả phòng ban</option>`;
    departments.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.innerText = d;
        deptSelect.appendChild(opt);
    });
}

let editEmployeeId = null;

function showEmployeeForm() {
    const name = prompt("Họ tên:");
    if(!name) return;
    const email = prompt("Email:");
    const dept = prompt("Phòng ban:");
    const pos = prompt("Chức vụ:");
    const startDate = prompt("Ngày vào làm (YYYY-MM-DD):");

    if(editEmployeeId !== null) {
        const emp = employees.find(e => e.id===editEmployeeId);
        Object.assign(emp,{name,email,dept,pos,startDate});
        editEmployeeId=null;
    } else {
        const id = employees.length ? employees[employees.length-1].id +1 : 1;
        employees.push({id,name,email,dept,pos,startDate,workingDays:20,leaveDays:0,status:"Đang làm"});
    }
    renderEmployees();
}

function editEmployee(id) {
    editEmployeeId = id;
    showEmployeeForm();
}

function deleteEmployee(id) {
    if(confirm("Bạn có chắc muốn xóa nhân viên này?")){
        employees = employees.filter(e=>e.id!==id);
        renderEmployees();
    }
}

function searchEmployees() {
    const keyword = document.getElementById("searchEmployee").value.toLowerCase();
    const tbody = document.getElementById("employeesTableBody");
    tbody.innerHTML = "";
    employees.filter(emp=>emp.name.toLowerCase().includes(keyword) || emp.email.toLowerCase().includes(keyword))
        .forEach(emp=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.dept}</td>
            <td>${emp.pos}</td>
            <td>${emp.startDate}</td>
            <td>${emp.workingDays}</td>
            <td>${emp.leaveDays}</td>
            <td>${emp.status}</td>
            <td>
                <button onclick="editEmployee(${emp.id})">Sửa</button>
                <button onclick="deleteEmployee(${emp.id})">Xóa</button>
            </td>
        `;
            tbody.appendChild(tr);
        });
}

function filterEmployees() {
    const dept = document.getElementById("departmentFilter").value;
    const tbody = document.getElementById("employeesTableBody");
    tbody.innerHTML = "";
    employees.filter(emp=>!dept || emp.dept===dept)
        .forEach(emp=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.dept}</td>
            <td>${emp.pos}</td>
            <td>${emp.startDate}</td>
            <td>${emp.workingDays}</td>
            <td>${emp.leaveDays}</td>
            <td>${emp.status}</td>
            <td>
                <button onclick="editEmployee(${emp.id})">Sửa</button>
                <button onclick="deleteEmployee(${emp.id})">Xóa</button>
            </td>
        `;
            tbody.appendChild(tr);
        });
}

// =======================
// Departments
// =======================
function renderDepartments() {
    const container = document.getElementById("departmentsContainer");
    container.innerHTML="";
    departments.forEach((d,i)=>{
        const card = document.createElement("div");
        card.className="card";
        card.innerHTML=`<h3>${d}</h3><button onclick="editDepartment(${i})">Sửa</button> <button onclick="deleteDepartment(${i})">Xóa</button>`;
        container.appendChild(card);
    });
}

function showDepartmentForm() {
    const name = prompt("Tên phòng ban:");
    if(!name) return;
    departments.push(name);
    renderDepartments();
}

function editDepartment(i){
    const name = prompt("Tên phòng ban mới:",departments[i]);
    if(name) { departments[i]=name; renderDepartments(); }
}

function deleteDepartment(i){
    if(confirm("Xóa phòng ban này?")){
        departments.splice(i,1);
        renderDepartments();
    }
}

// =======================
// Positions
// =======================
function renderPositions(){
    const tbody = document.getElementById("positionsTableBody");
    tbody.innerHTML="";
    positions.forEach((p,i)=>{
        const tr=document.createElement("tr");
        const numEmp = employees.filter(e=>e.pos===p.name).length;
        tr.innerHTML=`<td>${p.name}</td><td>${p.desc}</td><td>${p.baseSalary}</td><td>${numEmp}</td>
        <td><button onclick="editPosition(${i})">Sửa</button> <button onclick="deletePosition(${i})">Xóa</button></td>`;
        tbody.appendChild(tr);
    });
}

function showPositionForm(){
    const name=prompt("Tên chức vụ:");
    const desc=prompt("Mô tả:");
    const baseSalary=parseInt(prompt("Lương cơ bản:"),10) || 0;
    positions.push({name,desc,baseSalary});
    renderPositions();
}

function editPosition(i){
    const name=prompt("Tên chức vụ:",positions[i].name);
    const desc=prompt("Mô tả:",positions[i].desc);
    const baseSalary=parseInt(prompt("Lương cơ bản:",positions[i].baseSalary),10) ||0;
    positions[i]={name,desc,baseSalary};
    renderPositions();
}

function deletePosition(i){
    if(confirm("Xóa chức vụ này?")){ positions.splice(i,1); renderPositions();}
}

// =======================
// Salary
// =======================
function calculateSalary(){
    const month = document.getElementById("salaryMonth").value;
    const year = document.getElementById("salaryYear").value;
    let tbody = document.getElementById("salaryTableBody");
    tbody.innerHTML="";
    employees.forEach(emp=>{
        const pos = positions.find(p=>p.name===emp.pos);
        const baseSalary = pos ? pos.baseSalary : 0;
        const total = baseSalary; // đơn giản fake
        const tr=document.createElement("tr");
        tr.innerHTML=`<td>${emp.id}</td><td>${emp.name}</td><td>${emp.pos}</td><td>${baseSalary}</td><td>${emp.workingDays}</td><td>${emp.leaveDays}</td><td>${total}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById("salaryTableContainer").style.display="block";
}

// =======================
// Reports
// =======================
function renderReports(){
    const deptCount={};
    departments.forEach(d=> deptCount[d]=0);
    employees.forEach(e=>{
        if(deptCount[e.dept]!==undefined) deptCount[e.dept]++;
    });
    const ctx=document.getElementById("departmentChart").getContext("2d");
    new Chart(ctx,{
        type:"bar",
        data:{
            labels:Object.keys(deptCount),
            datasets:[{label:"Số nhân viên",data:Object.values(deptCount),backgroundColor:"rgba(75,192,192,0.6)"}]
        },
        options:{responsive:true,plugins:{legend:{display:false}}}
    });

    const posCount={};
    positions.forEach(p=> posCount[p.name]=0);
    employees.forEach(e=>{
        if(posCount[e.pos]!==undefined) posCount[e.pos]++;
    });
    const ctx2=document.getElementById("positionChart").getContext("2d");
    new Chart(ctx2,{
        type:"pie",
        data:{
            labels:Object.keys(posCount),
            datasets:[{label:"Chức vụ",data:Object.values(posCount),backgroundColor:["#FF6384","#36A2EB","#FFCE56","#4BC0C0"]}]
        },
        options:{responsive:true}
    });
}

// =======================
// Logout
// =======================
function logout(){
    window.location.href="/login";
}

// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded",()=>{
    renderEmployees();
    renderDepartments();
    renderPositions();
    renderReports();
    showSection("dashboard");
});
