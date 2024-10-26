// Get references to HTML elements
const algorithmSelect = document.getElementById("algorithm");
const messageInput = document.getElementById("message");
const keyInput = document.getElementById("key");
const resultTextarea = document.getElementById("result");
const encryptButton = document.getElementById("encryptButton");
const decryptButton = document.getElementById("decryptButton");
const resetButton = document.getElementById("resetButton");

// Caesar Cipher Encryption
function caesarCipherEncrypt(message, key) {
    let result = "";
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        if (char.match(/[a-zA-Z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const offset = isUpperCase ? 65 : 97;
            const shiftedChar = String.fromCharCode(
                ((char.charCodeAt(0) - offset + key) % 26) + offset
            );
            result += shiftedChar;
        } else {
            result += char;
        }
    }
    return result;
}

// Caesar Cipher Decryption
function caesarCipherDecrypt(message, key) {
    return caesarCipherEncrypt(message, 26 - key);
}

// Vigenère Cipher Encryption
function vigenereCipherEncrypt(message, key) {
    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < message.length; i++) {
        const char = message[i];

        if (char.match(/[a-zA-Z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const offset = isUpperCase ? 65 : 97;
            const shift = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
            const shiftedChar = String.fromCharCode(
                ((char.charCodeAt(0) - offset + shift) % 26) + offset
            );
            result += shiftedChar;
            keyIndex++;
        } else {
            result += char;
        }
    }

    return result;
}

// Vigenère Cipher Decryption
function vigenereCipherDecrypt(message, key) {
    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < message.length; i++) {
        const char = message[i];

        if (char.match(/[a-zA-Z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const offset = isUpperCase ? 65 : 97;
            const shift = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
            const shiftedChar = String.fromCharCode(
                ((char.charCodeAt(0) - offset - shift + 26) % 26) + offset
            );
            result += shiftedChar;
            keyIndex++;
        } else {
            result += char;
        }
    }

    return result;
}

// Playfair Cipher Encryption
// Playfair Cipher Encryption
function playfairCipherEncrypt(message, key) {
    message = message.toUpperCase().replace(/[^A-Z]/g, ""); // Convert to uppercase and remove non-alphabet characters
    key = key.toUpperCase().replace(/[^A-Z]/g, ""); // Convert to uppercase and remove non-alphabet characters

    // Build the Playfair matrix from the key
    const matrix = buildPlayfairMatrix(key);

    let encryptedMessage = "";
    let i = 0;

    while (i < message.length) {
        let char1 = message[i];
        let char2 = "";

        if (i + 1 < message.length) {
            char2 = message[i + 1];
        } else {
            char2 = "X"; // Add a padding 'X' if the message length is odd
        }

        if (char1 === char2) {
            char2 = "X"; // Replace repeating characters with 'X'
            i--;
        }

        const [row1, col1] = findCharPosition(matrix, char1);
        const [row2, col2] = findCharPosition(matrix, char2);

        let encryptedChar1 = "";
        let encryptedChar2 = "";

        if (row1 === row2) {
            // Characters are in the same row
            encryptedChar1 = matrix[row1][(col1 + 1) % 5];
            encryptedChar2 = matrix[row2][(col2 + 1) % 5];
        } else if (col1 === col2) {
            // Characters are in the same column
            encryptedChar1 = matrix[(row1 + 1) % 5][col1];
            encryptedChar2 = matrix[(row2 + 1) % 5][col2];
        } else {
            // Characters form a rectangle
            encryptedChar1 = matrix[row1][col2];
            encryptedChar2 = matrix[row2][col1];
        }

        encryptedMessage += encryptedChar1 + encryptedChar2;
        i += 2;
    }

    return encryptedMessage;
}

// Playfair Cipher Decryption
function playfairCipherDecrypt(message, key) {
    message = message.toUpperCase().replace(/[^A-Z]/g, ""); // Convert to uppercase and remove non-alphabet characters
    key = key.toUpperCase().replace(/[^A-Z]/g, ""); // Convert to uppercase and remove non-alphabet characters

    // Build the Playfair matrix from the key
    const matrix = buildPlayfairMatrix(key);

    let decryptedMessage = "";

    for (let i = 0; i < message.length; i += 2) {
        const char1 = message[i];
        const char2 = message[i + 1];

        const [row1, col1] = findCharPosition(matrix, char1);
        const [row2, col2] = findCharPosition(matrix, char2);

        let decryptedChar1 = "";
        let decryptedChar2 = "";

        if (row1 === row2) {
            // Characters are in the same row
            decryptedChar1 = matrix[row1][(col1 - 1 + 5) % 5];
            decryptedChar2 = matrix[row2][(col2 - 1 + 5) % 5];
        } else if (col1 === col2) {
            // Characters are in the same column
            decryptedChar1 = matrix[(row1 - 1 + 5) % 5][col1];
            decryptedChar2 = matrix[(row2 - 1 + 5) % 5][col2];
        } else {
            // Characters form a rectangle
            decryptedChar1 = matrix[row1][col2];
            decryptedChar2 = matrix[row2][col1];
        }

        decryptedMessage += decryptedChar1 + decryptedChar2;
    }

    return decryptedMessage;
}

// Helper function to build the Playfair matrix
function buildPlayfairMatrix(key) {
    const matrix = Array(5)
        .fill()
        .map(() => Array(5).fill(""));

    let row = 0;
    let col = 0;

    for (let i = 0; i < key.length; i++) {
        const char = key[i];
        if (!matrix[row][col] && char !== "J") {
            matrix[row][col] = char;
            col++;
            if (col === 5) {
                col = 0;
                row++;
            }
        }
    }

    // Fill in the remaining characters (excluding 'J' and duplicates)
    for (let c = "A".charCodeAt(0); c <= "Z".charCodeAt(0); c++) {
        const char = String.fromCharCode(c);
        if (char !== "J" && key.indexOf(char) === -1) {
            if (!matrix[row][col]) {
                matrix[row][col] = char;
                col++;
                if (col === 5) {
                    col = 0;
                    row++;
                }
            }
        }
    }

    return matrix;
}

// Helper function to find the position of a character in the Playfair matrix
function findCharPosition(matrix, char) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (matrix[row][col] === char) {
                return [row, col];
            }
        }
    }
    return [-1, -1];
}

// Rail Fence Cipher Encryption
// Rail Fence Cipher Encryption
function railFenceCipherEncrypt(message, rails) {
    if (rails <= 1) {
        return message; // No encryption needed for 1 rail
    }

    const messageLength = message.length;
    const fence = new Array(rails).fill([]);

    for (let i = 0; i < rails; i++) {
        fence[i] = [];
    }

    let rail = 0;
    let direction = 1;

    for (let i = 0; i < messageLength; i++) {
        fence[rail].push(message[i]);

        if (rail === 0) {
            direction = 1;
        } else if (rail === rails - 1) {
            direction = -1;
        }

        rail += direction;
    }

    let encryptedMessage = "";
    for (let i = 0; i < rails; i++) {
        encryptedMessage += fence[i].join("");
    }

    return encryptedMessage;
}

// Rail Fence Cipher Decryption
function railFenceCipherDecrypt(encryptedMessage, rails) {
    if (rails <= 1) {
        return encryptedMessage;
    }

    const messageLength = encryptedMessage.length;
    const fence = new Array(rails).fill([]);

    for (let i = 0; i < rails; i++) {
        fence[i] = [];
    }

    const railPattern = [];
    let rail = 0;
    let direction = 1;

    for (let i = 0; i < messageLength; i++) {
        railPattern.push(rail);

        if (rail === 0) {
            direction = 1;
        } else if (rail === rails - 1) {
            direction = -1;
        }

        rail += direction;
    }

    let messageIndex = 0;
    for (let r = 0; r < rails; r++) {
        for (let i = 0; i < messageLength; i++) {
            if (railPattern[i] === r) {
                fence[r].push(encryptedMessage[messageIndex++]);
            }
        }
    }

    let decryptedMessage = "";
    rail = 0;
    direction = 1;

    for (let i = 0; i < messageLength; i++) {
        decryptedMessage += fence[rail].shift();

        if (rail === 0) {
            direction = 1;
        } else if (rail === rails - 1) {
            direction = -1;
        }

        rail += direction;
    }

    return decryptedMessage;
}

// Event listener for encryption button
// Event listener for encryption button
encryptButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const selectedAlgorithm = algorithmSelect.value;
    const message = messageInput.value;
    const key = keyInput.value;
    let result = "";

    switch (selectedAlgorithm) {
        case "caesar":
            result = caesarCipherEncrypt(message, parseInt(key, 10));
            break;
        case "vigenere":
            result = vigenereCipherEncrypt(message, key);
            break;
        case "playfair":
            if (key.length === 0) {
                result = "Please enter a key for the Playfair Cipher.";
            } else {
                result = playfairCipherEncrypt(message, key);
            }
            break;
        case "railfence":
            const rails = parseInt(key, 10);
            result = railFenceCipherEncrypt(message, rails);
            break;
        default:
            result = "Invalid algorithm selection.";
            break;
    }

    resultTextarea.value = result;
});

// Event listener for decryption button
// Event listener for decryption button
decryptButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const selectedAlgorithm = algorithmSelect.value;
    const message = messageInput.value;
    const key = keyInput.value;
    let result = "";

    switch (selectedAlgorithm) {
        case "caesar":
            result = caesarCipherDecrypt(message, parseInt(key, 10));
            break;
        case "vigenere":
            result = vigenereCipherDecrypt(message, key);
            break;
        case "playfair":
            if (key.length === 0) {
                result = "Please enter a key for the Playfair Cipher.";
            } else {
                result = playfairCipherDecrypt(message, key);
            }
            break;
        case "railfence":
            const rails = parseInt(key, 10);
            result = railFenceCipherDecrypt(message, rails);
            break;
        default:
            result = "Invalid algorithm selection.";
            break;
    }

    resultTextarea.value = result;
});

// ... Your existing code ...

// Event listener for reset button
resetButton.addEventListener("click", () => {
    messageInput.value = "";
    keyInput.value = "";
    resultTextarea.value = "";
});