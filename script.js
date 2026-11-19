
const passwordInput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const strength = document.getElementById("strength");
const message = document.getElementById("message");

const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}";

lengthInput.addEventListener("input", function () {
    lengthValue.textContent = lengthInput.value;
});

function secureRandom(max) {
    const values = new Uint32Array(1);
    const limit = Math.floor(4294967296 / max) * max;

    do {
        crypto.getRandomValues(values);
    } while (values[0] >= limit);

    return values[0] % max;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function generatePassword() {

    let characters = "";
    let selectedGroups = [];

    if (uppercase.checked) {
        characters += upperChars;
        selectedGroups.push(upperChars);
    }

    if (lowercase.checked) {
        characters += lowerChars;
        selectedGroups.push(lowerChars);
    }

    if (numbers.checked) {
        characters += numberChars;
        selectedGroups.push(numberChars);
    }

    if (symbols.checked) {
        characters += symbolChars;
        selectedGroups.push(symbolChars);
    }

    if (selectedGroups.length === 0) {
        passwordInput.value = "";
        strength.textContent = "Not Available";
        message.textContent = "Please select at least one option!";
        return;
    }

    const length = Number(lengthInput.value);
    let password = [];

    // Ensure at least one character from each selected group
    selectedGroups.forEach(function (group) {
        password.push(group[secureRandom(group.length)]);
    });

    // Fill remaining positions
    while (password.length < length) {
        password.push(characters[secureRandom(characters.length)]);
    }

    shuffleArray(password);

    passwordInput.value = password.join("");

    checkStrength(selectedGroups.length, length);

    message.textContent = "Password generated successfully!";
}

function checkStrength(groupCount, length) {

    if (length >= 16 && groupCount >= 3) {
        strength.textContent = "Strong";
        strength.style.color = "green";
    }
    else if (length >= 10 && groupCount >= 2) {
        strength.textContent = "Medium";
        strength.style.color = "orange";
    }
    else {
        strength.textContent = "Weak";
        strength.style.color = "red";
    }
}

async function copyPassword() {

    if (passwordInput.value === "") {
        message.textContent = "Generate a password first!";
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordInput.value);
        message.textContent = "Password copied successfully!";
    }
    catch (error) {
        message.textContent = "Copy failed. Please copy manually.";
    }
}

generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);
