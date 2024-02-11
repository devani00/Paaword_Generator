const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#lowerCase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type='checkbox']");

const symbols = '~`!@#$%^&*()_+-={}[]|:";<>,.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

//set strength color to gray
setIndicator("#ccc");

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

     const min=inputSlider.min;
     const max = inputSlider.max;

     inputSlider.style.backgroundSize=((passwordLength - min ) * 100/(max-min) ) + "% 100%";
}
 
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=`0px 0px 12px 1px $(color)`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    //character at in symbol string at index randNum
    return symbols.charAt(randNum);
    //you cant write instead
    //return symbols[randNum]
}

//set color of strength bar based on password strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#FF0000");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#FFFF00");
    }
    else {
        setIndicator("#008000");
    }

}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    })

    //special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})



function shufflePassword(array){
    //Fisher Yates  Methode
    for(let i = array.length-1;i>0;i--){
        const  j=Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str ="";
    array.forEach((el)=>(str += el));
    return str;
} 

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selcted 
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    //let's start the new password
    //remove old passsword

    password = "";
    //let's put the stuff mentioned by checkbox
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsary addition
    for(let i=0;i<checkCount;i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0; i < passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();

})