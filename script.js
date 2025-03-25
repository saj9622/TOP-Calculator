// Get DOM elements
const display = document.getElementById('display');
const resultDisplay = document.getElementById('result');
const digitButtons = document.querySelectorAll('.digit');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('.clear');
const backspaceButton = document.querySelector('.backspace');
const decimalButton = document.querySelector('.decimal');
const equalsButton = document.getElementById('equals');

// State variables
let currentExpression = '';         
let currentNumber = '';             
const digitLength = 15;             

// Math Functions
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => b === 0 ? "Error" : a / b,
};

// Evaluate math expressions safely
function evaluateExpression(expr) {
    try {
        const sanitizedExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');
        const result = new Function(`return ${sanitizedExpr}`)();
        if (isNaN(result) || result === Infinity) return "Error";
        return result.toString().length > 12 ? result.toExponential(5) : result;
    } catch {
        return "Error";
    }
}

// Update main display
function updateDisplay() {
    display.textContent = currentExpression || '';
}

// Dynamically show result
function displayResult() {
    const result = evaluateExpression(currentExpression);
    resultDisplay.textContent = result !== "Error" ? result : '';
}

// Handle number input
function handleDigitInput(digit) {
    if (currentNumber.length < digitLength) {
        currentNumber += digit;
        currentExpression += digit;
        updateDisplay();
        displayResult();
    }
}

// Handle operator input
function handleOperatorInput(operator) {
    if (currentNumber === '' && currentExpression !== '') {
        currentExpression = currentExpression.slice(0, -1) + operator;
    } else if (currentNumber !== '') {
        currentExpression += operator;
        currentNumber = '';
    }
    updateDisplay();
}

// Handle decimal input
function handleDecimalInput() {
    if (!currentNumber.includes('.')) {
        currentNumber += '.';
        currentExpression += '.';
        updateDisplay();
    }
}

// Handle backspace
function handleBackspace() {
    if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
        currentNumber = currentNumber.slice(0, -1);
        updateDisplay();
        displayResult();
    }
}

// Handle clear
function handleClear() {
    currentExpression = '';
    currentNumber = '';
    updateDisplay();
    resultDisplay.textContent = '';
}

// Handle equals
function handleEquals() {
    const result = evaluateExpression(currentExpression);
    if (result !== "Error") {
        currentExpression = result.toString();
        currentNumber = currentExpression;
        updateDisplay();
        resultDisplay.textContent = '';
    }
}

// Event listeners for buttons
digitButtons.forEach(btn => btn.addEventListener('click', () => handleDigitInput(btn.textContent)));
operatorButtons.forEach(btn => btn.addEventListener('click', () => handleOperatorInput(btn.textContent)));
decimalButton.addEventListener('click', handleDecimalInput);
backspaceButton.addEventListener('click', handleBackspace);
clearButton.addEventListener('click', handleClear);
equalsButton.addEventListener('click', handleEquals);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) return; // Skip ctrl commands
    const { key } = e;
    if (/\d/.test(key)) handleDigitInput(key);
    else if (key === '.') handleDecimalInput();
    else if (key === 'Backspace') handleBackspace();
    else if ((key === 'Escape' || key.toLowerCase() === 'c') && !e.ctrlKey) handleClear();
    else if (['+', '-', '*', '/'].includes(key)) {
        const operator = key === '*' ? '×' : key === '/' ? '÷' : key;
        handleOperatorInput(operator);
    }
});

// Copy current expression to clipboard
display.addEventListener('copy', (e) => {
    e.clipboardData.setData('text/plain', currentExpression);
    e.preventDefault();
});
