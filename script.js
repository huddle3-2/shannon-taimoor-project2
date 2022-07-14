const pokeApp = {};

pokeApp.ulEl = document.querySelector(".displayPokemon");

pokeApp.pokeCards = [];
pokeApp.firstChoiceSelected = false;

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
        const newLi = document.createElement("li");
        const backDiv = document.createElement("div");
        const frontDiv = document.createElement("div");

        frontDiv.classList.add("front");
        backDiv.classList.add("back");

        frontDiv.innerHTML = `<img src="./assets/back-card.png"/>`;
        backDiv.innerHTML = `<img src=${card.urlImg} alt=${card.name}>`;
        newLi.append(frontDiv, backDiv);
        pokeApp.ulEl.appendChild(newLi);

        newLi.addEventListener("click", function (e) {
          // console.log(e.target.alt);
          if (!pokeApp.firstChoiceSelected) {
            pokeApp.firstChoice = e.target;
            pokeApp.firstChoiceSelected = true;
          } else {
            pokeApp.secondChoice = e.target;
          }

          if (pokeApp.firstChoice && pokeApp.firstChoice !== e.target) {
            pokeApp.checkMatch();
          } else {
            console.log("pick another card");
          }

          // only remove if choice matches

          // pokeApp.firstChoice.display = "none";
          // console.log("clicked");
        });
      });
  });
};

pokeApp.checkMatch = () => {
  if (
    pokeApp.firstChoiceSelected &&
    pokeApp.secondChoice.alt === pokeApp.firstChoice.alt
  ) {
    pokeApp.firstChoice.remove();
    pokeApp.secondChoice.remove();
    pokeApp.firstChoiceSelected = false;
  }
};
// pokeApp.setupEventListener = function () {};

pokeApp.init = () => {
  console.log("ready to go!");
  pokeApp.fetchData();

  console.log("the results");
  // console.log(pokeApp.results);
};

pokeApp.init();
