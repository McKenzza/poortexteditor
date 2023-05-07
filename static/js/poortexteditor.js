// All Buttons
let optionsButtons = document.querySelectorAll(".pte.button");
let optionsButtonsAdvanced = document.querySelectorAll(".pte.advanced.button");

// Format Buttons
let formatButtons = document.querySelectorAll(".pte.button.format");

//  Alignment Buttons
let alignButtons = document.querySelectorAll(".pte.advanced.button.align");

// Link/Unlink Buttons
let linkButton = document.getElementById("pte-link");
let unlinkButton = document.getElementById("pte-unlink");

// Text Input
let textarea = document.getElementById(".pte.advanced.button");

const initializer = () => {
    highlighter(alignButtons, true)
    highlighter(formatButtons, false)
}

const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            if(needsRemoval) {
                console.log("click");
                let alreadyActive = false;
                if(button.classList.contains("active")) {
                    alreadyActive = true;
                }
                highlighterRemover(className);
                if(!alreadyActive) {
                    // highlight
                    button.classList.add("active");
                }
            }
            else {
                //
                button.classList.toggle("active");
            }
        });
    });
}

const highlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    })
}

window.onload = initializer();

const modifyText = (command, defaultUI, value) => {
    // exec command on selected text
    document.execCommand(command, defaultUI, value);
}

formatButtons.forEach(button => {
    button.addEventListener("click", () => {
        console.log(button.id)
        modifyText(button.id.replace('pte-', ''), false, null);
    })
})

linkButton.addEventListener("click", () => {
    let userLink = prompt("Enter a URL:");
    if(/http/i.test(userLink)) {
        modifyText(linkButton.id.replace('pte-', ''), false, userLink);
    }
    else {
        userLink = "http://" + userLink;
        modifyText(linkButton.id.replace('pte-', ''), false, userLink);
    }
})