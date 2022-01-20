const keyboard = new JSFuckKeyboard();

for(let inputElm of document.querySelectorAll("input")){
    inputElm.addEventListener("focus", function(){keyboard.attachInput(this)});
    inputElm.addEventListener("blur", _ => keyboard.detachInput());
}

// keyboard.attachInput(document.querySelector("#textField"));



const cursor = document.querySelector("#cursor");
function moveCursor(pos) {
    cursor.style.left = pos.x + "px";
    cursor.style.top = pos.y + "px";
}
function getCursorPos() {
    return new Vector(
        +cursor.style.left.replace(/[^.0-9]/g, ""),
        +cursor.style.top.replace(/[^.0-9]/g, "")
    )
}
function getBtnPos(btnId) {
    let btn = keyboard.buttons[btnId];
    let btnRect = btn.getBoundingClientRect();
    return new Vector(
        (btnRect.left + btnRect.right) / 2 + window.scrollX,
        (btnRect.top + btnRect.bottom) / 2 + window.scrollY
    )
}
class Vector {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    magnitude(){
        return Math.sqrt(this.x**2 + this.y**2);
    }
    add(addend) {
        return new Vector(this.x + addend.x, this.y + addend.y);
    }
    sub(subtrahend) {
        return new Vector(this.x - subtrahend.x, this.y - subtrahend.y);
    }
    scale(scaler) {
        return new Vector(this.x * scaler, this.y * scaler);
    }
    normalize(scaler = 1) {
        return this.scale(scaler / this.magnitude());
    }
}

function* generateAnimation(btnList, speed) {
    for(const targetBtn of btnList) {
        let randomOffset = (new Vector(Math.random() - .5, Math.random() - .5)).scale(25);
        let btnPos = getBtnPos(targetBtn).add(randomOffset); 
        let reachedBtn = false; 
        while(!reachedBtn){
            let cursorPos = getCursorPos();
            let movement = btnPos.sub(cursorPos);
            reachedBtn = movement.magnitude() <= speed; 
            if(!reachedBtn) {
                movement = movement.normalize(speed);
            }
            
            yield {
                nextPos: cursorPos.add(movement),
                reachedBtn: reachedBtn, 
                targetBtn: targetBtn
            }
        }
    }
}
function animate(btnList, speed ){
    document.body.parentElement.style.cursor = "none";
    cursor.style.display="";

    let animation = generateAnimation(btnList, speed);
    let pressedBtn = null;

    function frame(){
        let frameData = animation.next();
        if(pressedBtn != null){
            pressedBtn.classList.remove("active");
            pressedBtn = null;
        }
        if(!frameData.done){
            moveCursor(frameData.value.nextPos);
            if(frameData.value.reachedBtn){
                keyboard.clickBtn(frameData.value.targetBtn);
                pressedBtn = keyboard.buttons[frameData.value.targetBtn];
                pressedBtn.classList.add("active");
            }
            requestAnimationFrame(frame);
        }else{
            document.body.parentElement.style.cursor = "";
            cursor.style.display="none";
        }
    }
    
    requestAnimationFrame(frame);
    

}
moveCursor({x:0, y:0});

function consoleWelcomeMessage(){
    const CODE = "font-family: 'Courier New', monospace; ";
console.log(`%cWelcome to the JSFuck Keyboard demo
%cThanks for checking out my dumb little project.

Some useful commands:`, "font-size:25px","");
console.log(`%ckeyboard.attachInput(textInput)
    textInput%c - The HTML input element to attach the keyboard to 
Forcefully open and attach the keyboard to a HTML text input. Example: 
%ckeyboard.attachInput(document.querySelector("#textField")); //Attach the keyboard to the first text input`, CODE, "", CODE);
console.log(`%canimate(buttonStr, speed)
    buttonStr%c - A string containing a list of buttons to be preesed. Use "e" and "c" to represent enter and clear respectively.
    %cspeed%c - The speed in pixels per frame for the cursor to move at
Automatically type a given sequence of buttons. Example: 
%canimate("(!![]+[])[+!+[]]e", 30) //Type the letter "r"`,CODE, "", CODE, "", CODE);
}
consoleWelcomeMessage();

