const showPassword = document.querySelector('#show-password');
const copyPassword = document.querySelector('#copy-password');
const copyMessage = document.querySelector('.copy-message');

// Handle Slider Control and Display Password Length 
const passwordLengthDisplay = document.querySelector('.password-length');
const passwordLengthSlider = document.querySelector('.password-length-slider');

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const passwordStrength = document.querySelector('#password-strength');
const generatePassword = document.querySelector('.generate-password');

const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '~`!@#456789)_-+={}[];:"<>,.?/';

// Initially
let password = '';
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle to color gray
setIndicator("#ccc");


function handleSlider() {
    passwordLengthSlider.value = passwordLength;
    passwordLengthDisplay.innerHTML = passwordLength;
    // Or kuch bhi karna hsi Kya - HW
    const min = passwordLengthSlider.min;
    const max = passwordLengthSlider.max;
    passwordLengthSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    passwordStrength.style.backgroundColor = color;
    passwordStrength.style.boxShadow = "0px 0px 12px 1px" + color;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateNumber() {
    return getRandomInteger(0, 9);
}

function generateSymbols() {
    const randomNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNumber);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition to insert password
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

function   shufflePassword(password) {
    // Fisher Yates Method
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random()) * (i + 1);
        const temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }

    let str = "";
    password.forEach((el) => (str += el));
    return str;
}

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
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(showPassword.value);
        copyMessage.innerText = 'Copied';
    } 
    catch (e) {
        copyMessage.innerText = 'Failed';
    }
    copyMessage.classList.add('active');

    setTimeout(() => {
        copyMessage.classList.remove('active');
    }, 2000);
}

passwordLengthSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyPassword.addEventListener('click', () => {
    if (showPassword.value)
        copyContent();
});

generatePassword.addEventListener('click', () => {
    // check passwordLength and checkCount
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Journey to generate password

    // Remove Previous Password
    password = '';

    // put stuff mentioned in checkboxes

    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if (numbersCheck.checked) {
    //     password += generateNumber();
    // }

    // if (symbolsCheck.checked) {
    //     password += generateSymbols();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);    
    }

    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }

    if (numbersCheck.checked) {
        funcArr.push(generateNumber);
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbols);
    }

    // compulsory Addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }
    
    // Shuffle the generated password
    password = shufflePassword(Array.from(password));
    console.log(password);

    // put on UI
    showPassword.value = password;

    // Calculate the Password Strength
    calcStrength();
});