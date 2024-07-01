const handlePreview = () => {
    const fileInput = document.getElementById("profilePicture");
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Profile Picture";
        img.classList.add("input-file-preview-img");

        const authCardImg = document.querySelector(
            ".input-file-preview"
        );
        if (authCardImg) {
            authCardImg.replaceWith(img);
        }
        else {
            const authImage = document.querySelector(
                ".input-file-preview-img"
            );
            authImage.replaceWith(img);
        }
    };

    reader.readAsDataURL(file);
};