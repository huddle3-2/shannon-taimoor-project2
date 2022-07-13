const pokeApp = {};

pokeApp.liEl = document.createElement("li");

pokeApp.ulEl = document.querySelector("ul");
console.log(pokeApp.ulEl);

pokeApp.pokeCards = [];

pokeApp.fetchData = () => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
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
    });
};

pokeApp.fetchImages = function (pokeCards) {
  pokeCards.forEach((card) => {
    fetch(card.url)
      .then(function (data) {
        return data.json();
      })
      .then(function (result) {
        console.log(result.sprites.front_default);
        card.urlImg = result.sprites.front_default;
      })
      .then(function () {
        const backDiv = document.createElement("div");

        backDiv.innerHTML = `<img src=${card.urlImg} alt=${card.name}/>`;
        pokeApp.ulEl.appendChild(backDiv);
      });
  });
};

pokeApp.displayImage = function () {
  console.log("it runs!");
  pokeApp.pokeCards.forEach((card) => {
    // const frontDiv = document.createElement("div");
  });
};

pokeApp.init = () => {
  console.log("ready to go!");
  pokeApp.fetchData();

  console.log("the results");
  // console.log(pokeApp.results);
};

pokeApp.init();
