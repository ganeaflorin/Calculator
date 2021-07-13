let expression = "";
addButtonsEventListeners();
addKeyboardSuport();

function evaluateExp(expression) {
    let valueArray = [];
    let operatorArray = [];
    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if (isNumber(char)) {
            i = handleMultipleCharacterOperand(valueArray, char, i);
        }
        if (isLeftParan(char))
            operatorArray.push(char);
        if (isRightParan(char)) {
            while (!isLeftParan((operator = operatorArray.pop())) && operatorArray.length > 0) {
                valueArray.push(partialEvaluation(operator, valueArray.pop(), valueArray.pop()));
            }
        }
        if (isOperator(char)) {
            //treating negative operands (-7 + 5)
            if (i == 0 || !isNumber(expression[i - 1])) {
                i = handleMultipleCharacterOperand(valueArray, char, i);

            } else {
                while (operatorArray.length && getPriority(char) < getPriority(operatorArray[operatorArray.length - 1])) {
                    valueArray.push(partialEvaluation(operatorArray.pop(), valueArray.pop(), valueArray.pop()));
                }
                operatorArray.push(char);
            }
        }
    }
    while (operatorArray.length) {
        valueArray.push(partialEvaluation(operatorArray.pop(), valueArray.pop(), valueArray.pop()));
    }
    //treating divide by 0 case
    if (valueArray[0] == Number.POSITIVE_INFINITY || valueArray[0] == Number.NEGATIVE_INFINITY) {
        return null;
    }
    return valueArray[0];
}

function handleMultipleCharacterOperand(valueArray, char, index) {
    let operandValue = char;
    for (let j = index + 1; j < expression.length; j++, index++) {
        let numberChar = expression[j];
        if (isLeftParan(numberChar) || isRightParan(numberChar) || isOperator(numberChar)) {
            break;
        }
        operandValue += numberChar;
    }
    valueArray.push(+operandValue);
    return index;
}

function getPriority(char) {
    if (char === '+' || char === '-')
        return 1;
    if (char === '*' || char === '/')
        return 2;
    if (char === "%")
        return 3;
}

function isNumber(char) {
    if (char === "0") return true;
    return (+char) ? true : false;
}

function isLeftParan(char) {
    return (char === "(") ? true : false;
}

function isRightParan(char) {
    return (char === ")") ? true : false;
}

function isOperator(char) {
    return ["+", "-", "*", "/", "%"].includes(char);

}

function partialEvaluation(operator, secondValue, firstValue) {
    switch (operator) {
        case "+":
            return firstValue + secondValue;
        case "-":
            return firstValue - secondValue;
        case "*":
            return firstValue * secondValue;
        case "/":
            return firstValue / secondValue;
        case "%":
            return firstValue % secondValue;
        default:
            return 0;
    }
}

function addButtonsEventListeners() {
    handleUndoBtn();
    let btns = Array.from(document.querySelectorAll(".btn-container button"));
    btns.forEach(button => {
        if (button.value === "clear")
            handleClearBtn(button);
        else if (button.value === "equal")
            button.addEventListener("click", showResult);
        else button.addEventListener("click", () => {
            expression += button.value;
            showExpression();
            showPartialResult();
        });
    });
}

function showExpression() {
    let display = document.querySelector(".display__expression");
    display.textContent = expression;
}

function showPartialResult() {
    let display = document.querySelector(".display__partial-result");
    if (evaluateExp(expression) || evaluateExp(expression) === 0)
        display.textContent = evaluateExp(expression);
    else display.textContent = "";
}

function showResult() {

    if (evaluateExp(expression) || evaluateExp(expression) === 0) {
        expression = evaluateExp(expression);
        showExpression();
    } else if (expression.length > 0) {
        showWrongResultWarning();
    }
    showPartialResult();
}

function showWrongResultWarning() {
    let display = document.querySelector(".display__expression");
    display.textContent = "BAD EXPRESSION";
}

function handleUndoBtn() {
    let undoBtn = document.querySelector("#clear-last");
    undoBtn.addEventListener("click", () => {
        expression = expression.slice(0, expression.length - 1);
        showExpression();
        showPartialResult();
    });
}

function handleClearBtn(button) {
    button.addEventListener("click", () => {
        expression = "";
        showExpression();
        showPartialResult();
    });
}

function addKeyboardSuport() {
    document.addEventListener("keydown", function(e) {
        let expressionSymbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "+", "/", "*", "%", ".", "(", ")"];
        let key = e.key;
        if (expressionSymbols.includes(key)) {
            expression += key;
            showExpression();
            showPartialResult();
        } else if (key === "Enter")
            showResult();
        else if (key === "Backspace") {
            expression = expression.slice(0, expression.length - 1);
            showExpression();
            showPartialResult();
        } else if (key.toLowerCase() === "c") {
            expression = "";
            showExpression();
            showPartialResult();
        }
    });
}

/*
bug: -5-5-2
*/