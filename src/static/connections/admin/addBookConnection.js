const titleGroup = document.getElementById("addBookTitleGroup");
const titleField = document.getElementById("addBookTitle");
const titleError = document.getElementById("addBookTitleError");

const authorGroup = document.getElementById("addBookAuthorGroup");
const authorField = document.getElementById("addBookAuthor");
const authorError = document.getElementById("addBookAuthorError");

const descriptionGroup = document.getElementById("addBookDescriptionGroup");
const descriptionField = document.getElementById("addBookDescription");
const descriptionError = document.getElementById("addBookDescriptionError");

const imageGroup = document.getElementById("addBookImageGroup");
const imageField = document.getElementById("addBookImage");

const genreGroup = document.getElementById("addBookGenreGroup");
const genreField = document.getElementById("addBookGenre");
const genreError = document.getElementById("addBookGenreError");

const addBookButton = document.getElementById("addBookSubmitButton");

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
}

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
}

const validateDescription = () => {
    descriptionField.removeEventListener("blur", validateDescription);
    descriptionField.addEventListener("input", validateDescription);

    if (descriptionField.value.length > 500) {
        descriptionGroup.classList.add("error");
        descriptionError.textContent = "Description must be at most 500 characters";
        return false;
    }

    descriptionGroup.classList.remove("error");
    descriptionError.textContent = "";
    return true;
}

const validateGenre = () => {
    const selectOptions = genreField.parentNode.querySelector(".select-items").getElementsByTagName("div");
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
}

const validateForm = () => {
    return validateTitle() && validateAuthor() && validateDescription() && validateGenre();
}

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    const book = {
        title: titleField.value,
        author: authorField.value,
        description: descriptionField.value,
        imageLink: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg", // TODO: Add image upload
        genre: genreField.value,
        rating: 0,
    };

    try {
        const response = await fetch("/api/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(book),
        });

        if (response.status === 201) {
            alert("Book added");
            titleField.value = "";
            authorField.value = "";
            descriptionField.value = "";
            genreField.value = "";
        }
    } catch (error) {
        console.error(error);
    }
};

titleField.addEventListener("blur", validateTitle);
authorField.addEventListener("blur", validateAuthor);
descriptionField.addEventListener("blur", validateDescription);

addBookButton.addEventListener("click", handleSubmit);