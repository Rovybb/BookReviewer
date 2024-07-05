const commentsContainer = document.querySelector(".comments");

const getUserById = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: "GET",
        });

        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
    }
};

const loadReviews = async () => {
    const bookId = window.location.pathname.split("/")[2];
    try {
        const response = await fetch(`/api/reviews/books/${bookId}`, {
            method: "GET",
        });

        if (response.status === 200) {
            const data = await response.json();
            if (data.length === 0) {
                commentsContainer.innerHTML =
                    '<p class="placeholder" >No reviews yet</p>';
                return;
            }
            commentsContainer.innerHTML = "";
            for (let i = 0; i < data.length; i++) {
                const review = data[i];
                const user = await getUserById(review.userId);
                const formatedDate = new Date(review.createdAt)
                    .toLocaleDateString("en-UK", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })
                    .toString()
                    .split("/")
                    .join("-");
                const comment = document.createElement("div");
                comment.classList.add("comment");
                comment.innerHTML = `
                    <div class="comment-header">
                        <img
                            src="${
                                user.profilePicture ||
                                "/assets/profile_placeholder.jpg"
                            }"
                            alt="User"
                            class="comment-header-image"
                        />
                        <div class="comment-header-text">
                            <span class="comment-author">${user.username}</span>
                            <span class="comment-date">${formatedDate}</span>
                        </div>
                    </div>
                    <div class="comment-rating">
                         ${Array.from(
                             { length: Math.round(review.rating) },
                             (_, i) =>
                                 `<span class="fa fa-star --filled"></span>`
                         ).join("")}
                        ${Array.from(
                            { length: 5 - Math.round(review.rating) },
                            (_, i) => `<span class="fa fa-star"></span>`
                        ).join("")}
                    </div>
                    <p class="comment-content">
                        ${review.description}
                    </p>
                `;
                commentsContainer.appendChild(comment);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

loadReviews();
