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
pokeApp.startGameDiv = document.querySelector(".startGame");
pokeApp.displayRounds = document.querySelector(".round");
pokeApp.musicButton = document.querySelector("#musicButton");

pokeApp.pokeCards = [];
pokeApp.counter = 0;
pokeApp.moves = 0;
pokeApp.rounds = 1;

// get user difficult level
// if user difficulty level = x y z, then adjust the grid-template-column + grid-template-row
// also have to fetch number in the array and display in the grid

// Fetch Pokemon Data using API, add url and name into an array
pokeApp.fetchData = (userSelection) => {
  const url = new URL("https://pokeapi.co/api/v2/pokemon");

  url.search = new URLSearchParams({
    limit: userSelection,
    offset: pokeApp.randomizer(),
  });

  pokeApp.ulEl.innerHTML = "";
  pokeApp.pokeCards = [];

  fetch(url)
    .then(function (data) {
      return data.json();
    })
    .then(function (results) {
      // for each loop
      results.results.forEach((item) => {
        pokeApp.pokeCards.push({
          url: item.url,
          name: item.name,
        });
      });
    })
    .then(function () {
      pokeApp.duplicateCards();
      pokeApp.shufflePokeCards();
      pokeApp.createBoard(pokeApp.pokeCards);
    });
};

pokeApp.randomizer = function () {
  pokeApp.offset = Math.floor(Math.random() * (1000 - 10));
  return pokeApp.offset;
};

// fetch ANOTHER set of data using the URL we just received from the first API
pokeApp.createBoard = function (pokeCards) {
  pokeApp.ulEl.innerHTML = "";
  pokeCards.forEach((card) => {
    fetch(card.url)
      .then(function (data) {
        return data.json();
      })
      .then(function (result) {
        card.imgUrl = result.sprites.front_default;
      })
      .then(function () {
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
  });
};

// trigger difficulty level event listener
pokeApp.events = function () {
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const userSelection = document.querySelector(
      "input[name=tiles]:checked"
    ).value;

    console.log(userSelection);
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
};

//shuffle fetched data
pokeApp.shufflePokeCards = () => {
  //loop through pokeCards array
  for (let i = pokeApp.pokeCards.length - 1; i > 0; i--) {
    //assign random index from 1 to length of pokeCards array
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const originalValue = pokeApp.pokeCards[i];

    //replace original value with value at random index
    pokeApp.pokeCards[i] = pokeApp.pokeCards[randomIndex];
    //replace value at random index with original
    pokeApp.pokeCards[randomIndex] = originalValue;
  }
};

//duplicate pokeCards array
pokeApp.duplicateCards = () => {
  const newArray = [];

  //push each element from pokeCards to newArray twice
  pokeApp.pokeCards.forEach((card) => {
    newArray.push(card);
    newArray.push(card);
  });

  //assign newArray to pokeCards array
  pokeApp.pokeCards = newArray;
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

  if (matchedCards.length === pokeApp.pokeCards.length) {
    pokeApp.winGame.play();
    pokeApp.message.textContent = "You win the game!";
    pokeApp.message.classList.add("appear");
    pokeApp.button.style.visibility = "visible";
  }
};

//Handle Play Again button click
pokeApp.handleButtonClick = () => {
  pokeApp.ulEl.innerHTML = "";
  pokeApp.pokeCards = [];
  pokeApp.counter = 0;
  pokeApp.moves = 0;
  pokeApp.message.classList.remove("appear");
  pokeApp.button.style.visibility = "hidden";
  pokeApp.displayMoves.textContent = "0";
  pokeApp.startGameDiv.style.display = "flex";
  // pokeApp.fetchData();
  pokeApp.rounds++;
  pokeApp.displayRounds.textContent = pokeApp.rounds;
};

//Handle music button click
pokeApp.handleMusicClick = () => {
  const audio = document.querySelector("#audioControl");
  if (audio.textContent === "ON") {
    pokeApp.bgMusic.pause();
    audio.textContent = "OFF";
  } else {
    pokeApp.bgMusic.play();
    audio.textContent = "ON";
  }
};

pokeApp.init = () => {
  pokeApp.events();
  pokeApp.randomizer();
};

pokeApp.init();
