// let a = "1 + 2";
let expression = "";
// console.log(evaluateExp("1.1+2*5%(3+4/(6-5))"));
addButtonsEventListeners();

function evaluateExp(expression) {
    let valueArray = [];
    let operatorArray = [];
    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if (isNumber(char)) {
            let operandValue = char;
            for (let j = i + 1; j < expression.length; j++, i++) {
                let numberChar = expression[j];
                if (isLeftParan(numberChar) || isRightParan(numberChar) || isOperator(numberChar)) {
                    break;
                }
                operandValue += numberChar;
            }
            valueArray.push(+operandValue);
        }
        if (isLeftParan(char))
            operatorArray.push(char);
        if (isRightParan(char)) {
            while (!isLeftParan((operator = operatorArray.pop())) && operatorArray.length > 0) {
                let secondVal = valueArray.pop();
                let firstVal = valueArray.pop();
                valueArray.push(partialEvaluation(operator, firstVal, secondVal));
            }
        }
        if (isOperator(char)) {
            while (operatorArray.length && getPriority(char) < getPriority(operatorArray[operatorArray.length - 1])) {
                let operator = operatorArray.pop();
                let secondVal = valueArray.pop();
                let firstVal = valueArray.pop();
                valueArray.push(partialEvaluation(operator, firstVal, secondVal));
            }
            operatorArray.push(char);
        }
    }
    while (operatorArray.length) {
        let operator = operatorArray.pop();
        let secondVal = valueArray.pop();
        let firstVal = valueArray.pop();
        valueArray.push(partialEvaluation(operator, firstVal, secondVal));
    }
    return valueArray[0];
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

function partialEvaluation(operator, firstValue, secondValue) {
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
    if (evaluateExp(expression))
        display.textContent = evaluateExp(expression);
    else display.textContent = "";
}

function showResult() {
    if (evaluateExp(expression)) {
        expression = evaluateExp(expression);
        showExpression();
    } else {
        showWrongResultWarning();
    }
    showPartialResult();
}

function showWrongResultWarning() {
    let display = document.querySelector(".display__expression");
    display.textContent = "bad expression";
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

/*
TODOS:
- keyboard support
- divide by 0
- button styling
- fancy error display

*/