const title_form = document.querySelector(".title__form");
const title_input = document.querySelector(".title__input");
const title_submit = document.querySelector(".title__btn--submit");
const title_text = document.querySelector(".title__text");
const title_edit = document.querySelector(".title__btn--edit");
const title = document.querySelector(".title");
const title_delete = document.querySelector(".title__icon--delete");

const timer_minute = document.querySelector(".timer__slots--minute");
const timer_second_one = document.querySelector(".timer__second--one");
const timer_second_two = document.querySelector(".timer__second--two");

const timer_slots = document.querySelectorAll(
  ".timer__slots--minute, .timer__second--one, .timer__second--two"
);

const closedBtn = document.querySelector(".history__close--btn");
const history_bar = document.querySelector(".history");
const playBtn = document.querySelector(".timer__btn--play");
const pauseBtn = document.querySelector(".timer__btn--pause");

const calculator = document.querySelector(".calculator__numbers");
const display = document.querySelector(".calculator__display--num");
const resetBtn = document.querySelector(".calculator__btn--ac");
const resultBtn = document.querySelector(".calculator__btn--equal");
const deleteBtn = document.querySelector(".calculator__btn--arrow");
const slotsHeight = 38;
const taxPlusBtn = document.querySelector(".calculator__btn--tax-plus");
const taxMinusBtn = document.querySelector(".calculator__btn--tax-minus");

const historyBtn = document.querySelector(".header__logo--history");
const historyCloseBtn = document.querySelector(".history__close--btn");
const historyContainer = document.querySelector(".history__columns");
if (title_text.textContent.trim() === "") {
  title_edit.style.display = "none";
}

title_form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (title_input.value.length <= 25) {
    title_text.textContent = title_input.value;
    title_text.style.display = "block";
    title_input.style.display = "none";
    title_submit.style.display = "none";
    title_edit.style.display = "block";

    localStorage.setItem("saveTitle", title_input.value);
  } else if (title_input.value.length > 25) {
    title_text.style.display = "none";
    title_input.value = "";
    title_submit.style.display = "block";
    title_edit.style.display = "none";
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const savedTitle = localStorage.getItem("saveTitle");
  if (savedTitle) {
    title_text.textContent = savedTitle;
    title_text.style.display = "block";
    title_input.style.display = "none";
    title_submit.style.display = "none";
    title_edit.style.display = "block";
  } else {
    title_edit.style.display = "none";
    title_submit.style.display = "block";
  }
});

title_edit.addEventListener("click", function (e) {
  title_input.style.display = "block";
  title_edit.style.display = "none";
  title_submit.style.display = "block";
  title_text.style.display = "none";
  title_input.value = title_text.textContent;
});

let setMinute;
let setSecondOne;
let setSecondTwo;
let timerMinute;
let timerSecond;

let inputNum = "";
let isCalculated = false;
display.textContent = 0;

let hisCalc = [];
let hisResult;

const rate = 0.1;

const handleScroll = function (scrollTop, label, slotsHeight) {
  const index = Math.floor(scrollTop / slotsHeight);

  if (label === "minute") setMinute = index;
  if (label === "second-one") setSecondOne = index;
  if (label === "second-two") setSecondTwo = index;
  setTimer();
};

timer_slots.forEach((slot) => {
  slot.addEventListener("scroll", function (e) {
    const scrollTop = e.target.scrollTop;
    const label = e.target.dataset.label;
    handleScroll(scrollTop, label, slotsHeight);
  });
});

const setTimer = function () {
  timerMinute = setMinute?.toString().padStart(2, "0") || "00";
  timerSecond = (setSecondOne ?? 0) * 10 + (setSecondTwo ?? 0);
  return [timerMinute, timerSecond];
};

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  timer_minute.textContent = minutes;
  timer_second_one.textContent = seconds[0];
  timer_second_two.textContent = seconds[1];
};

const playTimer = function () {
  let total = Number(timerMinute) * 60 + Number(timerSecond);
  const timerId = setInterval(() => {
    if (total <= 0) {
      clearInterval(timerId);
      resetTimer();
      return;
    }
    total--;
    formatTime(total);
  }, 1000);
};

const resetTimer = function (e) {
  setTimeout(() => {
    timer_slots.forEach((slot) => {
      slot.scrollTop = 0;
    });
  }, 0);

  setTimeout(() => {
    setMinute = 0;
    setSecondOne = 0;
    setSecondTwo = 0;
    setTimer();
  }, 300);
};

playBtn.addEventListener("click", function () {
  setTimer();
  playTimer();
});

const handleInputNumber = function (input) {
  if (isCalculated) {
    if (/\d/.test(input)) {
      inputNum = input;
    } else if ("+-×÷".includes(input)) {
      if (inputNum.length === 0 || "+-×÷".includes(inputNum.slice(-1))) {
        inputNum = "0";
        return;
      }
      inputNum += input;
    }
    isCalculated = false;
  } else {
    if (inputNum.length === 0 && "+-×÷".includes(input)) {
      inputNum = "0";
      return;
    }

    if ("+-×÷".includes(inputNum.slice(-1)) && "+-×÷".includes(input)) {
      inputNum = inputNum.slice(0, -1) + input;
    } else if (inputNum === "0") {
      if (input === ".") {
        inputNum = "0.";
      } else {
        inputNum = input;
      }
    } else {
      inputNum += input;
    }
  }
  if (inputNum.length >= 14) return;
  display.textContent = inputNum || "0";
  tokenize(inputNum);
};

calculator.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn || !btn.dataset.value) return;
  const value = btn.dataset.value;
  handleInputNumber(value);
});

const tokenize = function (stringNum) {
  const tokens = [];
  let buffer = "";
  for (let str of stringNum) {
    if ("0123456789.".includes(str)) {
      buffer += str;
    } else if ("+-×÷".includes(str)) {
      if (buffer) {
        tokens.push(buffer);
        buffer = "";
      }
      tokens.push(str);
    }
  }
  if (buffer) {
    tokens.push(buffer);
  }

  return tokens;
};

const handleReset = function () {
  display.textContent = "0";
  inputNum = "";
  isCalculated = true;
  tokenize("");
};

resetBtn.addEventListener("click", handleReset);

const handleCalcNum = function (tokenize) {
  for (let i = 0; i < tokenize.length; i++) {
    if (["×", "÷"].includes(tokenize[i])) {
      let left = tokenize[i - 1];
      let right = tokenize[i + 1];
      let operator = tokenize[i];

      let result;
      if (operator === "×") result = left * right;
      if (operator === "÷") result = left / right;
      tokenize.splice(i - 1, 3, result);
      i -= 1;
    }
  }
  for (let i = 0; i < tokenize.length; i++) {
    if (["+", "-"].includes(tokenize[i])) {
      let left = parseFloat(tokenize[i - 1]);
      let right = parseFloat(tokenize[i + 1]);
      let result;

      if (tokenize[i] === "+") result = left + right;
      if (tokenize[i] === "-") result = left - right;

      tokenize.splice(i - 1, 3, result);
      i -= 1;
    }
  }

  let finalResult = Number(tokenize[0].toFixed(12));
  finalResult = finalResult.toString().slice(0, 14);

  display.textContent = finalResult;

  return finalResult;
};

resultBtn.addEventListener("click", function () {
  const tokens = tokenize(inputNum);
  const calcNumlist = inputNum;

  const last = tokens[tokens.length - 1];
  if ("+-×÷".includes(last)) {
    tokens.pop();
  }
  const result = handleCalcNum(tokens);
  inputNum = result.toString();
  isCalculated = true;
  calcHistory(calcNumlist, result);
});

deleteBtn.addEventListener("click", function () {
  inputNum = inputNum.slice(0, -1);
  if (inputNum === "") {
    display.textContent = "0";
  } else {
    display.textContent = inputNum;
  }
});

historyBtn.addEventListener("click", function () {
  history_bar.classList.add("active");
});

historyCloseBtn.addEventListener("click", function () {
  history_bar.classList.remove("active");
});

//계산로직 후 history 함수 꼭 추가
const calcHistory = function (inputNum, finalResult) {
  hisResult = `${inputNum} = ${finalResult}`;
  hisCalc.push(hisResult);

  if (hisCalc.length > 5) {
    hisCalc.shift();
  }
  localStorage.setItem("calcHistory", JSON.stringify(hisCalc));
  historyArray(hisCalc);
};

const historyArray = function (hisCalc) {
  historyContainer.innerHTML = "";
  hisCalc.forEach((value) => {
    const div = document.createElement("div");
    div.classList.add("history__column");
    div.textContent = value;
    historyContainer.prepend(div);
  });
};

window.addEventListener("DOMContentLoaded", function () {
  hisCalc = JSON.parse(localStorage.getItem("calcHistory")) || [];
  if (hisCalc.length > 0) {
    historyArray(hisCalc);
  }
});

const calculateTax = function (type) {
  const currentValue = parseFloat(inputNum);
  if (isNaN(currentValue)) return;

  let taxResult;
  if (type === "plus") {
    taxResult = currentValue * 1.1;
  } else if (type === "minus") {
    taxResult = currentValue / 1.1;
  }
  inputNum = taxResult.toFixed(2).toString();
  display.textContent = inputNum;
  isCalculated = true;

  calcHistory(currentValue + (type === "plus" ? " +10%" : " -10%"), inputNum);
};

taxPlusBtn.addEventListener("click", function () {
  calculateTax("plus");
});
taxMinusBtn.addEventListener("click", function () {
  calculateTax("minus");
});
