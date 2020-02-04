/* jshint esversion: 6 */

/*================================
        Variable Declarations
================================*/

const keyboard = document.getElementById("qwerty");
const phraseDisplay = document.getElementById("phrase").getElementsByTagName("ul")[0];
const startButton = document.getElementsByClassName("btn__reset")[0];
const overlay = document.getElementById("overlay");
let missed = 0;
let usedPhrases = [];
let lastPhrase = '';


/*================================
        Event Listeners
================================*/

startButton.addEventListener("click", () => {
  overlay.style.display = "none";
});

keyboard.addEventListener("click", (e) => {
  if(e.target.tagName === "BUTTON") {
    e.target.classList.add("chosen", "flash", "animated");
    e.target.disabled = true;
    let letterFound = checkLetter(e.target);
  }
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
  } else {
    // Otherwise, get a random phrase that is not equal to the last Phrase and remove it from phrases and put it in usedPhrases
    let randomIndex = Math.floor(Math.random() * phrases.length);
    while(phrases[randomIndex] == lastPhrase) {
      randomIndex = Math.floor(Math.random() * phrases.length);
    }

    const randomPhrase = phrases.splice(randomIndex, 1)[0];
    usedPhrases.push(randomPhrase);
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
  for(let letter of letters) {
    if(userLetter == letter.innerText) {
      letter.classList.add("show", "bounce", "animated");
    }
  }
}


/*================================
        Main Logic
================================*/

let phrase = getRandomPhraseAsArray(phrases);
addPhraseToDisplay(phrase);
