const pokeApp = {};

pokeApp.ulEl = document.querySelector(".displayPokemon");

pokeApp.pokeCards = [];
pokeApp.firstChoiceSelected = false;
pokeApp.matching = false;
pokeApp.counter = 0;

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

        pokeApp.addClickSetup();
      });
  });
};

pokeApp.checkMatch = () => {
  console.log("heading to check match");
  if (pokeApp.matching) {
    pokeApp.removeClickSetup();
    console.log("matching?");
  }

  if (
    pokeApp.firstChoiceSelected &&
    pokeApp.secondChoice.alt === pokeApp.firstChoice.alt
  ) {
    console.log("it's a match!");
    pokeApp.firstChoiceSelected = false;
    setTimeout(function () {
      pokeApp.firstChoice.remove();
      pokeApp.secondChoice.remove();
    }, 2000);
  } else {
    setTimeout(function () {
      pokeApp.cardImageOne.classList.toggle("hide");
      pokeApp.cardImageTwo.classList.toggle("hide");
    }, 2000);
    pokeApp.firstChoiceSelected = false;
  }
  pokeApp.matching = false;
};

pokeApp.addClickSetup = () => {
  pokeApp.newLi.addEventListener("click", function (e) {
    pokeApp.handleClick(e);
  });
};

pokeApp.removeClickSetup = () => {
  pokeApp.newLi.removeEventListener("click", pokeApp.handleClick());
};

pokeApp.handleClick = (e) => {
  //counter to keep trash of clicks

  pokeApp.counter++;
  if (pokeApp.counter <= 2) {
    if (!pokeApp.firstChoiceSelected) {
      console.log(e.target.parentNode.nextSibling.firstChild.alt);
      pokeApp.firstChoice = e.target.parentNode.nextSibling.firstChild;

      pokeApp.cardImageOne = e.target.parentNode;

      pokeApp.cardImageOne.classList.toggle("hide");

      pokeApp.firstChoiceSelected = true;
    } else {
      pokeApp.secondChoice = e.target.parentNode.nextSibling.firstChild;
      pokeApp.cardImageTwo = e.target.parentNode;
      pokeApp.cardImageTwo.classList.toggle("hide");
    }
    console.log(pokeApp.counter);
  } else {
    pokeApp.newLi.removeEventListener("click", pokeApp.handleClick);
  }

  if (
    pokeApp.firstChoice &&
    pokeApp.firstChoice !== e.target.parentNode.nextSibling.firstChild
  ) {
    pokeApp.checkMatch();
  } else {
    console.log("pick another card");
  }
};

pokeApp.init = () => {
  console.log("ready to go!");
  pokeApp.fetchData();

  console.log("the results");
};

pokeApp.init();
