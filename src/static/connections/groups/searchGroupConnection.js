const groupsContainer = document.querySelector(".groups-container");
const searchInput = document.getElementById("search");
const searchButton = document.querySelector(".search-button");

const buildGroupCard = (group) => {
    return `
    <div
        class="group-card"
        onclick="handleNavigate('/groups/${group.id}')"
    >
        <img
            src="${group.imageLink}"
            alt="${group.name}"
            class="group-card-image"
        />
        <div class="group-card-text-container">
            <h3 class="group-card-title">${group.name}</h3>
            <p class="group-card-members-count">Members: ${group.membersCount}</p>
            <p class="group-card-description">
                ${group.description}
            </p>
        </div>
    </div>
    `;
};

const handleSearch = async (event) => {
    event && event.preventDefault();
    try {
        const response = await fetch(`/api/groups/search/${searchInput.value}`, {
            method: "GET",
        });
        const groups = await response.json();

        groupsContainer.innerHTML = groups ? groups.map(buildGroupCard).join("") : "No groups found";
    } catch (error) {
        console.error(error);
    }
};

searchButton.addEventListener("click", handleSearch);

handleSearch();
