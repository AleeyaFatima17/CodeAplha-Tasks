
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let waitingForOperand = false;
let expressionText = "";
let justCalculated = false;

function updateDisplay() {
    resultDisplay.value = currentInput;
    expressionDisplay.textContent = expressionText;
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}

function inputNumber(number) {
    if (currentInput === "Error" || waitingForOperand || justCalculated) {
        currentInput = number;
        waitingForOperand = false;
        justCalculated = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    expressionText = "";
    updateDisplay();
}

function inputDecimal() {
    if (currentInput === "Error" || waitingForOperand || justCalculated) {
        currentInput = "0.";
        waitingForOperand = false;
        justCalculated = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    expressionText = "";
    updateDisplay();
}

function calculate(a, operator, b) {
    switch (operator) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? NaN : a / b;
        default: return b;
    }
}

function chooseOperator(operator) {
    if (currentInput === "Error") {
        clearCalculator();
    }

    const inputValue = Number(currentInput);

    if (pendingOperator && !waitingForOperand) {
        const calculated = calculate(storedValue, pendingOperator, inputValue);

        currentInput = formatNumber(calculated);

        if (currentInput === "Error") {
            updateDisplay();
            clearCalculator();
            currentInput = "Error";
            updateDisplay();
            return;
        }

        storedValue = Number(currentInput);
    } else {
        storedValue = inputValue;
    }

    pendingOperator = operator;
    expressionText = `${currentInput} ${operatorSymbol(operator)}`;
    waitingForOperand = true;
    justCalculated = false;
    updateDisplay();
}

function operatorSymbol(operator) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[operator];
}

function showResult() {
    if (!pendingOperator || storedValue === null) {
        return;
    }

    const firstValue = storedValue;
    const secondValue = Number(currentInput);
    const operator = pendingOperator;
    const answer = calculate(firstValue, operator, secondValue);

    expressionText =
        `${formatNumber(firstValue)} ${operatorSymbol(operator)} ${formatNumber(secondValue)} =`;

    currentInput = formatNumber(answer);
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    justCalculated = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = false;
    expressionText = "";
    justCalculated = false;
    updateDisplay();
}

function deleteDigit() {
    if (currentInput === "Error" || waitingForOperand || justCalculated) {
        currentInput = "0";
        waitingForOperand = false;
        justCalculated = false;
    } else if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "-") {
            currentInput = "0";
        }
    } else {
        currentInput = "0";
    }

    expressionText = "";
    updateDisplay();
}

function toggleSign() {
    if (currentInput === "Error" || Number(currentInput) === 0) {
        return;
    }

    currentInput = currentInput.startsWith("-")
        ? currentInput.slice(1)
        : "-" + currentInput;

    updateDisplay();
}

function percentage() {
    if (currentInput === "Error") {
        return;
    }

    currentInput = formatNumber(Number(currentInput) / 100);
    expressionText = "";
    updateDisplay();
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteDigit();
            break;
        case "decimal":
            inputDecimal();
            break;
        case "equals":
            showResult();
            break;
        case "sign":
            toggleSign();
            break;
        case "percent":
            percentage();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    if (/^[0-9]$/.test(event.key)) {
        inputNumber(event.key);
    } else if (event.key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        showResult();
    } else if (event.key === "Backspace") {
        deleteDigit();
    } else if (event.key === "Escape") {
        clearCalculator();
    } else if (event.key === "%") {
        percentage();
    }
});

updateDisplay();
