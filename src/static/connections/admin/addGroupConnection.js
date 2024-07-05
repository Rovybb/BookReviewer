const groupNameGroup = document.getElementById('addGroupNameGroup');
const groupNameField = document.getElementById('addGroupName');
const groupNameError = document.getElementById('addGroupNameError');

const groupDescriptionGroup = document.getElementById('addGroupDescriptionGroup');
const groupDescriptionField = document.getElementById('addGroupDescription');
const groupDescriptionError = document.getElementById('addGroupDescriptionError');

const groupImageGroup = document.getElementById('addGroupImageGroup');
const groupImageField = document.getElementById('addGroupImage');
const groupImageError = document.getElementById('addGroupImageError');

const addGroupButton = document.getElementById('addGroupSubmitButton');

const validateGroupName = () => {
    groupNameField.removeEventListener('blur', validateGroupName);
    groupNameField.addEventListener('input', validateGroupName);

    if (groupNameField.value === '') {
        groupNameGroup.classList.add('error');
        groupNameError.textContent = 'Group name cannot be empty';
        return false;
    }

    if (groupNameField.value.length > 100) {
        groupNameGroup.classList.add('error');
        groupNameError.textContent = 'Group name must be at most 100 characters';
        return false;
    }

    groupNameGroup.classList.remove('error');
    groupNameError.textContent = '';
    return true;
};

const validateGroupDescription = () => {
    groupDescriptionField.removeEventListener('blur', validateGroupDescription);
    groupDescriptionField.addEventListener('input', validateGroupDescription);

    if (groupDescriptionField.value.length > 1000) {
        groupDescriptionGroup.classList.add('error');
        groupDescriptionError.textContent = 'Description must be at most 500 characters';
        return false;
    }

    groupDescriptionGroup.classList.remove('error');
    groupDescriptionError.textContent = '';
    return true;
};

const validateGroupImage = () => {
    if (groupImageField.files.length === 0) {
        groupImageGroup.classList.add("error");
        groupImageError.textContent = "Image cannot be empty";
        return false;
    }

    groupImageGroup.classList.remove("error");
    groupImageError.textContent = "";
    return true;
};

const validateGroupForm = () => {
    return validateGroupName() && validateGroupDescription() && validateGroupImage();
};

const handleAddGroupSubmit = async (event) => {
    event.preventDefault();
    if (!validateGroupForm()) {
        return;
    }

    const groupImageFile = groupImageField.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(groupImageFile);
    reader.onload = async () => {
        const group = {
            name: groupNameField.value,
            description: groupDescriptionField.value,
            imageLink: reader.result,
        };

        const token = document.cookie.split('=')[1];

        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(group),
            });

            if (response.status === 201) {
                alertMessage('Group added');
                groupNameField.value = '';
                groupDescriptionField.value = '';
            }
        } catch (error) {
            console.error(error);
        }
    };
};

groupNameField.addEventListener('blur', validateGroupName);
groupDescriptionField.addEventListener('blur', validateGroupDescription);

addGroupButton.addEventListener('click', handleAddGroupSubmit);
