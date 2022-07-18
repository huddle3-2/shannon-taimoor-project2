const pokeApp = {};

pokeApp.ulEl = document.querySelector(".displayPokemon");
pokeApp.message = document.querySelector(".message");
pokeApp.displayMoves = document.querySelector(".moves");
pokeApp.button = document.querySelector(".button");
pokeApp.startButton = document.querySelector(".startButton");
pokeApp.startGameDiv = document.querySelector(".startGame");
pokeApp.displayRounds = document.querySelector(".round");

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
  });

  pokeApp.ulEl.innerHTML = "";
  pokeApp.pokeCards = [];

  fetch(url)
    .then(function (data) {
      console.log(url);
      console.log(data);
      return data.json();
    })
    .then(function (results) {
      // for each loop

      console.log(results);
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
    const userSelection = document.querySelector("#difficulty").value;
    console.log(userSelection);

    if (userSelection === "6") {
      console.log("we in the 6");
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
    // pokeApp.ulEl.innerHTML = "";
  });
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
      // display message for players if they matched a card
      pokeApp.message.textContent = "It's a match!";
      pokeApp.message.classList.add("appear");

      // adds matched class and slows down the game so players don't spam click
      setTimeout(() => {
        flippedCards[0].classList.add("matched");
        flippedCards[1].classList.add("matched");
        pokeApp.counter = 0;
        pokeApp.checkGame();
      }, 1000);

      setTimeout(() => {
        pokeApp.message.classList.remove("appear");
      }, 1500);
    } else {
      setTimeout(() => {
        flippedCards.forEach((card) => {
          if (!card.className.includes("matched")) {
            console.log(pokeApp.choiceParent);
            // pokeApp.choiceParent.style.zIndex = "10";
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

pokeApp.checkGame = () => {
  const matchedCards = document.querySelectorAll(".matched");

  if (matchedCards.length === pokeApp.pokeCards.length) {
    pokeApp.message.textContent = "You win the game!";
    pokeApp.message.classList.add("appear");
    pokeApp.button.style.visibility = "visible";
  }
};

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

pokeApp.handleStartButtonClick = () => {
  console.log("clicked");
};

pokeApp.init = () => {
  // pokeApp.fetchData("5");
  pokeApp.events();
};

pokeApp.init();
