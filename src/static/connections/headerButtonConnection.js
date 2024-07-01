const loadProfileButton = async () => {
    const loginButton = document.getElementById("loginButton");
    const loginButtonMobile = document.querySelector(
        ".menu-list-link[href='/login']"
    );

    const token = document.cookie.split("=")[1];
    if (!token) {
        loginButtonMobile.textContent = "Login";
        loginButtonMobile.href = "/login";

        loginButton.textContent = "Login";
        loginButton.onclick = () => (window.location.href = "/login");
        return;
    }

    try {
        const response = await fetch("/api/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();

            const userImage = document.createElement("img");
            userImage.className = "button-image";
            userImage.src = data.profilePicture
                ? data.profilePicture
                : "/assets/profile_placeholder.jpg";
            userImage.alt = "Profile picture";

            loginButtonMobile.textContent = "Profile";
            loginButtonMobile.href = "/profile";

            loginButton.appendChild(userImage);
            loginButton.onclick = () => (window.location.href = "/profile");
        } else {
            loginButtonMobile.textContent = "Login";
            loginButtonMobile.href = "/login";

            loginButton.textContent = "Login";
            loginButton.onclick = () => (window.location.href = "/login");
        }
    } catch (error) {
        console.error(error);
    }
};
loadProfileButton();