const groupNameGroup = document.getElementById('editGroupNameGroup');
const groupNameField = document.getElementById('editGroupName');
const groupNameError = document.getElementById('editGroupNameError');

const groupDescriptionGroup = document.getElementById('editGroupDescriptionGroup');
const groupDescriptionField = document.getElementById('editGroupDescription');
const groupDescriptionError = document.getElementById('editGroupDescriptionError');

const groupImageGroup = document.getElementById('editGroupImageGroup');
const groupImageField = document.getElementById('editGroupImage');
const groupImageError = document.getElementById('editGroupImageError');

const editGroupButton = document.getElementById('editGroupSubmitButton');

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

const validateGroupForm = () => {
    return validateGroupName() && validateGroupDescription();
};

const completeGroupData = async () => {
    const groupId = window.location.pathname.split('/').pop();

    try {
        const response = await fetch(`/api/groups/${groupId}`,
            {
                method: 'GET',
            }
        );

        if (response.status !== 200) {
            throw new Error('Failed to fetch group data');
        }

        const group = await response.json();
        groupNameField.value = group.name;
        groupDescriptionField.value = group.description;
    } catch (error) {
        console.error(error);
    }
};

const editGroup = async (groupId, group) => {
    const token = document.cookie.split('=')[1];
    try {
        const response = await fetch(`/api/groups/${groupId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(group),
            }
        );

        if (response.status === 200) {
            window.location.href = `/groups/${groupId}`;
        } else {
            alertMessage('Failed to edit group');
        }
    } catch (error) {
        console.error(error);
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateGroupForm()) {
        return;
    }

    const groupId = window.location.pathname.split('/').pop();
    const name = groupNameField.value;
    const description = groupDescriptionField.value;
    const groupImage = groupImageField.files[0];

    if (groupImage) {
        const reader = new FileReader();
        reader.readAsDataURL(groupImage);
        reader.onload = async () => {
            const group = {
                name,
                description,
                imageLink: reader.result,
            };

            await editGroup(groupId, group);
        };
    } else {
        const group = {
            name,
            description,
        };

        await editGroup(groupId, group);
    }
};

groupNameField.addEventListener('blur', validateGroupName);
groupDescriptionField.addEventListener('blur', validateGroupDescription);

editGroupButton.addEventListener('click', handleSubmit);

completeGroupData();
