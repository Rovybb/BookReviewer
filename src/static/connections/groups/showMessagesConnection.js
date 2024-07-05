const messagesContainer = document.querySelector(".messages");

const getUserById = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: "GET",
        });

        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
    }
};

const loadMessages = async () => {
    const groupId = window.location.pathname.split("/")[2];

    try {
        const response = await fetch(`/api/groupMessages/group/${groupId}`, {
            method: "GET",
        });

        if (response.status === 200) {
            const data = await response.json();
            if (data.length === 0) {
                messagesContainer.innerHTML =
                    '<p class="placeholder">No messages yet</p>';
                return;
            }
            messagesContainer.innerHTML = "";
            data.forEach(async (message) => {
                const user = await getUserById(message.userId);
                const formatedDate = new Date(message.createdAt)
                    .toLocaleDateString("en-UK", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })
                    .toString()
                    .split("/")
                    .join("-");
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");
                messageElement.innerHTML = `
                <div class="message">
                    <div class="message-header">
                        <img
                            src="${
                                user.profilePicture ||
                                "/assets/profile_placeholder.jpg"
                            }"
                            alt="User"
                            class="message-header-image"
                        />
                        <div class="message-header-text">
                            <span class="message-author">${user.username}</span>
                            <span class="message-date">${formatedDate}</span>
                        </div>
                    </div>
                    <p class="message-content">
                        ${message.message}
                    </p>
                </div>
                `;
                messagesContainer.appendChild(messageElement);
            });
        }
    } catch (error) {
        console.error(error);
    }
};

loadMessages();
