const booksGrid = document.querySelector(".books-grid");
const searchInput = document.getElementById("search");
const searchButton = document.querySelector(".search-button");
const genreSelect = document.getElementById("genre");

const buildBookCard = (book) => {
    return `
    <div
        class="books-grid-card"
        onclick="handleNavigate('/books/${book.id}')"
    >
        <img
            src="${book.imageLink}"
            alt="${book.title}"
            class="books-grid-card-image"
            title="${book.title}"
        />
    </div>
    `;
};

const handleSearch = async (event) => {
    event && event.preventDefault();
    try {
        const response = await fetch(
            `/api/books?search=${searchInput.value}&genre=${genreSelect.value}`
        );
        const books = await response.json();

        booksGrid.innerHTML = books ? books.map(buildBookCard).join("") : "No books found";
    } catch (error) {
        console.error(error);
    }
};

searchButton.addEventListener("click", handleSearch);
const selectOptions = document.querySelector(".select-items").getElementsByTagName("div");
for (let i = 0; i < selectOptions.length; i++) {
    selectOptions[i].addEventListener("click", handleSearch);
}

handleSearch();
