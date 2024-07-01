const loadProfile = async () => {
    const userImage = document.querySelector('.user-image');
    const username = document.querySelector('.user-name');

    try {
        const token = document.cookie.split('=')[1];
        const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (response.status === 200) {
            const data = await response.json();
            userImage.src = data.profilePicture ? data.profilePicture : '/assets/profile_placeholder.jpg';
            username.textContent = data.username;
        }
    } catch (error) {
        console.error(error);
    }
};

const handleLogout = async () => {
    document.cookie = 'token=;max-age=0';
    window.location.href = '/login';
};

loadProfile();
