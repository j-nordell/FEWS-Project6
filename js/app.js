/* jshint esversion: 6 */

/*================================
        Variable Declarations
================================*/

const keyboard = document.getElementById("qwerty");
const phraseDisplay = document.getElementById("phrase").getElementsByTagName("ul")[0];
const startButton = document.getElementsByClassName("btn__reset")[0];
const overlay = document.getElementById("overlay");
const answerDiv = document.createElement("div");
const correctAnswer = document.createElement("h3");
const title = document.getElementsByClassName("title")[0];

let missed = 0;
let usedPhrases = [];
let lastPhrase = '';
let heartList = document.getElementById("scoreboard").getElementsByTagName("ol")[0];
let gameStarted = false;

answerDiv.appendChild(correctAnswer);
title.parentNode.insertBefore(answerDiv, title.nextSibling);

/*================================
        Event Listeners
================================*/

startButton.addEventListener("click", () => {
  showGameBoard();
  startGame();
});

keyboard.addEventListener("click", (e) => {
  if(e.target.tagName === "BUTTON") {
    e.target.classList.add("flash", "animated");
    e.target.disabled = true;
    let letterFound = checkLetter(e.target);
    if(!letterFound) {
      missed++;
      e.target.classList.add("chosen");
      removeLife();
    } else {
      e.target.classList.add("correct");
    }
    checkWin();
  }
});

document.addEventListener("keydown", (e) => {
  let letter = e.key.toLowerCase();  // upper case version of the key that was pressed
  // if the game hasn't been started (the overlay is showing) and the key that was pressed
  // is Enter/Return click the btn__reset
  let allowedLetters = "abcdefghijklmnopqrstuvwxyz";
  if(e.which == 13 && !gameStarted) {
    startButton.click();
  } else if(allowedLetters.includes(letter)) {  // if the key was pressed was a valid letter
    let keys = keyboard.getElementsByTagName("button");
    for(let key of keys) {
      if(key.innerText == e.key) {  
        key.click();
      }
    }
  }
});

// Event listener to prevent cheating by selecting and highlighting
document.addEventListener("mousedown", (e) => {
  e.preventDefault();
});

/*================================

        Helper Functions
================================*/
/**
 * Function that takes an array, gets a random string from it and returns that string as an array
 * @param {Array} phraseArray
 * @returns {Array} 
 */
function getRandomPhraseAsArray(phraseArray) {
  let singlePhrase = getPhrase();
  return singlePhrase.split('');
}

/**
 * Function to ensure that the original phrases are played through in their entirity in a random order
 * while simultaneously preventing the final phrase shown being the first phrase shown in the next iteration.
 * @returns {string} a single phrase as a string
 */
function getPhrase() {
  // If the original phrases is depleted refill it from the usedPhrases
  if(phrases.length === 0) {
    phrases = usedPhrases;  
    usedPhrases = [];
    return getPhrase();
  } else {
    // Otherwise, get a random phrase that is not equal to the last Phrase and remove it from phrases and put it in usedPhrases
    let randomIndex = getRandIndex(phrases);
    while(phrases[randomIndex] == lastPhrase) {
      randomIndex = getRandIndex(phrases);
    }

    const randomPhrase = phrases.splice(randomIndex, 1)[0];
    usedPhrases.push(randomPhrase);
    lastPhrase = randomPhrase;
    return randomPhrase;
  }
}

/**
 * Function to loop through and create the HTML. 
 * This was chosen over appending to reduce the write actions on the DOM.
 * @param {Array} currentPhrase 
 */
function addPhraseToDisplay(currentPhrase) {
  let htmlString = '';
  for(let letter of currentPhrase) {
    htmlString += letter === ' ' ?
      `<li class="space"></li>` :
      `<li class="letter">${letter}</li>`;
  }
  phraseDisplay.innerHTML = htmlString;
}

/**
 * Function that checks if a letter in the phrase matches the letter that was pressed.
 * Appropriate classes are added if there's a match and the letter is returned.
 * Otherwise, null is returned.
 * @param {Node} button
 * @returns {string|null} 
 */
function checkLetter(button) {
  let letters = document.getElementsByClassName("letter");
  let userLetter = button.innerText;
  let wasFound = null;
  for(let letter of letters) {
    if(userLetter == letter.innerText) {
      letter.classList.add("show", "bounce", "animated");
      wasFound = userLetter;
    }
  }
  return wasFound;
}

/**
 * Function to switch a "live" heart to a "dead" heart
 */
function removeLife() {
  let hearts = document.getElementsByTagName("img");
  hearts[5 - missed].classList.add("animated", "jackInTheBox");
  hearts[5 -missed].src = "images/lostHeart.png";
}

/**
 * Function to determine if a win or lose scenario has occurred and update the overlay if one has been met
 */
function checkWin() {
  let totalLetters = document.getElementsByClassName("letter");
  let shownLetters = document.getElementsByClassName("show");

  if(totalLetters.length == shownLetters.length){
    gameOver("win");
  } else if (missed == 5) {
    gameOver("lose");
  }
}

/**
 * Function to drop the overlay in place and apply messages, fonts, and styling
 * based on whether the user won or lost
 * @param {string} winOrLose will be either "win" or "lose"
 */
function gameOver(winOrLose) {
  gameStarted = false;
  clearHearts();
  overlay.className = '';
  overlay.style.display = '';
  correctAnswer.innerText = `Correct answer: ${lastPhrase}`;
  resetPhrase();
  resetKeyboard();
  let h2 = document.getElementsByTagName("h2")[0];
  h2.style.textTransform = "capitalize";
  let message = '';
  if(winOrLose === "win") {
    let emoji = winEmojis[getRandIndex(winEmojis)];
    message = `${winningMessages[getRandIndex(winningMessages)]}!
               ${String.fromCodePoint(parseInt(emoji, 16))}`;
    h2.style.fontFamily = "Pacifico";
    overlay.classList.add("animated", "slideInLeft");
  } else {
    let emoji = loseEmojis[getRandIndex(loseEmojis)];
    message = `${losingMessages[getRandIndex(losingMessages)]}!
               ${String.fromCodePoint(parseInt(emoji, 16))}`;
    h2.style.fontFamily = 'Shadows Into Light';
    overlay.classList.add("animated", "slideInRight");
  }
  h2.innerText = message;
  overlay.style.background = getGradientString(winOrLose);
}

/**
 * Function to generate an appropriate gradient randomly but based on win or loss
 * @param {string} winOrLose string that says if it should be for a winning or losing gradient
 * @returns {string} string holding the gradient rule
 */
function getGradientString(winOrLose) {
  let colorsToUse = winOrLose == "win" ? winColors : loseColors;
  let numOfColors = Math.floor(Math.random() * 4) + 2;
  let degrees = Math.floor(Math.random() * 90) - 45;
  let colorSelection = [];

  let gradientString = `linear-gradient(${degrees}deg, `;

  for(let i = 0; i < numOfColors; i++) {
    colorSelection.push(colorsToUse[getRandIndex(colorsToUse)]);
  }

  gradientString += `${colorSelection.join(', ')})`;
  return gradientString;
}

/**
 * Function to begin the gradient animation on the overlay
 */
function startGradientAnimation(delay="0s") {
  overlay.style.animation = "gradient 10s ease";
  overlay.style.animationIterationCount = "infinite";
  overlay.style.animationDelay = delay;
}

/**
 * Function to return a valid integers that corresponds to the array given
 * @param {array} the array to work against
 * @returns {Number} 
 */
function getRandIndex(array) {
  return Math.floor(Math.random() * array.length);
}

/**
 * Function to reset display and add animation to overlay
 */
function showGameBoard() {
  overlay.style.animation = "";
  overlay.classList.add("animated", "slideOutUp");
  overlay.style.display = "";
}

function resetKeyboard() {
  let keyboardKeys = keyboard.getElementsByTagName("button");
  for(let key of keyboardKeys) {
    key.disabled = false;
    key.className = '';
  }
}

function clearHearts() { 
  heartList.innerHTML = '';
}

function addHearts() {
  let htmlString = '';
  for(let i = 0; i < 5; i++) {
    htmlString += `<li class="tries"><img src="images/liveHeart.png" height="35px" width="30px"></li>`;
  }
  heartList.innerHTML = htmlString;
}

function resetPhrase() {
  phraseDisplay.innerHTML = '';
}

/**
 * Function to kick off the main logic loop
 */
function startGame() {
  missed = 0;
  gameStarted = true;
  addHearts();
  let phrase = getRandomPhraseAsArray(phrases);
  addPhraseToDisplay(phrase);  
}
/*================================
        Main Logic
================================*/
startGradientAnimation();
clearHearts();