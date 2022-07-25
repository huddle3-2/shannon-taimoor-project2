import storeInfo from "./database.js";

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

pokeApp.userMoves;
pokeApp.userSelection;
pokeApp.userName;

// get user difficult level
// if user difficulty level = x y z, then adjust the grid-template-column + grid-template-row
// also have to fetch number in the array and display in the grid

// Fetch Pokemon Data using API, add url and name into an array
pokeApp.fetchData = (userSelection) => {
  const pokeNumbers = pokeApp.randomizer(userSelection);
  pokeApp.loader.style.display = "block";

  pokeNumbers.forEach((num) => {
    pokeApp.pokeCards.push(pokeApp.getPokemons(num));
  });

  Promise.all(pokeApp.pokeCards).then((pokemons) => {
    pokemons.forEach((pokemon) => {
      pokeApp.pokeInfo.push({
        name: pokemon.name,
        imgUrl: pokemon.sprites.front_default,
      });
    });
    pokeApp.createBoard(pokeApp.pokeInfo);
  });
};

pokeApp.getPokemons = async function (num) {
  const response = await fetch(`${pokeApp.apiUrl}${num}/`);
  const data = await response.json();
  return data;
};

pokeApp.randomizer = function (userSelection) {
  const newArray = [];

  for (let i = 0; i < userSelection; i++) {
    const randomNum = Math.floor(Math.random() * 898);
    newArray.push(randomNum);
  }
  return newArray;
};

// fetch ANOTHER set of data using the URL we just received from the first API
pokeApp.createBoard = (pokeCards) => {
  pokeApp.ulEl.innerHTML = "";
  pokeApp.settingsButton.style.display = "block";
  const dupedPokeCards = pokeApp.duplicateCards(pokeCards);
  const shuffledPokeCards = pokeApp.shufflePokeCards(dupedPokeCards);
  shuffledPokeCards.forEach((card) => {
    pokeApp.newLi = document.createElement("li");
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

// trigger difficulty level event listener
pokeApp.events = function () {
  document.querySelector("form").addEventListener("submit", function (e) {
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
    } else if (userSelection === "5") {
      pokeApp.ulEl.style.gridTemplateColumns = "repeat(5, 1fr)";
      pokeApp.ulEl.style.gridTemplateRows = "repeat(2, 1fr)";
    }

    pokeApp.fetchData(userSelection);
    pokeApp.startGameDiv.style.display = "none";
  });
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

//duplicate pokeCards array
pokeApp.duplicateCards = (array) => {
  const newArray = [];
  //push each element from pokeCards to newArray twice
  array.forEach((card) => {
    newArray.push(card);
    newArray.push(card);
  });
  //assign newArray to pokeCards array
  console.log(newArray);
  return newArray;
};
// setup Event Listener
pokeApp.addClickSetup = () => {
  pokeApp.button.addEventListener("click", pokeApp.handleButtonClick);
  pokeApp.newLi.addEventListener("click", function (e) {
    //check if target has class of front
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

        // setTimeout(() => {
        //   pokeApp.choiceParent.classList.add("hide");
        //   pokeApp.choiceParent.style.zIndex = "0";
        // }, 500);

        pokeApp.choice.classList.add("flipped");

        //adds to counter on click
        pokeApp.moves++;
        pokeApp.userMoves = pokeApp.moves;

        // update move count
        pokeApp.displayMoves.textContent = `${pokeApp.moves}`;

        pokeApp.checkMatch();
      }
    }
  });
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

  if (matchedCards.length === pokeApp.pokeCards.length * 2) {
    pokeApp.winGame.play();
    pokeApp.message.textContent = "You win the game!";
    pokeApp.message.classList.add("appear");
    pokeApp.button.style.visibility = "visible";
    storeInfo(pokeApp.userSelection, pokeApp.userName, pokeApp.userMoves);
  }
};

//Handle Play Again button click
pokeApp.handleButtonClick = () => {
  pokeApp.ulEl.innerHTML = "";
  pokeApp.pokeCards = [];
  pokeApp.pokeInfo = [];
  pokeApp.counter = 0;
  pokeApp.moves = 0;
  pokeApp.message.classList.remove("appear");
  pokeApp.button.style.visibility = "hidden";
  pokeApp.displayMoves.textContent = "0";
  pokeApp.startGameDiv.style.display = "flex";
  pokeApp.rounds++;
  pokeApp.displayRounds.textContent = pokeApp.rounds;
};

//Handle music button click
pokeApp.handleMusicClick = () => {
  const audio = document.querySelector("#musicControl");
  if (audio.textContent === "ON") {
    pokeApp.bgMusic.pause();
    audio.textContent = "OFF";
  } else {
    pokeApp.bgMusic.play();
    audio.textContent = "ON";
  }
};

pokeApp.handleSettingsButtonClick = () => {
  pokeApp.settingsMenu.style.display = "flex";
  pokeApp.settingsButton.style.display = "none";
  pokeApp.ulEl.style.visibility = "hidden";
};

pokeApp.handleSoundButtonClick = () => {
  const sound = document.querySelector("#soundControl");
  if (sound.textContent === "ON") {
    pokeApp.bgMusic.volume = 0;
    pokeApp.flipSound.volume = 0;
    pokeApp.matchSound.volume = 0;
    pokeApp.winGame.volume = 0;
    sound.textContent = "OFF";
  } else {
    pokeApp.bgMusic.volume = 0.3;
    pokeApp.flipSound.volume = 0.3;
    pokeApp.matchSound.volume = 0.3;
    pokeApp.winGame.volume = 0.3;
    sound.textContent = "ON";
  }
};

pokeApp.handleCloseButtonClick = () => {
  pokeApp.settingsMenu.style.display = "none";
  pokeApp.settingsButton.style.display = "block";
  pokeApp.ulEl.style.visibility = "visible";
};

pokeApp.handleMainMenuClick = () => {
  pokeApp.ulEl.innerHTML = "";
  pokeApp.pokeCards = [];
  pokeApp.pokeInfo = [];
  pokeApp.counter = 0;
  pokeApp.moves = 0;
  pokeApp.message.classList.remove("appear");
  pokeApp.button.style.visibility = "hidden";
  pokeApp.displayMoves.textContent = "0";
  pokeApp.startGameDiv.style.display = "flex";
  pokeApp.displayRounds.textContent = pokeApp.rounds;
  pokeApp.settingsMenu.style.display = "none";
  pokeApp.ulEl.style.visibility = "visible";
};

pokeApp.init = () => {
  pokeApp.events();
};

pokeApp.init();
