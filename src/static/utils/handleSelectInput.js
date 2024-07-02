const selectInputs = document.getElementsByClassName("input-select");
const countSelectInputs = selectInputs.length;

for (let i = 0; i < countSelectInputs; i++) {
    const selectElement = selectInputs[i].getElementsByTagName("select")[0];
    const optionListLength = selectElement.length;

    const selectedElementDiv = document.createElement("div");
    selectedElementDiv.setAttribute("class", "select-selected");
    selectedElementDiv.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
    selectInputs[i].appendChild(selectedElementDiv);

    const optionsContainer = document.createElement("div");
    optionsContainer.setAttribute("class", "select-items select-hide");

    for (let j = 1; j < optionListLength; j++) {
        const optionDiv = document.createElement("DIV");
        optionDiv.innerHTML = selectElement.options[j].innerHTML;

        optionDiv.addEventListener("click", function(e) {
            const _selectElement = this.parentNode.parentNode.getElementsByTagName("select")[0];
            const _optionListLength = _selectElement.length;
            const _selectedElementDiv = this.parentNode.previousSibling;

            for (let i = 0; i < _optionListLength; i++) {
                if (_selectElement.options[i].innerHTML == this.innerHTML) {
                    _selectElement.selectedIndex = i;
                    _selectedElementDiv.innerHTML = this.innerHTML;

                    const selectedElements =
                        this.parentNode.getElementsByClassName(
                            "same-as-selected"
                        );

                    const selectedElementsLength = selectedElements.length;

                    for (let k = 0; k < selectedElementsLength; k++) {
                        selectedElements[k].removeAttribute("class");
                    }

                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }

            _selectedElementDiv.click();
        });

        optionsContainer.appendChild(optionDiv);
    }

    selectInputs[i].appendChild(optionsContainer);
    selectedElementDiv.addEventListener("click", function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

const closeAllSelect = (element) => {
    const arrNo = [];
    const optionsContainer = document.getElementsByClassName("select-items");
    const selectedElements = document.getElementsByClassName("select-selected");

    const optionsCount = optionsContainer.length;
    const selectedLength = selectedElements.length;
    for (let i = 0; i < selectedLength; i++) {
        if (element == selectedElements[i]) {
            arrNo.push(i);
        } else {
            selectedElements[i].classList.remove("select-arrow-active");
        }
    }
    for (let i = 0; i < optionsCount; i++) {
        if (arrNo.indexOf(i)) {
            optionsContainer[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
