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
let textarea = document.getElementById("pte-text-input");

// Headers
let headers = document.getElementById(".pte.headers");

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

const modifyText = (command, text) => {
    console.log(getSelectionText(), command);

    // do smth with wrapping...
    var rng = document.createRange();
    var content = textarea.textContent;
    console.log(content)
    

    // Deprecated variant:
    // exec command on selected text
    // document.execCommand(command, defaultUI, value);
}


formatButtons.forEach(button => {
    button.addEventListener("click", () => {
        console.log(button.id)
        // modifyText(button.id.replace('pte-', ''), false, null);
        text = getSelectionText()
        console.log("click on:  ",text)
        modifyText(button.id.replace('pte-', ''), text);
        textarea.focus();

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


function pteInit() {
    let pte = document.getElementById("pte-text-input");
    // setting handler on focus
    pte.addEventListener("focus", () => {
        pte.classList.add('focused');
        optionsButtons.forEach((button) => {
            button.style.display = '';
        })
    });
    pte.addEventListener("blur", () => pte.classList.remove('focused'), true);
    
    // highlighter for buttons on click
    // true if it needs Removal
    highlighter(alignButtons, true)
    highlighter(formatButtons, false)
}

window.onload = () => {
    optionsButtons.forEach((button) => {
        button.style.display = 'none';
    })
    pteInit();
}

function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.getSelection) {
        text = document.getSelection().toString();
    }
    return text;
}

function fixIERangeObject(range, win) { //Only for IE8 and below.
    win = win || window;
  
    if (!range) return null;
    if (!range.startContainer && win.document.selection) { //IE8 and below
  
      var _findTextNode = function(parentElement, text) {
        //Iterate through all the child text nodes and check for matches
        //As we go through each text node keep removing the text value (substring) from the beginning of the text variable.
        var container = null,
          offset = -1;
        for (var node = parentElement.firstChild; node; node = node.nextSibling) {
          if (node.nodeType == 3) { //Text node
            var find = node.nodeValue;
            var pos = text.indexOf(find);
            if (pos == 0 && text != find) { //text==find is a special case
              text = text.substring(find.length);
            } else {
              container = node;
              offset = text.length - 1; //Offset to the last character of text. text[text.length-1] will give the last character.
              break;
            }
          }
        }
        //Debug Message
        //alert(container.nodeValue);
        return {
          node: container,
          offset: offset
        }; //nodeInfo
      }
  
      var rangeCopy1 = range.duplicate(),
        rangeCopy2 = range.duplicate(); //Create a copy
      var rangeObj1 = range.duplicate(),
        rangeObj2 = range.duplicate(); //More copies :P
  
      rangeCopy1.collapse(true); //Go to beginning of the selection
      rangeCopy1.moveEnd('character', 1); //Select only the first character
      rangeCopy2.collapse(false); //Go to the end of the selection
      rangeCopy2.moveStart('character', -1); //Select only the last character
  
      //Debug Message
      // alert(rangeCopy1.text); //Should be the first character of the selection
      var parentElement1 = rangeCopy1.parentElement(),
        parentElement2 = rangeCopy2.parentElement();
  
      //If user clicks the input button without selecting text, then moveToElementText throws an error.
      if (parentElement1 instanceof HTMLInputElement || parentElement2 instanceof HTMLInputElement) {
        return null;
      }
      rangeObj1.moveToElementText(parentElement1); //Select all text of parentElement
      rangeObj1.setEndPoint('EndToEnd', rangeCopy1); //Set end point to the first character of the 'real' selection
      rangeObj2.moveToElementText(parentElement2);
      rangeObj2.setEndPoint('EndToEnd', rangeCopy2); //Set end point to the last character of the 'real' selection
  
      var text1 = rangeObj1.text; //Now we get all text from parentElement's first character upto the real selection's first character
      var text2 = rangeObj2.text; //Here we get all text from parentElement's first character upto the real selection's last character
  
      var nodeInfo1 = _findTextNode(parentElement1, text1);
      var nodeInfo2 = _findTextNode(parentElement2, text2);
  
      //Finally we are here
      range.startContainer = nodeInfo1.node;
      range.startOffset = nodeInfo1.offset;
      range.endContainer = nodeInfo2.node;
      range.endOffset = nodeInfo2.offset + 1; //End offset comes 1 position after the last character of selection.
    }
    return range;
}

function getRangeObject(win) { //Gets the first range object
    win = win || window;
    if (win.getSelection) { // Firefox/Chrome/Safari/Opera/IE9
      try {
        return win.getSelection().getRangeAt(0); //W3C DOM Range Object
      } catch (e) { /*If no text is selected an exception might be thrown*/ }
    } else if (win.document.selection) { // IE8
      var range = win.document.selection.createRange(); //Microsoft TextRange Object
      return fixIERangeObject(range, win);
    }
    return null;
}

document.onmouseup = document.onkeyup = document.onkeydown = document.onselectionchange = function() {
    // document.getElementById("pte-text-input").value = getSelectionText();
    
    let pte = document.getElementById("pte-text-input");
    // if (pte.classList.contains("focused")) {
    //     var range = getRangeObject();
    //     if (range) {
    //         console.log( range );
    //         console.log( range.startContainer.nodeValue );
    //         console.log( range.startOffset );
    //         console.log( range.endOffset );
    //     } else {
    //         console.log( 'Ничего не выделено' );
    //     }
    //     console.log(getSelectionText());
    // }

    // fix first string withoud container:
    if (!pte.innerHTML || pte.innerHTML.indexOf("<div>") == -1) {
      pte.innerHTML = "<div><br></div>"
    }
};