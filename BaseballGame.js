
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

    // 꽃가루 효과 추가하기
    showFlower()
    showRankingMessage()
  }
  cnt = 0;

  // 축하 표시 보여주기
  document.getElementById('correct').style.display = 'block';
}

// 꽃가루 효과 ( 구글링 & GPT )
function showFlower() {
  let duration = 2 * 1000;
  let animationEnd = Date.now() + duration;

  function frame() {
    let timeLeft = animationEnd - Date.now();

    confetti({
      particleCount: 5 + Math.random() * 10,  // 5~15개 꽃가루 생성
      spread: 100,  // 꽃가루 퍼지는 각도
      startVelocity: 20,  // 시작 속도
      origin: { x: Math.random(), y: Math.random() - 0.2 }  // 랜덤 위치
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);  // frame() 함수를 다시 실행 (반복)
    }
  }

  frame();
}

// "축하합니다! 랭크 갱신!" 효과
function showRankingMessage() {
  const message = document.getElementById('rankMessage');

  message.classList.remove('hidden', 'fade-out'); // 숨김 해제
  message.classList.add('show'); // 화면 중앙에 나타남

  // 3초 후에 서서히 사라지도록 설정
  setTimeout(() => {
    message.classList.add('fade-out');

    setTimeout(() => {
      message.classList.remove('show'); // 완전히 사라지면 다시 숨김 처리
      message.classList.add('hidden'); 
    }, 1000); // 1초 후에 숨김 처리
  }, 3000); // 3초 동안 유지 후 사라짐
}
