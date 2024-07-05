const joinButton = document.getElementById("joinButton");
const leaveButton = document.getElementById("leaveButton");
const deleteGroupButton = document.getElementById("deleteGroupButton");
const editGroupButton = document.getElementById("editGroupButton");

const groupMembersCount = document.querySelector(".group-members-count");

const joinGroup = async () => {
    const groupId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];

    try {
        const response = await fetch(`/api/groups/join/${groupId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            window.location.reload();
        } else if (response.status === 401) {
            alertMessage("You need to be logged in to join groups");
        } else if (response.status === 409) {
            alertMessage("You are already in this group");
        } else if (response.status === 404) {
            alertMessage("Group not found");
        } else {
            alertMessage("Something went wrong");
        }
    } catch (error) {
        console.error(error);
    }
};

const leaveGroup = async () => {
    const groupId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];

    try {
        const response = await fetch(`/api/groups/leave/${groupId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 204) {
            window.location.reload();
        } else if (response.status === 401) {
            alertMessage("You need to be logged in to leave groups");
        } else if (response.status === 404) {
            alertMessage("You are not in this group");
        } else {
            alertMessage("Something went wrong");
        }
    } catch (error) {
        console.error(error);
    }
};

const deleteGroup = async () => {
    const groupId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];

    try {
        const response = await fetch(`/api/groups/${groupId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 204) {
            alertMessage("Group deleted");
            window.location.href = "/groups";
        } else if (response.status === 401) {
            alertMessage("You need to be logged in to delete groups");
        } else if (response.status === 403) {
            alertMessage("Access denied");
        } else if (response.status === 404) {
            alertMessage("Group not found");
        } else {
            alertMessage("Something went wrong");
        }
    } catch (error) {
        console.error(error);
    }
};

const editGroup = () => {
    window.location.href = `/admin/edit-group/${
        window.location.pathname.split("/")[2]
    }`;
};

const getUserId = async () => {
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
            return data.id;
        } else {
            alertMessage("You need to be logged in to join groups");
        }
    } catch (error) {
        console.error(error);
    }
};

const isUserInGroup = async () => {
    const groupId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];

    try {
        const response = await fetch(`/api/groups/${groupId}/members`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            const usersIds = data.map((user) => user.id);
            const userId = await getUserId();
            if (usersIds.includes(userId)) {
                joinButton.style.display = "none";
                leaveButton.style.display = "block";
            } else {
                joinButton.style.display = "block";
                leaveButton.style.display = "none";
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const loadButtons = async () => {
    const token = document.cookie.split("=")[1];

    joinButton.style.display = "none";
    leaveButton.style.display = "none";
    deleteGroupButton.style.display = "none";
    editGroupButton.style.display = "none";

    try {
        const response = await fetch(`/api/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            if (data.role === "Admin") {
                deleteGroupButton.style.display = "block";
                editGroupButton.style.display = "block";
            }
            await isUserInGroup();
        }
    } catch (error) {
        console.error(error);
    }
};

loadButtons();

joinButton.addEventListener("click", joinGroup);
leaveButton.addEventListener("click", leaveGroup);
deleteGroupButton.addEventListener("click", deleteGroup);
editGroupButton.addEventListener("click", editGroup);
