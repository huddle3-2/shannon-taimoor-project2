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
          if (!pokeApp.firstChoiceSelected) {
            console.log(e.target.parentNode.nextSibling.firstChild.alt);
            pokeApp.firstChoice =
              e.target.parentNode.nextSibling.firstChild.alt;
            e.target.parentNode.classList.add("hide");
            console.log(e);
            pokeApp.firstChoiceSelected = true;
          } else {
            pokeApp.secondChoice =
              e.target.parentNode.nextSibling.firstChild.alt;

            e.target.parentNode.classList.add("hide");
          }

          if (pokeApp.firstChoice && pokeApp.firstChoice !== e.target) {
            pokeApp.checkMatch();
          } else {
            console.log("pick another card");
          }
        });
      });
  });
};

// PSEUDO
// user clicks on the card (it will be an img)
// we have to find the parent class of the img, and find the corresponding sibling,
// if front card, then display:none or have flip card animation
// if

pokeApp.checkMatch = () => {
  // if (
  //   pokeApp.firstChoiceSelected &&
  //   pokeApp.secondChoice.alt === pokeApp.firstChoice.alt
  // ) {
  //   pokeApp.firstChoice.remove();
  //   pokeApp.secondChoice.remove();
  //   pokeApp.firstChoiceSelected = false;
  // }
};
// pokeApp.setupEventListener = function () {};

pokeApp.init = () => {
  console.log("ready to go!");
  pokeApp.fetchData();

  console.log("the results");
  // console.log(pokeApp.results);
};

pokeApp.init();
