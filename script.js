const pokeApp = {};

pokeApp.ulEl = document.querySelector(".displayPokemon");

pokeApp.pokeCards = [];
pokeApp.counter = 0;

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
    //adds to counter on click
    pokeApp.counter++;
    //check if target has class of front
    if (e.target.parentNode.className.includes("front")) {
      if (pokeApp.counter <= 2) {
        // put target parent into variable and add class of flipped
        const choiceParent = e.target.parentNode;
        const choice = e.target.parentNode.nextSibling.firstChild;
        choiceParent.classList.add("hide");
        choice.classList.add("flipped");
        pokeApp.checkMatch();
      }
    }

    console.log(pokeApp.counter);
  });
};

//Check match
pokeApp.checkMatch = () => {
  if (pokeApp.counter === 2) {
    const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
    if (flippedCards[0].alt === flippedCards[1].alt) {
      flippedCards[0].classList.add("matched");
      flippedCards[1].classList.add("matched");
    } else {
      setTimeout(() => {
        flippedCards.forEach((card) => {
          if (!card.className.includes("matched")) {
            card.classList.remove("flipped");
            card.parentElement.previousSibling.classList.remove("hide");
          }
        });
        pokeApp.counter = 0;
      }, 2000);
    }
  }
};

pokeApp.init = () => {
  pokeApp.fetchData();
};

pokeApp.init();
