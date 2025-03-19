
const ul = document.getElementById('resultList');
let computerInputNumbers;
let userInputNumbers;
let cnt = 0;

// 랭킹 초기화
export function resetRank() {
  localStorage.removeItem('Rank');
  
  document.getElementById('rank').style.display = 'none';
  document.getElementById('resetRank').style.display = 'none';
}

// 랭킹 보여주기
export function showRank() {
  let currentRank = localStorage.getItem('Rank');
  const parentNode = document.getElementById('rank');

  if (currentRank == null) {
    parentNode.style.display = 'none';
    document.getElementById('resetRank').style.display = 'none';
  } 
  else {
    parentNode.replaceChildren(`현재 1등: ${currentRank}회`);

    parentNode.style.display = 'inline-block';
    document.getElementById('resetRank').style.display = 'inline-block';
  }
}

// 임의의 숫자 3개 고르기
export function restartGame() {
  computerInputNumbers = MissionUtils.Random.pickUniqueNumbersInRange(1, 9, 3);
  console.log("재시작: " + computerInputNumbers)
  document.getElementById('correct').style.display = 'none';
  ul.replaceChildren();
}

// 숫자만 입력했는지 검사하기
export function checkNaN() {
  userInputNumbers = document.getElementById("typedAnswer").value;
  document.getElementById("typedAnswer").value = "";  // 입력값 초기화

  if (!isNaN(userInputNumbers)) {
    checkLength();
  } else {
    alert("숫자를 입력하세요.");
  }
}

// 입력값 길이 검사하기
function checkLength() {
  if (userInputNumbers.length == 3) {
    checkDuplication();
  } else {
    alert("세 자리수를 입력하세요.");
  }
}

// 세 글자일 때 중복된 수가 있는지 확인
function checkDuplication() {
  let checkUnique = new Set(userInputNumbers.split(""));
  if (checkUnique.size == 3) {
    checkRange();
  } else {
    alert("중복된 숫자가 있습니다.");
  }
}

// 1~9이 아닌 숫자가 있는지 확인
function checkRange() {
  let checkNumber = userInputNumbers.split("").map(Number);
  let correctRange = true;

  checkNumber.forEach((num, index)=>{
    if (num < 1 || num > 9) {
      correctRange = false;
      return;
    }
  });

  if (correctRange) {
    checkAnswer(checkNumber);
  } else {
    alert("1 ~ 9 사이의 숫자를 입력하세요.");
  }
}

// 볼, 스트라이크 여부 확인
function checkAnswer(checkNumber) {
  let ball = 0;
  let strike = 0;
  cnt++;

  checkNumber.forEach((num, index)=>{
    const check = computerInputNumbers.indexOf(num);
    if (check == index) strike++;
    else if (check != -1) ball++;
  });

  showResult(ball, strike);
}

// 결과값 출력
function showResult(ball, strike) {
  let result = '';
  if (ball == 0 && strike == 0) result = "낫싱";
  if (ball != 0) result += `${ball}볼 `;
  if (strike != 0) result += `${strike}스트라이크`;

  const newLi = document.createElement('li');
  const newText = document.createTextNode(`입력값: ${userInputNumbers} -> 결과: ${result}`);
  newLi.append(newText);
  ul.appendChild(newLi);

  if (strike == 3) correctAnswer();
}

// 정답일 때
function correctAnswer() {
  let rank = localStorage.getItem('Rank');
  if ((rank == null) || rank > cnt) {
    localStorage.setItem('Rank', cnt);
    document.getElementById('rank').replaceChildren(`현재 1등: ${cnt}회`);

    document.getElementById('rank').style.display = 'inline-block';
    document.getElementById('resetRank').style.display = 'inline-block';
  }
  cnt = 0;

  // 축하 표시 보여주기
  document.getElementById('correct').style.display = 'block';
}