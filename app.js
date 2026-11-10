const quizBank = {
  English: [
    {q:"Choose the correct plural of 'child'.",a:["Childs","Children","Childes","Childrens"],correct:1,why:"The plural of child is children."},
    {q:"Which word is an adjective in: 'The bright sun shines'?",a:["The","bright","sun","shines"],correct:1,why:"'Bright' describes the sun, so it is an adjective."},
    {q:"Choose the synonym of 'happy'.",a:["Joyful","Angry","Tired","Afraid"],correct:0,why:"Joyful means feeling or showing happiness."}
  ],
  Mathematics: [
    {q:"What is 15% of 200?",a:["15","20","30","40"],correct:2,why:"15% of 200 = 0.15 × 200 = 30."},
    {q:"What is the value of 8 × 7?",a:["54","56","64","48"],correct:1,why:"8 multiplied by 7 equals 56."},
    {q:"A triangle has how many sides?",a:["2","3","4","5"],correct:1,why:"A triangle has three sides."}
  ],
  Science: [
    {q:"Which gas do plants absorb during photosynthesis?",a:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],correct:2,why:"Plants use carbon dioxide, water and light to make food."},
    {q:"Which part of a plant absorbs water from soil?",a:["Flower","Leaf","Root","Stem"],correct:2,why:"Roots absorb water and minerals from the soil."},
    {q:"What is the boiling point of water at sea level?",a:["50°C","75°C","100°C","150°C"],correct:2,why:"Pure water boils at 100°C at standard atmospheric pressure."}
  ],
  "Social Science": [
    {q:"Which is the largest continent?",a:["Africa","Asia","Europe","Australia"],correct:1,why:"Asia is the largest continent by area and population."},
    {q:"How many houses are there in the Indian Parliament?",a:["One","Two","Three","Four"],correct:1,why:"The Indian Parliament has two houses: Lok Sabha and Rajya Sabha."},
    {q:"The Earth completes one revolution around the Sun in approximately:",a:["24 hours","30 days","365 days","12 hours"],correct:2,why:"One revolution takes about 365¼ days."}
  ]
};

let currentSubject = "";
let currentQuestion = 0;
let score = 0;
let answered = false;
let quizFinished = false;
let points = Number(localStorage.getItem("eduquestPoints") || 0);
let quizzes = Number(localStorage.getItem("eduquestQuizzes") || 0);

const $ = (id) => document.getElementById(id);
const modal = $("quizModal");

function updateStats() {
  $("points").textContent = points;
  $("quizzes").textContent = quizzes;
  $("level").textContent = points >= 100 ? "Explorer" : points >= 40 ? "Achiever" : "Beginner";
}
function openQuiz(subject) {
  currentSubject = subject;
  currentQuestion = 0;
  score = 0;
  quizFinished = false;
  $("quizTitle").textContent = `${subject} challenge`;
  $("quizClass").textContent = `CLASS ${$("classSelect").value} · QUICK QUIZ`;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  showQuestion();
}
function showQuestion() {
  const questions = quizBank[currentSubject];
  const item = questions[currentQuestion];
  answered = false;
  $("questionCount").textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  $("questionText").textContent = item.q;
  $("progressBar").style.width = `${(currentQuestion / questions.length) * 100}%`;
  $("feedback").textContent = "";
  $("nextBtn").disabled = true;
  $("nextBtn").textContent = currentQuestion === questions.length - 1 ? "Finish quiz →" : "Next question →";
  $("answers").innerHTML = "";
  item.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index, button));
    $("answers").appendChild(button);
  });
}
function chooseAnswer(index, selectedButton) {
  if (answered) return;
  answered = true;
  const item = quizBank[currentSubject][currentQuestion];
  const buttons = [...$("answers").children];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.correct) button.classList.add("correct");
  });
  if (index === item.correct) {
    score++;
    selectedButton.classList.add("correct");
    $("feedback").textContent = `Correct! ${item.why}`;
    $("feedback").style.color = "#238657";
  } else {
    selectedButton.classList.add("incorrect");
    $("feedback").textContent = `Not quite. ${item.why}`;
    $("feedback").style.color = "#bd514b";
  }
  $("nextBtn").disabled = false;
}
function closeQuiz() {
  modal.hidden = true;
  document.body.style.overflow = "";
}
function finishQuiz() {
  quizFinished = true;
  const earned = score * 10;
  points += earned;
  quizzes += 1;
  localStorage.setItem("eduquestPoints", points);
  localStorage.setItem("eduquestQuizzes", quizzes);
  updateStats();
  $("questionCount").textContent = "CHALLENGE COMPLETE";
  $("questionText").textContent = `You scored ${score} out of 3!`;
  $("progressBar").style.width = "100%";
  $("answers").innerHTML = `<div class="result-card">🎉 You earned <strong>${earned} points</strong>.<br>${score === 3 ? "Perfect score! Brilliant work." : "Keep practising. You are making progress!"}</div>`;
  $("feedback").textContent = "Your progress is saved on this device.";
  $("nextBtn").textContent = "Back to learning";
  $("nextBtn").disabled = false;
}
document.querySelectorAll(".subject-btn").forEach(button => {
  button.addEventListener("click", () => {
      openQuiz(button.dataset.subject);
  });
});
function nextQuestion() {
  if (quizFinished) { closeQuiz(); return; }
  if (!answered) return;
  if (currentQuestion < quizBank[currentSubject].length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    finishQuiz();
  }
}
$("nextBtn").addEventListener("click", nextQuestion);
$("closeModal").addEventListener("click", closeQuiz);
modal.addEventListener("click", event => { if (event.target === modal) closeQuiz(); });
$("menuBtn").addEventListener("click", () => document.querySelector(".topbar nav").classList.toggle("open"));
document.querySelectorAll(".topbar nav a").forEach(link => link.addEventListener("click", () => document.querySelector(".topbar nav").classList.remove("open")));
updateStats();
