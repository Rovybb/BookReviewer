const messageForm = document.getElementById('messageForm');
const sendButton = document.getElementById('sendButton');

const messageGroup = document.getElementById('messageGroup');
const messageInput = document.getElementById('messageInput');
const messageError = document.getElementById('messageError');

messageForm.style.display = 'none';

const validateMessage = () => {
    messageInput.removeEventListener('blur', validateMessage);
    messageInput.addEventListener('input', validateMessage);

    if (messageInput.value === '') {
        messageGroup.classList.add('error');
        messageError.textContent = 'Message cannot be empty';
        return false;
    }

    if (messageInput.value.length > 1000) {
        messageGroup.classList.add('error');
        messageError.textContent = 'Message cannot be longer than 1000 characters';
        return false;
    }

    messageGroup.classList.remove('error');
    messageError.textContent = '';
    return true;
};

const isLogged = async () => {
    const token = document.cookie.split("=")[1];
    try {
        const response = await fetch(`/api/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 && await getUserInGroup()) {
            messageForm.style.display = "flex";
            const data = await response.json();
            return data.id;
        }
    } catch (error) {
        console.error(error);
    }
};

const getUserInGroup = async () => {
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
                return true;
            } 
            return false;
        }
    } catch (error) {
        console.error(error);
    }
};

const createMessage = async (e) => {
    e.preventDefault();
    if (!validateMessage()) {
        return;
    }

    const groupId = window.location.pathname.split('/')[2];
    const token = document.cookie.split('=')[1];

    try {
        const response = await fetch(`/api/groupMessages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: messageInput.value,
                groupId,
            }),
        });
        console.log(response);
        if (response.status === 201) {
            window.location.reload();
        } else if (response.status === 401) {
            alertMessage('You need to be logged in to create messages');
        } else {
            alertMessage('Something went wrong');
        }
    } catch (error) {
        console.error(error);
    }
};

isLogged();

sendButton.addEventListener('click', createMessage);

messageInput.addEventListener('blur', validateMessage);