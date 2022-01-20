const keyboardTemplate = document.createElement('template');
keyboardTemplate.innerHTML = `
<style>
.keyboard {
    width: 450px;
    position: absolute;
    /* background-color: rgb(61, 61, 61); */
    background-color: rgb(88, 88, 88);
    color: white;
    border-radius: 5px;
    padding:5px;
}
.preview {
    word-break: break-all;
    width: 100%;
    font-size: .8em;
    padding: 0px 4px;
}
.preview::before { content: '\\200B'; } /*inserts a zero-width space to make the preview always at least 1 line tall*/

.key-row {
    display: inline-flex;
    width:100%;
    flex-wrap: nowrap;
    margin-top: 3px;
    gap: 3px;
}
#keys>* { 
    height:40px;
    font-size: 20px;
}
.key-row>* {
    width:100%;
}
button {
    background-color: rgb(150, 150, 150);
    border: none;
    color:white;
    border-radius: 2px;
}
button:active, button.active {
    filter: brightness(75%);
}
.clear {
    background-color: brown;
}
.enter {
    background-color: rgb(78 68 145);
}
</style>
<div class="keyboard" id="keyboard" style="display:none">
    <div class="preview" id="preview"></div>
    <div class="key-row" id="keys">
        <button data-btnid="(" tabindex="-1">(</button>
        <button data-btnid=")" tabindex="-1">)</button>
        <button data-btnid="[" tabindex="-1">[</button>
        <button data-btnid="]" tabindex="-1">]</button>
        <button data-btnid="+" tabindex="-1">+</button>
        <button data-btnid="!" tabindex="-1">!</button>
    </div>
    <div class="key-row">
        <button class="clear" id="clear" data-btnid="c" tabindex="-1">Clear</button>
        <button class="enter" id="enter" data-btnid="e" tabindex="-1">Enter</button>
    </div>
</div>
`;

class JSFuckKeyboard {
    constructor(){
        this._currentInput = "";
        this.attachedInput = null; 

        this.container = document.createElement("div");
        this.container.id = "container";
        document.body.appendChild(this.container);
        this.container.attachShadow({mode: 'open'});
        this.shadowRoot = this.container.shadowRoot;
        this.shadowRoot.appendChild(keyboardTemplate.content.cloneNode(true));

        this.elements = {};
        this.buttons = {};
        for(let element of this.shadowRoot.querySelectorAll("[id]")){
            this.elements[element.id] = element; 
        }
        for(let btn of this.shadowRoot.querySelectorAll("button")){
            btn.addEventListener("click", ({target}) => this.clickBtn(target.dataset.btnid));
            this.buttons[btn.dataset.btnid] = btn;
        }
        
        this.elements.keyboard.addEventListener("mousedown", event => event.preventDefault());

    }
    get currentInput() {return this._currentInput;}
    set currentInput(val) {
        this.elements.preview.innerText = val;
        this._currentInput = val;
        return val;
    }
    
    attachInput(input) {
        this.attachedInput = input;
        let inputRect = input.getBoundingClientRect();
        this.elements.keyboard.style.top = inputRect.bottom + window.scrollY + 3 + "px";
        this.elements.keyboard.style.left = inputRect.left + window.scrollX + "px";
        this.elements.keyboard.style.display = "";
    }
    detachInput() {
        this.attachedInput = null;
        this.elements.keyboard.style.display = "none";
    }

    clickBtn(btnId) {
        if(btnId == "e"){
            this.enter();
        } else if(btnId == "c"){
            this.clear();
        } else if(btnId != undefined){
            this.currentInput += btnId;
        }
    }
    clear(){
        this.currentInput = "";
    }
    enter(){
        try {
            let result = eval(this.currentInput);
            let firstChar = (result + "")[0] ?? "";
            this.attachedInput.value += firstChar;
            //console.log(result, firstChar, this.currentInput);
        } catch(e) {
            console.log(e);
        }
        this.clear();
    }
}



