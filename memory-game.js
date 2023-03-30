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
const startScreen = document.getElementById("start-screen");
const highScoreDisplay = document.getElementById("high-score");
const startButton = document.getElementById("start-button");
const highScoreData = localStorage.getItem("highScore");

/* checks if the highscore is defined, and if it is updates DOM to display it */
if (highScoreData) {
  highScoreDisplay.innerHTML = `Current High Score: ${highScoreData}`;
}

//add an event listern to start button, when start button is clicked, call the start game function
startButton.addEventListener("click", playRound);

//TODO: research docstrings and refactor - use as a learning exercise

/** playRound will represent one round.  */
function playRound() {
  startScreen.remove();
  //TODO:refactor so that the game ID is created by javascript to make clearing the screen easier
  createCards(colors);
  //create and start the timer that the player sees
  createTimerElement();
  const startTime = new Date()

  const gameBoard = document.getElementById('game')
  const gameCardArray = [...gameBoard.children]

  const playing = !gameCardArray.every((card)=>{
    return [...card.classList].includes('flipCard')
  })

  console.log(playing)

  // while (playing) {
  //   console.log('im playing')
  // }

  // for (const card of gameCardArray) {
  // }
  //while

  //how do I know when a round is over? what ways could I keep track of it
  //the length of gameCardArray?
  //the number of cards in game card array


  //code to handle a round ending
  //access the current round time
  //check if that time is less than the current value at localstorage.get(highscore)
  //if it is, change the local storage high score
  // location.reload()
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

    card.addEventListener("click", handleCardClick);
    card.appendChild(front);
    card.appendChild(back);
    gameBoard.appendChild(card);
    //append the card to the gameBoard div
  }
}

/** Create a timer counting up from 0 */
function createTimerElement() {
  // const gameBoard = document.getElementById("game")
  const timerDiv = document.createElement("div");
  const minutes = document.createElement("label");
  const colon = document.createElement("label");
  const seconds = document.createElement("label");

  minutes.innerHTML = "00";
  colon.innerHTML = ":";
  seconds.innerHTML = "00";

  timerDiv.setAttribute('id', 'timerDiv')
  minutes.setAttribute("id", "minutes");
  colon.setAttribute("id", "colon");
  seconds.setAttribute("id", "seconds");

  timerDiv.appendChild(minutes)
  timerDiv.appendChild(colon)
  timerDiv.appendChild(seconds)

  document.body.appendChild(timerDiv)

  var minutesLabel = document.getElementById("minutes");
  var secondsLabel = document.getElementById("seconds");
  var totalSeconds = 0;
  setInterval(setTime, 1000);

  function setTime() {
    ++totalSeconds;
    seconds.innerHTML = pad(totalSeconds % 60);
    minutes.innerHTML = pad(parseInt(totalSeconds / 60));
  }

  function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.classList.add("flipCard");
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.remove("flipCard");
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

  setTimeout(resolveTurn, 1000);

  currentClickedCards.push(card);
}

function resolveTurn() {
  if (currentClickedCards.length === 2) {
    const cardOneColor = currentClickedCards[0].classList[0];
    const cardTwoColor = currentClickedCards[1].classList[0];
    if (cardOneColor === cardTwoColor) {
      // alert("you got a match!");
      currentClickedCards = [];
      return;
    } else {
      for (let card of currentClickedCards) {
        unFlipCard(card);
      }
      currentClickedCards = [];
      return;
    }
  }
}
