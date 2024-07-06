const titleGroup = document.getElementById("editBookTitleGroup");
const titleField = document.getElementById("editBookTitle");
const titleError = document.getElementById("editBookTitleError");

const authorGroup = document.getElementById("editBookAuthorGroup");
const authorField = document.getElementById("editBookAuthor");
const authorError = document.getElementById("editBookAuthorError");

const descriptionGroup = document.getElementById("editBookDescriptionGroup");
const descriptionField = document.getElementById("editBookDescription");
const descriptionError = document.getElementById("editBookDescriptionError");

const imageGroup = document.getElementById("editBookImageGroup");
const imageField = document.getElementById("editBookImage");
const imageError = document.getElementById("editBookImageError");

const genreGroup = document.getElementById("editBookGenreGroup");
const genreField = document.getElementById("editBookGenre");
const genreError = document.getElementById("editBookGenreError");

const editBookButton = document.getElementById("editBookSubmitButton");

const validateTitle = () => {
    titleField.removeEventListener("blur", validateTitle);
    titleField.addEventListener("input", validateTitle);

    if (titleField.value === "") {
        titleGroup.classList.add("error");
        titleError.textContent = "Title cannot be empty";
        return false;
    }

    if (titleField.value.length > 100) {
        titleGroup.classList.add("error");
        titleError.textContent = "Title must be at most 100 characters";
        return false;
    }

    titleGroup.classList.remove("error");
    titleError.textContent = "";
    return true;
};

const validateAuthor = () => {
    authorField.removeEventListener("blur", validateAuthor);
    authorField.addEventListener("input", validateAuthor);

    if (authorField.value === "") {
        authorGroup.classList.add("error");
        authorError.textContent = "Author cannot be empty";
        return false;
    }

    if (authorField.value.length > 100) {
        authorGroup.classList.add("error");
        authorError.textContent = "Author must be at most 100 characters";
        return false;
    }

    authorGroup.classList.remove("error");
    authorError.textContent = "";
    return true;
};

const validateDescription = () => {
    descriptionField.removeEventListener("blur", validateDescription);
    descriptionField.addEventListener("input", validateDescription);

    if (descriptionField.value.length > 1000) {
        descriptionGroup.classList.add("error");
        descriptionError.textContent =
            "Description must be at most 500 characters";
        return false;
    }

    descriptionGroup.classList.remove("error");
    descriptionError.textContent = "";
    return true;
};

const validateGenre = () => {
    const selectOptions = genreField.parentNode
        .querySelector(".select-items")
        .getElementsByTagName("div");
    for (let i = 0; i < selectOptions.length; i++) {
        selectOptions[i].addEventListener("click", validateGenre);
    }

    if (genreField.value === "") {
        genreGroup.classList.add("error");
        genreError.textContent = "Genre cannot be empty";
        return false;
    }

    genreGroup.classList.remove("error");
    genreError.textContent = "";
    return true;
};

const validateForm = () => {
    return (
        validateTitle() &&
        validateAuthor() &&
        validateDescription() &&
        validateGenre()
    );
};

const completeBookData = async () => {
    const bookId = window.location.pathname.split("/").pop();

    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: "GET",
        });

        if (response.status !== 200) {
            throw new Error("Failed to fetch book data");
        }

        const book = await response.json();
        titleField.value = book.title;
        authorField.value = book.author;
        descriptionField.value = book.description;
        genreField.nextElementSibling.textContent = book.genre;
        genreField.value = book.genre;
    } catch (error) {
        console.error(error);
    }
};

const editBook = async (bookId, book) => {
    const token = document.cookie.split("=")[1];
    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(book),
        });

        if (response.status === 200) {
            window.location.href = `/books/${bookId}`;
        } else {
            alertMessage("Failed to edit book");
        }
    } catch (error) {
        console.error(error);
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    const bookId = window.location.pathname.split("/").pop();
    const title = titleField.value;
    const author = authorField.value;
    const description = descriptionField.value;
    const genre = genreField.value;
    const bookImageFile = imageField.files[0];

    if (bookImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(bookImageFile);
        reader.onload = async () => {
            const book = {
                title,
                author,
                description,
                imageLink: reader.result,
                genre,
            };

            await editBook(bookId, book);
        };
    } else {
        const book = {
            title,
            author,
            description,
            genre,
        };

        await editBook(bookId, book);
    }
};

titleField.addEventListener("blur", validateTitle);
authorField.addEventListener("blur", validateAuthor);
descriptionField.addEventListener("blur", validateDescription);

editBookButton.addEventListener("click", handleSubmit);

completeBookData();
