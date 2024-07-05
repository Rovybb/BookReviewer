const passwordGroup = document.getElementById("passwordGroup");
const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

const changeUsernameGroup = document.getElementById("changeUsernameGroup");
const changeUsernameInput = document.getElementById("changeUsername");
const changeUsernameError = document.getElementById("changeUsernameError");

const changeEmailGroup = document.getElementById("changeEmailGroup");
const changeEmailInput = document.getElementById("changeEmail");
const changeEmailError = document.getElementById("changeEmailError");

const changeProfilePictureGroup = document.getElementById(
    "changeProfilePictureGroup"
);
const changeProfilePictureInput = document.getElementById(
    "changeProfilePicture"
);
const changeProfilePictureError = document.getElementById(
    "changeProfilePictureError"
);

const updateProfileButton = document.getElementById(
    "updateProfileSubmitButton"
);

const validatePassword = () => {
    passwordInput.removeEventListener("blur", validatePassword);
    passwordInput.addEventListener("input", validatePassword);

    if (passwordInput.value === "") {
        passwordGroup.classList.add("error");
        passwordError.textContent = "Password cannot be empty";
        return false;
    }

    if (passwordInput.value.length > 100) {
        passwordGroup.classList.add("error");
        passwordError.textContent = "Password is too long";
        return false;
    }

    if (passwordInput.value.length < 6) {
        passwordGroup.classList.add("error");
        passwordError.textContent = "Password must be at least 6 characters";
        return false;
    }

    passwordGroup.classList.remove("error");
    passwordError.textContent = "";
    return true;
};

const validateUsername = () => {
    changeUsernameInput.removeEventListener("blur", validateUsername);
    changeUsernameInput.addEventListener("input", validateUsername);

    if (changeUsernameInput.value.length > 100) {
        changeUsernameGroup.classList.add("error");
        changeUsernameError.textContent = "Username is too long";
        return false;
    }

    changeUsernameGroup.classList.remove("error");
    changeUsernameError.textContent = "";
    return true;
};

const validateEmail = () => {
    changeEmailInput.removeEventListener("blur", validateEmail);
    changeEmailInput.addEventListener("input", validateEmail);

    if (changeEmailInput.value === "") {
        changeEmailGroup.classList.add("error");
        changeEmailError.textContent = "Email cannot be empty";
        return false;
    }

    if (changeEmailInput.value.length > 100) {
        changeEmailGroup.classList.add("error");
        changeEmailError.textContent = "Email is too long";
        return false;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(changeEmailInput.value)) {
        changeEmailGroup.classList.add("error");
        changeEmailError.textContent = "Invalid email format";
        return false;
    }

    changeEmailGroup.classList.remove("error");
    changeEmailError.textContent = "";
    return true;
};

const validateEmailNotInUse = async () => {
    const email = changeEmailInput.value;
    const currentUserEmail = await getUserDetails(false);
    if (email === currentUserEmail.email) {
        changeEmailGroup.classList.remove("error");
        changeEmailError.textContent = "";
        return true;
    }
    if (!validateEmail()) return false;
    try {
        const email = changeEmailInput.value;
        const response = await fetch(`/api/users/email/${email}`, {
            method: "GET",
        });

        if (response.status === 200) {
            changeEmailGroup.classList.add("error");
            changeEmailError.textContent = "Email already exists";
            return false;
        }
        if (response.status === 204) {
            changeEmailGroup.classList.remove("error");
            changeEmailError.textContent = "";
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

const getUserDetails = async (completeFields) => {
    const token = document.cookie.split("=")[1];
    try {
        const response = await fetch(`/api/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            if (completeFields) {
                changeUsernameInput.value = data.username;
                changeEmailInput.value = data.email;
            }
            return data;
        }
    } catch (error) {
        console.error(error);
    }
};

const validateForm = async () => {
    if (
        !validatePassword() ||
        !validateUsername() ||
        !(await validateEmailNotInUse())
    ) {
        return false;
    }
    return true;
};

const updateProfile = async (updatedUser) => {
    try {
        const response = await fetch(`/api/users/${updatedUser.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: updatedUser.username,
                email: updatedUser.email,
                password: passwordInput.value,
                profilePicture: updatedUser.profilePicture,
            }),
        });

        if (response.status === 200) {
            window.location.href = "/profile";
        } else {
            const data = await response.json();
            if (data.error === "Invalid password") {
                alertMessage("Invalid password");
                passwordInput.value = "";
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!(await validateForm())) {
        return;
    }

    const password = passwordInput.value;
    const username = changeUsernameInput.value;
    const email = changeEmailInput.value;
    const profilePictureFile = changeProfilePictureInput.files[0];

    const currentUser = await getUserDetails(false);

    if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        reader.onload = async () => {
            const updatedUser = {
                id: currentUser.id,
                password: password,
                username: username,
                email: email,
                profilePicture: reader.result,
            };
            await updateProfile(updatedUser);
        };
    } else {
        const updatedUser = {
            id: currentUser.id,
            password: password,
            username: username,
            email: email,
            profilePicture: null,
        };
        await updateProfile(updatedUser);
    }
};

changeEmailInput.addEventListener("blur", validateEmailNotInUse);
changeEmailInput.addEventListener("blur", validateEmail);
changeUsernameInput.addEventListener("blur", validateUsername);
passwordInput.addEventListener("blur", validatePassword);

updateProfileButton.addEventListener("click", handleSubmit);

getUserDetails(true);
