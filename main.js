import { showRank, resetRank, checkNaN, restartGame } from "./BaseballGame.js";

// 새로 고침되거나 "게임 재시작 버튼 눌렸을 때"
document.addEventListener("DOMContentLoaded", () => {
  showRank();
  restartGame();
});
document.getElementById("restartGame").addEventListener("click", restartGame);

// 확인 버튼 눌렀을 때 값 확인
document.getElementById("checkAnswer").addEventListener("click", checkNaN);

// 랭킹 초기화 버튼 눌렀을 때 값 초기화
document.getElementById("resetRank").addEventListener("click", resetRank);