document.querySelector(".mobile-menu-button").addEventListener("click", () => {
    document.querySelector(".mobile-menu").classList.add("open");
});

document
    .querySelector(".mobile-menu-close-button")
    .addEventListener("click", () => {
        document.querySelector(".mobile-menu").classList.remove("open");
    });
