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
        pokeApp.backDiv = document.createElement("div");
        pokeApp.frontDiv = document.createElement("div");

        pokeApp.frontDiv.classList.add("front");
        pokeApp.backDiv.classList.add("back");

        pokeApp.frontDiv.innerHTML = `<img src="./assets/back-card.png" draggable="false"/>`;
        pokeApp.backDiv.innerHTML = `<img src=${card.urlImg} alt=${card.name}>`;
        newLi.append(pokeApp.frontDiv, pokeApp.backDiv);
        pokeApp.ulEl.appendChild(newLi);

        newLi.addEventListener("click", function (e) {
          if (!pokeApp.firstChoiceSelected) {
            console.log(e.target.parentNode.nextSibling.firstChild.alt);
            pokeApp.firstChoice = e.target.parentNode.nextSibling.firstChild;

            pokeApp.cardImage = e.target.parentNode;

            pokeApp.cardImage.classList.add("hide");

            pokeApp.firstChoiceSelected = true;
          } else {
            pokeApp.secondChoice = e.target.parentNode.nextSibling.firstChild;

            pokeApp.cardImage.classList.add("hide");
          }

          if (
            pokeApp.firstChoice &&
            pokeApp.firstChoice !== e.target.parentNode.nextSibling.firstChild
          ) {
            pokeApp.checkMatch();
          } else {
            console.log("pick another card");
          }
        });
      });
  });
};

pokeApp.checkMatch = () => {
  console.log("heading to check match");

  if (
    pokeApp.firstChoiceSelected &&
    pokeApp.secondChoice.alt === pokeApp.firstChoice.alt
  ) {
    console.log("it's a match!");
    pokeApp.frontDiv.remove();
    pokeApp.backDiv.remove();
    pokeApp.firstChoiceSelected = false;
  } else {
    pokeApp.cardImage.classList.add("show");
  }
};

pokeApp.init = () => {
  console.log("ready to go!");
  pokeApp.fetchData();

  console.log("the results");
};

pokeApp.init();
