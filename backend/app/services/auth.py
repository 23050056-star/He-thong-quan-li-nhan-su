# app/services/auth.py

def authenticate_user(email: str, password: str):
    """
    Kiểm tra email + password thủ công.
    Trả về user object giả nếu đúng, None nếu sai.
    """
    fake_users = {
        "admin@example.com": {"password": "123456", "role": "admin"},
        "user@example.com": {"password": "123456", "role": "user"},
    }

    user = fake_users.get(email)
    if user and user["password"] == password:
        # Trả object giả
        return type("User", (), {"email": email, "role": user["role"]})()
    return None
