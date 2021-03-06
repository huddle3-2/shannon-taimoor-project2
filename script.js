// import storeInfo from "./database.js";

const pokeApp = {};

//Background Audio Setup
pokeApp.bgMusic = new Audio("./audio/pokemon-bg.mp3");
pokeApp.bgMusic.loop = true;
pokeApp.bgMusic.volume = 0.3;
pokeApp.flipSound = new Audio("./audio/flip.mp3");
pokeApp.flipSound.volume = 0.3;
pokeApp.matchSound = new Audio("./audio/match.mp3");
pokeApp.matchSound.volume = 0.3;
pokeApp.winGame = new Audio("./audio/win.mp3");
pokeApp.winGame.volume = 0.3;

pokeApp.ulEl = document.querySelector(".displayPokemon");
pokeApp.message = document.querySelector(".message");
pokeApp.displayMoves = document.querySelector(".moves");
pokeApp.button = document.querySelector("#playAgain");
pokeApp.startButton = document.querySelector(".startButton");
pokeApp.startGameDiv = document.querySelector("#startGame");
pokeApp.displayRounds = document.querySelector(".round");
pokeApp.musicButton = document.querySelector("#musicButton");
pokeApp.loader = document.querySelector(".loader");
pokeApp.inputName = document.querySelector(".inputName");
pokeApp.settingsButton = document.querySelector(".settingsButton");
pokeApp.settingsMenu = document.querySelector("#settingsMenu");
pokeApp.soundButton = document.querySelector("#soundButton");
pokeApp.mainMenu = document.querySelector("#mainMenu");
pokeApp.closeButton = document.querySelector("#closeButton");

pokeApp.pokeCards = [];
pokeApp.pokeInfo = [];
pokeApp.counter = 0;
pokeApp.moves = 0;
pokeApp.rounds = 1;
pokeApp.apiUrl = new URL("https://pokeapi.co/api/v2/pokemon/");

// These will be for future implementation of database :)
// pokeApp.userMoves;
// pokeApp.userSelection;
// pokeApp.userName;

// Fetch Pokemon Data using API, add url and name into an array
pokeApp.fetchData = (userSelection) => {
  const pokeNumbers = pokeApp.randomizer(userSelection);
  pokeApp.loader.style.display = "block";

  pokeNumbers.forEach((num) => {
    pokeApp.pokeCards.push(pokeApp.getPokemons(num));
  });

  Promise.all(pokeApp.pokeCards)
    .then((pokemons) => {
      pokemons.forEach((pokemon) => {
        pokeApp.pokeInfo.push({
          name: pokemon.name,
          imgUrl: pokemon.sprites.front_default,
        });
      });
      pokeApp.createBoard(pokeApp.pokeInfo);
    })
    .catch((err) => {
      alert(
        `${err.message} -- something went wrong while fetching the pokemon. Please try again.`
      );
      location.reload();
    });
};

pokeApp.getPokemons = async function (num) {
  const response = await fetch(`${pokeApp.apiUrl}${num}/`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(res.statusText);
  }
};

// fetch ANOTHER set of data using the URL we just received from the first API
pokeApp.createBoard = (pokeCards) => {
  pokeApp.ulEl.innerHTML = "";
  const dupedPokeCards = pokeApp.duplicateCards(pokeCards);
  const shuffledPokeCards = pokeApp.shufflePokeCards(dupedPokeCards);
  shuffledPokeCards.forEach((card) => {
    pokeApp.newLi = document.createElement("li");
    pokeApp.newLi.setAttribute("tabindex", 0);
    pokeApp.backDiv = document.createElement("div");
    pokeApp.frontDiv = document.createElement("div");

    pokeApp.frontDiv.classList.add("front");
    pokeApp.backDiv.classList.add("back");

    pokeApp.frontDiv.innerHTML = `<img src="./assets/back-card.png" draggable="false"/>`;
    pokeApp.backDiv.innerHTML = `<img src=${card.imgUrl} alt=${card.name}>`;
    pokeApp.newLi.append(pokeApp.frontDiv, pokeApp.backDiv);
    pokeApp.ulEl.appendChild(pokeApp.newLi);
    // call function for eventListener
    pokeApp.addClickSetup();
  });
  pokeApp.loader.style.display = "none";
};

// add event listeners
pokeApp.events = function () {
  document
    .querySelector("form")
    .addEventListener("submit", pokeApp.handleStartGameButton);
  //add listener for audio
  pokeApp.musicButton.addEventListener("click", pokeApp.handleMusicClick);
  //add listener for settings button
  pokeApp.settingsButton.addEventListener(
    "click",
    pokeApp.handleSettingsButtonClick
  );
  //add event listener for sound button
  pokeApp.soundButton.addEventListener("click", pokeApp.handleSoundButtonClick);
  //add event listener for button close
  pokeApp.closeButton.addEventListener("click", pokeApp.handleCloseButtonClick);
  //add event listener for main menu
  pokeApp.mainMenu.addEventListener("click", pokeApp.handleMainMenuClick);
};

//Utility methods
//shuffle fetched data
pokeApp.shufflePokeCards = (array) => {
  const copyArray = [...array];
  //loop through pokeCards array
  for (let i = copyArray.length - 1; i > 0; i--) {
    //assign random index from 1 to length of pokeCards array
    const randomIndex = Math.floor(Math.random() * (i + 1));
    //replace original value with value at random index
    [copyArray[i], copyArray[randomIndex]] = [
      copyArray[randomIndex],
      copyArray[i],
    ];
  }
  return copyArray;
};

//returns an array of random numbers based on user selection
pokeApp.randomizer = function (userSelection) {
  const newArray = [];

  for (let i = 0; i < userSelection; i++) {
    const randomNum = Math.floor(Math.random() * 898);
    if (!newArray.includes(randomNum)) {
      newArray.push(randomNum);
    }
  }
  return newArray;
};

//duplicate pokeCards array
pokeApp.duplicateCards = (array) => {
  const newArray = [];
  //push each element from pokeCards to newArray twice
  array.forEach((card) => {
    newArray.push(card);
    newArray.push(card);
  });
  //assign newArray to pokeCards array
  return newArray;
};

// setup Event Listener
pokeApp.addClickSetup = () => {
  pokeApp.button.addEventListener("click", pokeApp.handleButtonClick);
  pokeApp.newLi.addEventListener("click", pokeApp.handleTileClick);
};

//Check match
pokeApp.checkMatch = () => {
  if (pokeApp.counter === 2) {
    const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
    if (flippedCards[0].alt === flippedCards[1].alt) {
      pokeApp.matchSound.load();
      pokeApp.matchSound.play();
      // display message for players if they matched a card
      pokeApp.message.textContent = "It's a match!";
      pokeApp.message.classList.add("appear");

      // adds matched class and slows down the game so players don't spam click
      setTimeout(() => {
        flippedCards[0].classList.add("matched");
        flippedCards[1].classList.add("matched");
        pokeApp.counter = 0;
      }, 1000);

      setTimeout(() => {
        pokeApp.message.classList.remove("appear");
        pokeApp.checkGame();
      }, 1500);
    } else {
      setTimeout(() => {
        flippedCards.forEach((card) => {
          if (!card.className.includes("matched")) {
            card.classList.remove("flipped");
            card.parentElement.previousSibling.classList.remove("hide");
            card.parentElement.previousSibling.style.animation =
              "flipBack 0.1s linear";
            card.parentElement.previousSibling.style.zIndex = "10";
          }
        });
        pokeApp.counter = 0;
      }, 1500);
    }
  }
};

//Checks to see if game has been completed
pokeApp.checkGame = () => {
  const matchedCards = document.querySelectorAll(".matched");

  // checking if conditions are met that the number of matched cards is equal to the number of cards that were generated
  if (matchedCards.length === pokeApp.pokeCards.length * 2) {
    pokeApp.winGame.play();
    pokeApp.message.textContent = "You win the game!";
    pokeApp.message.classList.add("appear");
    pokeApp.button.style.visibility = "visible";
    storeInfo(pokeApp.userSelection, pokeApp.userName, pokeApp.userMoves);
  }
};

//reset function
pokeApp.reset = () => {
  pokeApp.ulEl.innerHTML = "";
  pokeApp.pokeCards = [];
  pokeApp.pokeInfo = [];
  pokeApp.counter = 0;
  pokeApp.moves = 0;
  pokeApp.message.classList.remove("appear");
  pokeApp.button.style.visibility = "hidden";
  pokeApp.displayMoves.textContent = "0";
  pokeApp.displayRounds.textContent = pokeApp.rounds;
};

//Handlers
//Pokeball tile click handler
pokeApp.handleTileClick = (e) => {
  if (e.target.parentNode.className.includes("front")) {
    pokeApp.counter++;

    if (pokeApp.counter <= 2) {
      pokeApp.flipSound.load();
      pokeApp.flipSound.play();
      // put target parent into variable and add class of flipped
      pokeApp.choiceParent = e.target.parentNode;
      pokeApp.choice = e.target.parentNode.nextSibling.firstChild;

      // pokeApp.choiceParent.style.animation = "flip 0.5s linear 10s";
      pokeApp.choiceParent.style.animation = "";
      pokeApp.choiceParent.classList.add("hide");
      pokeApp.choiceParent.style.zIndex = "0";
      pokeApp.choice.classList.add("flipped");

      //adds to counter on click
      pokeApp.moves++;
      pokeApp.userMoves = pokeApp.moves;

      // update move count
      pokeApp.displayMoves.textContent = `${pokeApp.moves}`;

      pokeApp.checkMatch();
    }
  }
};
//Handle Start game button
pokeApp.handleStartGameButton = (e) => {
  e.preventDefault();
  const userSelection = document.querySelector(
    "input[name=tiles]:checked"
  ).value;

  if (userSelection === "6") {
    pokeApp.ulEl.style.gridTemplateColumns = "repeat(4, 1fr)";
    pokeApp.ulEl.style.gridTemplateRows = "repeat(3, 1fr)";
    // pokeApp.ulEl.style.gap = "50px";
  } else if (userSelection === "8") {
    pokeApp.ulEl.style.gridTemplateColumns = "repeat(4, 1fr)";
    pokeApp.ulEl.style.gridTemplateRows = "repeat(4, 1fr)";
  } else if (userSelection === "10") {
    pokeApp.ulEl.style.gridTemplateColumns = "repeat(5, 1fr)";
    pokeApp.ulEl.style.gridTemplateRows = "repeat(4, 1fr)";
  } else {
    pokeApp.ulEl.style.gridTemplateColumns = "repeat(5, 1fr)";
    pokeApp.ulEl.style.gridTemplateRows = "repeat(2, 1fr)";
  }

  pokeApp.fetchData(userSelection);
  pokeApp.startGameDiv.style.display = "none";
};

//Handle Play Again button click
pokeApp.handleButtonClick = () => {
  pokeApp.rounds++;
  pokeApp.reset();
  pokeApp.startGameDiv.style.display = "flex";
};

//Handle music button click
pokeApp.handleMusicClick = () => {
  const audio = document.querySelector("#musicControl");
  if (audio.textContent === "ON") {
    pokeApp.bgMusic.pause();
    audio.textContent = "OFF";
  } else {
    pokeApp.bgMusic.play();
    pokeApp.bgMusic.volume = 0.3;
    audio.textContent = "ON";
  }
};
//handle setting button click
pokeApp.handleSettingsButtonClick = () => {
  pokeApp.settingsMenu.style.display = "flex";
  pokeApp.settingsButton.style.display = "none";
  pokeApp.startGameDiv.style.visibility = "hidden";
  pokeApp.ulEl.style.visibility = "hidden";
  pokeApp.button.style.visibility = "hidden";
  pokeApp.message.classList.remove("appear");
};

//handle sound on/off
pokeApp.handleSoundButtonClick = () => {
  const sound = document.querySelector("#soundControl");
  if (sound.textContent === "ON") {
    pokeApp.flipSound.volume = 0;
    pokeApp.matchSound.volume = 0;
    pokeApp.winGame.volume = 0;
    sound.textContent = "OFF";
  } else {
    pokeApp.matchSound.volume = 0.3;
    pokeApp.winGame.volume = 0.3;
    pokeApp.flipSound.volume = 0.3;
    sound.textContent = "ON";
  }
};

//handle menu close button
pokeApp.handleCloseButtonClick = () => {
  pokeApp.settingsMenu.style.display = "none";
  pokeApp.settingsButton.style.display = "block";
  pokeApp.ulEl.style.visibility = "visible";
  pokeApp.startGameDiv.style.visibility = "visible";
  if (
    document.querySelector("li") &&
    document.querySelectorAll(".matched").length ===
      pokeApp.pokeCards.length * 2
  ) {
    pokeApp.message.classList.add("appear");
    pokeApp.button.style.visibility = "visible";
  }
};

pokeApp.handleMainMenuClick = () => {
  pokeApp.reset();
  pokeApp.startGameDiv.style.display = "flex";
  pokeApp.settingsMenu.style.display = "none";
  pokeApp.ulEl.style.visibility = "visible";
  pokeApp.startGameDiv.style.visibility = "visible";
  pokeApp.settingsButton.style.display = "block";
};

pokeApp.init = () => {
  pokeApp.events();
};

pokeApp.init();
