const emailGroup = document.getElementById("emailGroup");
const emailField = document.getElementById("email");
const emailError = document.getElementById("emailError");

const passwordGroup = document.getElementById("passwordGroup");
const passwordField = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

const loginButton = document.getElementById("loginButton");

const validateEmail = () => {
    emailField.removeEventListener("blur", validateEmail);
    emailField.addEventListener("input", validateEmail);

    if (emailField.value === "") {
        emailGroup.classList.add("error");
        emailError.textContent = "Email cannot be empty";
        return false;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(emailField.value)) {
        emailGroup.classList.add("error");
        emailError.textContent = "Invalid email format";
        return false;
    }

    emailGroup.classList.remove("error");
    emailError.textContent = "";
    return true;
};

const validatePassword = () => {
    passwordField.removeEventListener("blur", validatePassword);
    passwordField.addEventListener("input", validatePassword);

    if (passwordField.value === "") {
        passwordGroup.classList.add("error");
        passwordError.textContent = "Password cannot be empty";
        return false;
    }

    if (passwordField.value.length < 6) {
        passwordGroup.classList.add("error");
        passwordError.textContent = "Password must be at least 6 characters";
        return false;
    }

    passwordGroup.classList.remove("error");
    passwordError.textContent = "";
    return true;
};

const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    return isEmailValid && isPasswordValid;
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    const email = emailField.value;
    const password = passwordField.value;

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 200) {
            const data = await response.json();
            document.cookie = `token=${data.token};max-age=3600`;
            window.location.href = "/";
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error(error);
    }
};

emailField.addEventListener("blur", validateEmail);
passwordField.addEventListener("blur", validatePassword);
loginButton.addEventListener("click", handleSubmit);
