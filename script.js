const pokeApp = {};

pokeApp.ulEl = document.querySelector(".displayPokemon");
pokeApp.message = document.querySelector(".message");
pokeApp.displayMoves = document.querySelector(".moves");

pokeApp.pokeCards = [];
pokeApp.counter = 0;
pokeApp.moves = 0;

// Fetch Pokemon Data using API, add url and name into an array
pokeApp.fetchData = () => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=5&offset=0")
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
      pokeApp.fetchImages(pokeApp.pokeCards);
      pokeApp.fetchImages(pokeApp.pokeCards);
    });
};

// fetch ANOTHER set of data using the URL we just received from the first API
pokeApp.fetchImages = function (pokeCards) {
  pokeCards.forEach((card) => {
    fetch(card.url)
      .then(function (data) {
        return data.json();
      })
      .then(function (result) {
        card.urlImg = result.sprites.front_default;
      })
      .then(function () {
        pokeApp.newLi = document.createElement("li");
        pokeApp.backDiv = document.createElement("div");
        pokeApp.frontDiv = document.createElement("div");

        pokeApp.frontDiv.classList.add("front");
        pokeApp.backDiv.classList.add("back");

        pokeApp.frontDiv.innerHTML = `<img src="./assets/back-card.png" draggable="false"/>`;
        pokeApp.backDiv.innerHTML = `<img src=${card.urlImg} alt=${card.name}>`;
        pokeApp.newLi.append(pokeApp.frontDiv, pokeApp.backDiv);
        pokeApp.ulEl.appendChild(pokeApp.newLi);

        // call function for eventListener
        pokeApp.addClickSetup();
      });
  });
};

// setup Event Listener
pokeApp.addClickSetup = () => {
  pokeApp.newLi.addEventListener("click", function (e) {
    //check if target has class of front
    if (e.target.parentNode.className.includes("front")) {
      pokeApp.counter++;

      if (pokeApp.counter <= 2) {
        // put target parent into variable and add class of flipped
        pokeApp.choiceParent = e.target.parentNode;
        pokeApp.choice = e.target.parentNode.nextSibling.firstChild;

        pokeApp.choiceParent.style.animation = "flip 1s linear";

        setTimeout(() => {
          pokeApp.choiceParent.classList.add("hide");
          pokeApp.choiceParent.style.zIndex = "0";
        }, 500);

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
        pokeApp.message.classList.remove("appear");
        pokeApp.checkGame();
      }, 1000);
    } else {
      setTimeout(() => {
        flippedCards.forEach((card) => {
          if (!card.className.includes("matched")) {
            console.log(pokeApp.choiceParent);
            // pokeApp.choiceParent.style.zIndex = "10";
            card.classList.remove("flipped");
            card.parentElement.previousSibling.classList.remove("hide");
            card.parentElement.previousSibling.style.zIndex = "10";
          }
        });
        pokeApp.counter = 0;
      }, 2000);
    }
  }
};

pokeApp.checkGame = () => {
  const matchedCards = document.querySelectorAll(".matched");

  if (matchedCards.length === pokeApp.pokeCards.length * 2) {
    pokeApp.message.textContent = "You win the game!";
    pokeApp.message.classList.add("appear");
  }
};

pokeApp.init = () => {
  pokeApp.fetchData();
};

pokeApp.init();
