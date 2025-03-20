const display = document.getElementById("display");
const numButtons = document.querySelectorAll(".num");
const opButtons = document.querySelectorAll(".op");
const clearButton = document.querySelector(".clear");
const equalButton = document.querySelector(".equal");

let currentValue = "";
let previousValue = "";
let operator = null;
let lastOperator = null;
let repeatValue = "";

numButtons.forEach(button => {
    button.addEventListener("click", () => handleNumber(button.textContent));
});

opButtons.forEach(button => {
    button.addEventListener("click", () => handleOperator(button.textContent));
});

equalButton.addEventListener("click", () => handleEqual());
clearButton.addEventListener("click", () => clearCalculator());

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (!isNaN(key) || key === ".") {
        handleNumber(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        handleOperator(key);
    } else if (key === "Enter") {
        handleEqual();
    } else if (key === "Escape" || key === "c") {
        clearCalculator();
    } else if (key === "Backspace") {
        handleBackspace();
    }
});

display.addEventListener("click", () => {
    display.focus();
});

display.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.key === "Backspace") {
        handleBackspace();
    }
});

function handleNumber(num) {
    if (operator && previousValue === "") {
        previousValue = currentValue;
        currentValue = "";
    }
    currentValue += num;
    display.value = currentValue;
    highlightOperator(null);
}

function handleOperator(op) {
    if (currentValue === "" && previousValue === "") return;

    if (previousValue !== "" && currentValue !== "") {
        calculate();
    }

    operator = op === "*" ? "x" : op === "/" ? "/" : op;
    highlightOperator(document.querySelector(`.op:contains('${operator}')`));
}

function handleEqual() {
    if (!operator && lastOperator) {
        operator = lastOperator;
        currentValue = repeatValue;
    }

    if (previousValue !== "" && currentValue !== "") {
        calculate();
        lastOperator = operator;
        repeatValue = currentValue;
    }
}

function handleBackspace() {
    currentValue = currentValue.slice(0, -1);
    display.value = currentValue;
}

function clearCalculator() {
    currentValue = "";
    previousValue = "";
    operator = null;
    lastOperator = null;
    repeatValue = "";
    display.value = "";
    highlightOperator(null);
}

function calculate() {
    let num1 = parseFloat(previousValue);
    let num2 = parseFloat(currentValue);

    if (isNaN(num1) || isNaN(num2)) return;

    switch (operator) {
        case "+":
            currentValue = (num1 + num2).toString();
            break;
        case "-":
            currentValue = (num1 - num2).toString();
            break;
        case "x":
            currentValue = (num1 * num2).toString();
            break;
        case "/":
            currentValue = num2 !== 0 ? (num1 / num2).toString() : "Error";
            break;
    }

    display.value = currentValue;
    previousValue = currentValue;
    currentValue = "";
    operator = null;
}

function highlightOperator(activeButton) {
    opButtons.forEach(button => button.classList.remove("active"));
    if (activeButton) activeButton.classList.add("active");
}
