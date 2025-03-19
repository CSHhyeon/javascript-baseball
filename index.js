/**
 * 기능 구현
 * "비즈니스 로직"과 "UI 로직"을 분리
 *
 * 비즈니스 로직
 *
 * 1. 숫자 생성
 * 1-1). 1부터 9까지 서로 다른 수로 이루어진 3자리의 수를 생성
 *
 * 2. 입력 값 검증
 * 2-1) 3자리 "숫지"인지 확인
 * 2-2) 1부터 9까지 서로 다른 수인지 확인
 * 2-3) 중복된 수가 있는지 확인
 *
 * 2-1,2-2,2-3) 모두 만족하면 다음 단계로 진행
 * 아니면 alert으로 에러 메시지를 보여주고, 다시 입력할 수 있게 한다.
 *
 * 2-4) 같은 수가 같은 자리에 있으면 스트라이크 힌트 생성
 * 2-5) 같은 수가 다른 자리에 있으면 볼 힌트 생성
 * 2-6) 같은 수가 전혀 없으면 낫싱이란 힌트 생성
 *
 * 3. 결과 값 계산
 * 3-1) 3스트라이크일 경우 게임 종료
 * 3-2) 3스트라이크가 아닐 경우 다시 입력 받기
 * 3-3) 정답을 맞추면 게임 승리
 *
 * 4. 게임 종료
 * 4-1) 결과 출력
 * 4-2) 게임 종료 후 다시 시작할 것인지 물어보기
 * 4-3) 다시 시작할 경우 1번부터 다시 시작
 *
 * UI 로직
 * 버튼을 누를때마다 비즈니스 로직을 실행한다.
 * 다만, 각 "상태"에 따라 실행해야되는 비즈니스 로직은 각각 다르다
 *
 * 예를 들어서 "확인" 버튼은 입력 값 검증 단계에선 검증을 시도해야 하지만, 게임 종료 단계에서는
 * 아무런 작동도 하면 안된다.
 * (실제 개발에서는 input, button disabled을 시키지만 여기선 생략)
 *
 * 각 state에 따라 다른 비즈니스 로직을 변경할 수 있도록 실행하는 함수는 state pattern으로 구현한다
 */
class BaseballGame {
  constructor() {
    this.secretNumber = this.generateUniqueThreeDigitNumber();
  }

  // 1. 1부터 9까지 서로 다른 수로 이루어진 3자리 수 생성
  generateUniqueThreeDigitNumber() {
    const computerInput = new Set();
    while (computerInput.size < 3) {
      computerInput.add(window.MissionUtils.Random.pickNumberInRange(1, 9));
    }
    return [...computerInput].join("");
  }

  // 2. 입력 검증: 3자리 숫자, 1-9, 중복 없이 구성되어야 함
  isValidInput(userInput) {
    return userInput.length === 3 && /^[1-9]+$/.test(userInput) && new Set(userInput).size === userInput.length;
  }

  // 3. 힌트 계산: 스트라이크, 볼, 낫싱
  calculateHint(userInput) {
    let strikes = 0;
    let balls = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === this.secretNumber[i]) {
        strikes++;
      } else if (this.secretNumber.includes(userInput[i])) {
        balls++;
      }
    }
    if (strikes === 0 && balls === 0) {
      return "낫싱";
    }
    let result = "";
    if (balls > 0) result += `${balls}볼 `;
    if (strikes > 0) result += `${strikes}스트라이크`;
    return result.trim();
  }

  // 4. 게임 승리 여부 확인
  isGameWon(userInput) {
    return userInput === this.secretNumber;
  }

  // 5. 게임 재시작 시 시크릿 넘버 재생성
  reset() {
    this.secretNumber = this.generateUniqueThreeDigitNumber();
  }
}

/**
 * View: 사용자 인터페이스 및 DOM 조작
 */
class BaseballView {
  constructor() {
    this.inputEl = document.querySelector("#user-input");
    this.resultEl = document.querySelector("#result");
    this.submitButton = document.querySelector("#submit");
    this.restartButton = document.querySelector("#game-restart-button");
  }

  // 사용자 입력값 반환
  getUserInput() {
    return this.inputEl.value;
  }

  // 입력창 초기화
  clearInput() {
    this.inputEl.value = "";
  }

  // 결과 메시지 업데이트
  updateResult(message) {
    this.resultEl.textContent = message;
  }

  // 알림 메시지 출력
  showAlert(message) {
    window.alert(message);
  }

  // 제출 버튼에 이벤트 핸들러 바인딩
  bindSubmit(handler) {
    this.submitButton.addEventListener("click", handler);
  }

  // 재시작 버튼에 이벤트 핸들러 바인딩
  bindRestart(handler) {
    this.restartButton.addEventListener("click", handler);
  }
}

/**
 * Controller: 모델과 뷰를 연결하여 이벤트 처리 및 게임 로직 실행
 */
class BaseballController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.initialize();
  }

  initialize() {
    // 뷰의 이벤트와 컨트롤러의 핸들러 연결
    this.view.bindSubmit(this.handleSubmit.bind(this));
    this.view.bindRestart(this.handleRestart.bind(this));
  }

  // "확인" 버튼 클릭 시 처리
  handleSubmit() {
    const userInput = this.view.getUserInput();

    if (!this.model.isValidInput(userInput)) {
      this.view.showAlert("3자리 서로 다른 숫자를 입력해주세요.");
      return;
    }

    const hint = this.model.calculateHint(userInput);
    this.view.updateResult(hint);

    if (this.model.isGameWon(userInput)) {
      this.view.showAlert("정답입니다! 게임을 다시 시작합니다.");
      this.model.reset();
      this.view.clearInput();
      this.view.updateResult("");
    } else {
      // 올바른 입력 후 입력창 초기화
      this.view.clearInput();
    }
  }

  // "게임 재시작" 버튼 클릭 시 처리
  handleRestart() {
    this.model.reset();
    this.view.clearInput();
    this.view.updateResult("");
  }
}

// 게임 초기화
const game = new BaseballGame();
const view = new BaseballView();
const controller = new BaseballController(game, view);
