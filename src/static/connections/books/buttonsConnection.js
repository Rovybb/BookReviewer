const addButton = document.getElementById("addToListButton");
const removeButton = document.getElementById("removeFromListButton");
const editButton = document.getElementById("editBookButton");
const deleteButton = document.getElementById("deleteBookButton");

const addBookToList = async () => {
    const bookId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];

    try {
        const response = await fetch(`/api/users/booklist?bookId=${bookId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            addButton.style.display = "none";
            removeButton.style.display = "block";
            alertMessage("Book added to your list");
        } else if (response.status === 401) {
            alertMessage("You need to be logged in to add books to your list");
        } else if (response.status === 409) {
            alertMessage("Book is already in your list");
        } else if (response.status === 404) {
            alertMessage("Book not found");
        } else {
            alertMessage("Something went wrong");
        }
    } catch (error) {
        console.error(error);
    }
};

const removeFromList = async () => {
    const bookId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];

    try {
        const response = await fetch(`/api/users/booklist?bookId=${bookId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 204) {
            addButton.style.display = "block";
            removeButton.style.display = "none";
            alertMessage("Book removed from your list");
        } else if (response.status === 401) {
            alertMessage(
                "You need to be logged in to remove books from your list"
            );
        } else if (response.status === 404) {
            alertMessage("Book is not in your list");
        } else {
            alertMessage("Something went wrong");
        }
    } catch (error) {
        console.error(error);
    }
};

const editBook = () => {
    window.location.href = `/admin/edit-book/${
        window.location.pathname.split("/")[2]
    }`;
};

const deleteBook = async () => {
    const bookId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];

    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 204) {
            window.location.href = "/books";
        } else if (response.status === 401) {
            alertMessage("You need to be logged in to delete books");
        } else if (response.status === 403) {
            alertMessage("You are not authorized to delete books");
        } else if (response.status === 404) {
            alertMessage("Book not found");
        } else {
            alertMessage("Something went wrong");
        }
    } catch (error) {
        console.error(error);
    }
};

const isBookInList = async () => {
    const bookId = window.location.pathname.split("/")[2];
    const token = document.cookie.split("=")[1];
    try {
        const response = await fetch(`/api/users/booklist`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            const bookIds = data.map((book) => book.id);
            if (bookIds.includes(parseInt(bookId))) {
                addButton.style.display = "none";
                removeButton.style.display = "block";
            } else {
                addButton.style.display = "block";
                removeButton.style.display = "none";
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const loadButtons = async () => {
    const token = document.cookie.split("=")[1];

    addButton.style.display = "none";
    removeButton.style.display = "none";
    editButton.style.display = "none";
    deleteButton.style.display = "none";


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
                editButton.style.display = "block";
                deleteButton.style.display = "block";
            }
            await isBookInList();
        }
    } catch (error) {
        console.error(error);
    }
};

loadButtons();

addButton.addEventListener("click", addBookToList);
removeButton.addEventListener("click", removeFromList);
editButton.addEventListener("click", editBook);
deleteButton.addEventListener("click", deleteBook);
