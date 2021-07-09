// let a = "1 + 2";
console.log(evaluateExp("1.1+2*5%(3+4/(6-5))"));

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
                    // i = j - 1;
                    break;
                }
                operandValue += numberChar;
            }
            valueArray.push(+operandValue);
        }
        if (isLeftParan(char))
            operatorArray.push(char);
        if (isRightParan(char)) {
            while (!isLeftParan((operator = operatorArray.pop()))) {
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