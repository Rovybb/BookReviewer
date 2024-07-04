const emailGroup = document.getElementById("emailGroup");
const emailField = document.getElementById("email");
const emailError = document.getElementById("emailError");

const passwordGroup = document.getElementById("passwordGroup");
const passwordField = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const confirmPasswordField = document.getElementById("confirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const usernameGroup = document.getElementById("usernameGroup");
const usernameField = document.getElementById("username");
const usernameError = document.getElementById("usernameError");

const profilePictureGroup = document.getElementById("profilePictureGroup");
const profilePictureField = document.getElementById("profilePicture");
const profilePictureError = document.getElementById("profilePictureError");

const firstStepForm = document.getElementById("step1");
const secondStepForm = document.getElementById("step2");

const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const registerButton = document.getElementById("registerButton");

const validateEmail = () => {
    emailField.removeEventListener("blur", validateEmail);
    emailField.addEventListener("input", validateEmail);

    if (emailField.value === "") {
        emailGroup.classList.add("error");
        emailError.textContent = "Email cannot be empty";
        return false;
    }

    if (emailField.value.length > 100) {
        emailGroup.classList.add("error");
        emailError.textContent = "Email is too long";
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

const validateEmailNotInUse = async () => {
    if (!validateEmail())
        return false;
    try {
        const email = emailField.value;
        const response = await fetch(`/api/users/email/${email}`, {
            method: "GET",
        });

        if (response.status === 200) {
            emailGroup.classList.add("error");
            emailError.textContent = "Email already exists";
            return false;
        }
        if (response.status === 204) {
            emailGroup.classList.remove("error");
            emailError.textContent = "";
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

const validatePassword = () => {
    passwordField.removeEventListener("blur", validatePassword);
    passwordField.addEventListener("input", validatePassword);

    if (passwordField.value === "") {
        passwordGroup.classList.add("error");
        passwordError.textContent = "Password cannot be empty";
        return false;
    }

    if (passwordField.value.length > 100) {
        passwordGroup.classList.add("error");
        passwordError.textContent = "Password is too long";
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

const validateConfirmPassword = () => {
    confirmPasswordField.removeEventListener("blur", validateConfirmPassword);
    confirmPasswordField.addEventListener("input", validateConfirmPassword);

    if (confirmPasswordField.value !== passwordField.value) {
        confirmPasswordGroup.classList.add("error");
        confirmPasswordError.textContent = "Passwords do not match";
        return false;
    }

    confirmPasswordGroup.classList.remove("error");
    confirmPasswordError.textContent = "";
    return true;
};

const validateUsername = () => {
    usernameField.removeEventListener("blur", validateUsername);
    usernameField.addEventListener("input", validateUsername);

    if (usernameField.value.length > 100) {
        usernameGroup.classList.add("error");
        usernameError.textContent = "Username is too long";
        return false;
    }

    usernameGroup.classList.remove("error");
    usernameError.textContent = "";
    return true;
};

const validateFormStep1 = async () => {
    const isEmailValid = validateEmail();
    let isEmailNotUsed = false;
    if (isEmailValid) {
        isEmailNotUsed = await validateEmailNotInUse();
    }
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    return (
        isEmailValid &&
        isEmailNotUsed &&
        isPasswordValid &&
        isConfirmPasswordValid
    );
};

const validateFormStep2 = () => {
    const isUsernameValid = validateUsername();
    return isUsernameValid;
};

const verifyFirstStep = async (event) => {
    event.preventDefault();
    const isFormValid = await validateFormStep1();
    if (!isFormValid) {
        return;
    }

    firstStepForm.classList.add("hidden");
    secondStepForm.classList.remove("hidden");
    nextButton.type = "button";
    registerButton.type = "submit";
    usernameField.focus();
};

const goBack = (event) => {
    event.preventDefault();
    passwordField.value = "";
    confirmPasswordField.value = "";
    usernameField.value = "";
    firstStepForm.classList.remove("hidden");
    secondStepForm.classList.add("hidden");
    nextButton.type = "submit";
    registerButton.type = "button";
    emailField.focus();
};

const register = async (user) => {
    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password,
                username: user.username,
                profilePicture: user.profilePicture,
            }),
        });

        if (response.status === 201) {
            window.location.href = "/login";
        } else {
            const data = await response.json();
            emailGroup.classList.add("error");
            emailError.textContent = data.error;
        }
    } catch (error) {
        console.log(error);
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateFormStep2) {
        return;
    }

    const email = emailField.value;
    const password = passwordField.value;
    const username = usernameField.value;
    const profilePictureFile = profilePictureField.files[0];

    if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        reader.onload = async () => {
            const user = {
                email: email,
                password: password,
                username: username,
                profilePicture: reader.result,
            };
            await register(user);
        };
    } else {
        const user = {
            email: email,
            password: password,
            username: username,
            profilePicture: null,
        };
        register(user);
    }
};

emailField.addEventListener("blur", validateEmail);
emailField.addEventListener("blur", validateEmailNotInUse);
passwordField.addEventListener("blur", validatePassword);
confirmPasswordField.addEventListener("blur", validateConfirmPassword);
usernameField.addEventListener("blur", validateUsername);

nextButton.addEventListener("click", verifyFirstStep);
backButton.addEventListener("click", goBack);
registerButton.addEventListener("click", handleSubmit);
