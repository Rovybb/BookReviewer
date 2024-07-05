const commentSectionForm = document.querySelector(".comment-section-form");
const submitButton = document.getElementById("submitComment");

const commentGroup = document.getElementById("commentGroup");
const commentInput = document.getElementById("commentField");
const commentError = document.getElementById("commentError");

commentSectionForm.style.display = "none";

const hasAlraedyReviewed = async (userId) => {
    const bookId = window.location.pathname.split("/")[2];
    try {
        const response = await fetch(`/api/reviews/books/${bookId}?userId=${userId}`, {
            method: "GET",
        });

        if (response.status === 200) {
            return true;
        }

        return false;
    } catch (error) {
        console.error(error);
    }
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

        if (response.status === 200 && !(await hasAlraedyReviewed((await response.json()).id))) {
            commentSectionForm.style.display = "block";
        }
    } catch (error) {
        console.error(error);
    }
};

const validateComment = () => {
    commentInput.removeEventListener("blur", validateComment);
    commentInput.addEventListener("input", validateComment);

    if (commentInput.value === "") {
        commentGroup.classList.add("error");
        commentError.textContent = "Comment cannot be empty";
        return false;
    }

    if (commentInput.value.length > 1000) {
        commentGroup.classList.add("error");
        commentError.textContent =
            "Comment cannot be longer than 1000 characters";
        return false;
    }

    commentGroup.classList.remove("error");
    commentError.textContent = "";
    return true;
};

const validateRating = () => {
    const rating = document.querySelector('input[name="rating"]:checked');
    if (!rating) {
        return false;
    }
    return true;
};

const validateForm = () => {
    const isCommentValid = validateComment();
    const isRatingValid = validateRating();
    return isCommentValid && isRatingValid;
};

const handleCreateReview = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    const description = commentInput.value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const bookId = window.location.pathname.split("/")[2];

    try {
        const response = await fetch(`/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${document.cookie.split("=")[1]}`,
            },
            body: JSON.stringify({ description, rating, bookId }),
        });

        if (response.status === 201) {
            window.location.reload();
        } else if (response.status === 401) {
            window.location.href = "/login";
        } else {
            const data = await response.json();
            commentGroup.classList.add("error");
            commentError.textContent = data.error;
        }
    } catch (error) {
        console.error(error);
    }
};

isLogged();

submitButton.addEventListener("click", handleCreateReview);

commentInput.addEventListener("blur", validateComment);
