const oldPasswordGroup = document.getElementById('oldPasswordGroup');
const oldPasswordInput = document.getElementById('oldPassword');
const oldPasswordError = document.getElementById('oldPasswordError');

const newPasswordGroup = document.getElementById('newPasswordGroup');
const newPasswordInput = document.getElementById('newPassword');
const newPasswordError = document.getElementById('newPasswordError');

const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const confirmPasswordInput = document.getElementById('confirmPassword');
const confirmPasswordError = document.getElementById('confirmPasswordError');

const changePasswordButton = document.getElementById('changePasswordSubmitButton');

const validateOldPassword = () => {
    oldPasswordInput.removeEventListener('blur', validateOldPassword);
    oldPasswordInput.addEventListener('input', validateOldPassword);

    if (oldPasswordInput.value === '') {
        oldPasswordGroup.classList.add('error');
        oldPasswordError.textContent = 'Password cannot be empty';
        return false;
    }

    if (oldPasswordInput.value.length > 100) {
        oldPasswordGroup.classList.add('error');
        oldPasswordError.textContent = 'Password is too long';
        return false;
    }

    oldPasswordGroup.classList.remove('error');
    oldPasswordError.textContent = '';
    return true;
};

const validateNewPassword = () => {
    newPasswordInput.removeEventListener('blur', validateNewPassword);
    newPasswordInput.addEventListener('input', validateNewPassword);

    if (newPasswordInput.value === '') {
        newPasswordGroup.classList.add('error');
        newPasswordError.textContent = 'Password cannot be empty';
        return false;
    }

    if (newPasswordInput.value.length > 100) {
        newPasswordGroup.classList.add('error');
        newPasswordError.textContent = 'Password is too long';
        return false;
    }

    if (newPasswordInput.value.length < 6) {
        newPasswordGroup.classList.add('error');
        newPasswordError.textContent = 'Password must be at least 6 characters';
        return false;
    }

    newPasswordGroup.classList.remove('error');
    newPasswordError.textContent = '';
    return true;
};


const validateConfirmPassword = () => {
    confirmPasswordInput.removeEventListener('blur', validateConfirmPassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    if (confirmPasswordInput.value !== newPasswordInput.value) {
        confirmPasswordGroup.classList.add('error');
        confirmPasswordError.textContent = 'Passwords do not match';
        return false;
    }

    confirmPasswordGroup.classList.remove('error');
    confirmPasswordError.textContent = '';
    return true;
};

const validateChangePasswordForm = () => {
    return validateOldPassword() && validateNewPassword() && validateConfirmPassword();
};

const changePassword = async (event) => {
    event.preventDefault();
    if (!validateChangePasswordForm()) {
        return;
    }

    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const user = await getUserDetails(false);
    const userId = user.id;

    try {
        const response = await fetch(`/api/users/password/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });
    
        if (response.status === 200) {
            window.location.href = '/profile';
        } else {
            const data = await response.json();
            if (data.error === 'Invalid password') {
                alertMessage('Invalid password');
                oldPasswordInput.value = '';
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
            }
        }
    } catch (error) {
        console.error(error);
    }
};
    
oldPasswordInput.addEventListener('blur', validateOldPassword);
newPasswordInput.addEventListener('blur', validateNewPassword);
confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

changePasswordButton.addEventListener('click', changePassword);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});
    