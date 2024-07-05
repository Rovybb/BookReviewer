const alertElement = document.createElement("div");
alertElement.classList.add("alert");

const alertMessage = (message) => {
    alertElement.textContent = message;
    body.appendChild(alertElement);
    setTimeout(() => {
        alertElement.remove();
    }, 3000);
};