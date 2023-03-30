"use strict";
/** global constants */
const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

/* code to handle the inital page load  */
const homeScreen = document.getElementById("start-screen");
const highScoreDisplay = document.getElementById("high-score");
const startButton = document.getElementById("start-button");
const highScoreData = localStorage.getItem("highScore");

/** variables needed within the global scope for the game to function as written
 * all of these get defined when startGame is called later on
 */
let gameBoard = null;
let gameCards = null;
let cardsLeft = null;
let playerScore = null;
//TODO: delete upon successfully implementing the click based score
let startTime = null;

/* checks if the highscore is defined, and if it is updates DOM to display it */
highScoreDisplay.innerHTML = `Current High Score: ${highScoreData || "NA"}`;

//add an event listern to start button, when start button is clicked, call the start game function
startButton.addEventListener("click", startGame);

//TODO: research docstrings and refactor - use as a learning exercise

/** startGame will represent one round.  */
function startGame() {
  homeScreen.remove();
  playerScore = 0;
  createScoreDiv(playerScore);
  createTimerElement();
  //call the TBD score function
  createCards(colors);
  //create and start the timer that the player sees

  startTime = Date.now();

  gameBoard = document.getElementById("game");
  gameCards = [...gameBoard.children];
  cardsLeft = gameCards.length;
  console.log(cardsLeft);

  addHandlersToCards(gameCards);

  //OLD VERSION TO DELETE
  // gameCards.forEach((card) => {
  //   card.addEventListener("click", handleCardClick);
  // });
}

/** Memory game: find matching pairs of cards and flip both of them. */

const colors = shuffle(COLORS);

// createCards(colors);

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const card = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");
    front.style.backgroundColor = "grey";
    back.style.backgroundColor = `${color}`;
    front.classList.add("front");
    back.classList.add("back");
    card.classList.add(`${color}`);

    //TODO:refactor this out of create cards into the main play game function

    card.appendChild(front);
    card.appendChild(back);
    gameBoard.appendChild(card);
    //append the card to the gameBoard div
  }
}
/* creates the div that will display the running # of clicks and appends to DOM */
function createScoreDiv(playerScore) {
  const scoreCard = document.createElement("div");
  scoreCard.setAttribute("id", "scoreCard");

  scoreCard.innerHTML = playerScore;

  document.body.append(scoreCard);
}

/** Initially implemented a timer and used that as a score, but changed it to
 * counting clicks upon re-reading the instructions
 */

// function createTimerElement() {
//   // const gameBoard = document.getElementById("game")
//   const timerDiv = document.createElement("div");
//   const minutes = document.createElement("label");
//   const colon = document.createElement("label");
//   const seconds = document.createElement("label");

//   minutes.innerHTML = "00";
//   colon.innerHTML = ":";
//   seconds.innerHTML = "00";

//   timerDiv.setAttribute("id", "timerDiv");
//   minutes.setAttribute("id", "minutes");
//   colon.setAttribute("id", "colon");
//   seconds.setAttribute("id", "seconds");

//   timerDiv.appendChild(minutes);
//   timerDiv.appendChild(colon);
//   timerDiv.appendChild(seconds);

//   document.body.appendChild(timerDiv);

//   var minutesLabel = document.getElementById("minutes");
//   var secondsLabel = document.getElementById("seconds");
//   var totalSeconds = 0;
//   setInterval(setTime, 1000);

//   function setTime() {
//     ++totalSeconds;
//     seconds.innerHTML = pad(totalSeconds % 60);
//     minutes.innerHTML = pad(parseInt(totalSeconds / 60));
//   }

//   function pad(val) {
//     var valString = val + "";
//     if (valString.length < 2) {
//       return "0" + valString;
//     } else {
//       return valString;
//     }
//   }
// }

/** given an array of card elements, add an event listener card */
function addHandlersToCards(array) {
  array.forEach((item) => {
    item.addEventListener("click", handleCardClick);
  });
}

/** given an array of card elements, remove an event listener from each card */
function removeHandlersFromCards(array) {
  array.forEach((item) => {
    item.removeEventListener("click", handleCardClick);
  });
}

/** Flip a card face-up. */

function flipCard(card) {
  playerScore++;
  updateScore(playerScore);
  card.classList.add("flipCard");
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.remove("flipCard");
}

/** updates the score tracker whenever a card is flipped */
function updateScore(playerScore) {
  document.getElementById("scoreCard").innerHTML = playerScore;
}
/**
 * data structure to keep track of cards that have been clicked in a turn, and
 * trigger game logic
 */
let currentClickedCards = [];

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(event) {
  const card = event.currentTarget;
  const cardClasses = [...card.classList];

  if (cardClasses.includes("flipCard")) {
    alert("this card is already clicked");
    return;
  }

  flipCard(card);
  currentClickedCards.push(card);

  if (currentClickedCards.length === 2) {
    removeHandlersFromCards(gameCards);
    setTimeout(resolveTurn, 1000);
  }
}

function resolveTurn() {
  if (currentClickedCards.length === 2) {
    const cardOneColor = currentClickedCards[0].classList[0];
    const cardTwoColor = currentClickedCards[1].classList[0];
    if (cardOneColor === cardTwoColor) {
      cardsLeft = cardsLeft - 2;
      if (!cardsLeft) {
        gameOver(playerScore);
      }
      currentClickedCards = [];
      addHandlersToCards(gameCards);
      for (let card of currentClickedCards) {
        unFlipCard(card);
      }
      return;
    } else {
      for (let card of currentClickedCards) {
        unFlipCard(card);
      }
      currentClickedCards = [];
      addHandlersToCards(gameCards);
      return;
    }
  }
}

function gameOver(num) {
  if (
    !localStorage.getItem("highScore") ||
    localStorage.getItem("highScore") > num
  ) {
    localStorage.setItem("highScore", num);
    alert("You set the new lowest score!");
    setTimeout(location.reload(), 500);
  }
  alert("You win!!!");
  setTimeout(location.reload(), 500);
}
