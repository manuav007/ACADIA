const API_BASE = "http://localhost:3000";

// 🔁 Switch to Signup
function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
}

// 🔁 Switch to Login
function showLogin() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

// ✅ SIGNUP
async function signup() {
    const username = document.getElementById("signupUser").value.trim();
    const password = document.getElementById("signupPass").value.trim();

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);

        if (data.message === "Account created successfully") {
            showLogin();
        }

    } catch (error) {
        console.error("Signup error:", error);
        alert("Server not reachable");
    }
}

// ✅ LOGIN
async function login() {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);

        if (data.message === "Login successful") {
            if (data.role === "admin") {
                window.location.href = "/owner/own.html";
            } else {
                window.location.href = "/student/stud.html";
            }
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("Server not reachable");
    }
}