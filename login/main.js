const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Add event listener for switching between forms
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
    resetForm('register');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    resetForm('login');
});

// Email & Password Validation
function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email); // Enforces @gmail.com
}

function isValidPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
}

// Show inline error messages and red border
function showError(input, message, errorId) {
    const errorSpan = document.getElementById(errorId); // Get the error span by ID
    errorSpan.textContent = message;
    input.classList.add("input-error"); // Add red border
}

// Remove error messages and reset border
function clearError(input, errorId) {
    const errorSpan = document.getElementById(errorId);
    errorSpan.textContent = "";
    input.classList.remove("input-error");
}

// Reset form: clear messages, reset input fields, and erase data
function resetForm(formType) {
    const form = document.querySelector(`.${formType}`);
    const messageBox = document.getElementById(`${formType}-message`);

    // Clear all error messages and input fields
    form.querySelectorAll('.error-message').forEach((errorMessage) => {
        errorMessage.textContent = "";
    });

    form.querySelectorAll('input').forEach((input) => {
        input.value = ""; // Clear input values
        input.classList.remove('input-error'); // Remove red border
    });

    // Clear success message
    if (messageBox) {
        messageBox.textContent = "";
    }
}

// Handle Registration
document.querySelector('.register').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('reg-username');
    const email = document.getElementById('reg-email');
    const password = document.getElementById('reg-password');
    const messageBox = document.getElementById('register-message');

    let valid = true;

    // Validate email
    if (!isValidEmail(email.value)) {
        showError(email, "Invalid email. Must be @gmail.com", "email-error");
        valid = false;
    } else {
        clearError(email, "email-error");
    }

    // Validate password
    if (!isValidPassword(password.value)) {
        showError(password, "Password must have letters, numbers, and @!$#", "password-error");
        valid = false;
    } else {
        clearError(password, "password-error");
    }

    if (!valid) return;

    if (localStorage.getItem(email.value)) {
        messageBox.textContent = "User already exists! Please log in.";
        messageBox.style.color = "red";
    } else {
        localStorage.setItem(email.value, JSON.stringify({ username: username.value, password: password.value }));
        messageBox.textContent = "Registration successful! Please log in.";
        messageBox.style.color = "green";
        container.classList.remove('active'); // Switch to login form
    }
});

// Handle Login
document.querySelector('.login').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const messageBox = document.getElementById('login-message');

    // Clear previous errors
    clearError(email, "login-email-error");
    clearError(password, "login-password-error");

    // Retrieve the user data from localStorage
    const userData = localStorage.getItem(email.value);

    if (!userData) {
        showError(email, "User not found. Please sign up first.", "login-email-error");
        return;
    }

    const user = JSON.parse(userData);

    // Check if the password matches
    if (user.password !== password.value) {
        showError(password, "Incorrect password. Try again.", "login-password-error");
        return;
    }

    // If login is successful
    clearError(email, "login-email-error");
    clearError(password, "login-password-error");

    messageBox.textContent = "Login successful! Redirecting...";
    messageBox.style.color = "green";

    setTimeout(() => {
        window.location.href = "../index.html"; // Redirect to dashboard
    }, 1000);
});

// Forgot Password Logic
document.querySelector('.forgot-link a').addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt("Enter your registered @gmail.com email:");

    if (!email || !isValidEmail(email)) {
        alert("Please enter a valid @gmail.com email.");
        return;
    }

    const userData = localStorage.getItem(email);
    if (userData) {
        const newPassword = prompt("Enter a new password (6+ chars, A-Z, 0-9, @!$#):");

        if (!isValidPassword(newPassword)) {
            alert("Password must have letters, numbers, and @!$#");
            return;
        }

        const user = JSON.parse(userData);
        user.password = newPassword;
        localStorage.setItem(email, JSON.stringify(user));

        alert("Password reset successful! Please log in.");
    } else {
        alert("Email not found. Please sign up first.");
    }
});
