const loginForm = document.getElementById("loginForm");
const errorDiv = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lấy giá trị từ form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Kiểm tra chọn role
    if (!role) {
        errorDiv.textContent = "Vui lòng chọn vai trò!";
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });


        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Đăng nhập thất bại");
        }

        // Kiểm tra role trả về từ backend
        if (data.role !== role) {
            errorDiv.textContent = "Vai trò không khớp với tài khoản!";
            return;
        }

        // Lưu token nếu cần
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);

        // Redirect theo role
        if (data.role === "admin") {
            window.location.href = "/admin/dashboard";
        } else if (data.role === "user") {
            window.location.href = "/nhanvien/dashboard";
        }

    } catch (err) {
        errorDiv.textContent = err.message;
    }
});
