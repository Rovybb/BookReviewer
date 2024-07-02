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
    firstStepForm.classList.remove("hidden");
    secondStepForm.classList.add("hidden");
    nextButton.type = "submit";
    registerButton.type = "button";
    emailField.focus();
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateFormStep1()) {
        return;
    }

    const email = emailField.value;
    const password = passwordField.value;
    const username = usernameField.value;
    // const profilePicture = profilePictureField.value;

    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                username,
                profilePicture:
                    "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e5/63/15/e5631543-9e8c-7cb7-61b4-d122fb6003cc/23UM1IM16968.rgb.jpg/256x256bb.jpg",
                // TODO: Add profile picture
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

emailField.addEventListener("blur", validateEmail);
emailField.addEventListener("blur", validateEmailNotInUse);
passwordField.addEventListener("blur", validatePassword);
confirmPasswordField.addEventListener("blur", validateConfirmPassword);

nextButton.addEventListener("click", verifyFirstStep);
backButton.addEventListener("click", goBack);
registerButton.addEventListener("click", handleSubmit);
