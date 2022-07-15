const pokeApp = {};

pokeApp.ulEl = document.querySelector(".displayPokemon");

pokeApp.pokeCards = [];
pokeApp.firstChoiceSelected = false;
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
    pokeApp.handleClick(e);
  });
};

// When user's click, execute line of code
pokeApp.handleClick = (e) => {
  //counter to keep trash of clicks

  // adds counter
  pokeApp.counter++;

  // If counter is less than or equal to two, grab the elements and store in variables
  if (pokeApp.counter <= 2) {
    // If first choice selected is false, grab the elements and store in variables
    if (!pokeApp.firstChoiceSelected) {
      pokeApp.firstChoice = e.target.parentNode.nextSibling.firstChild;

      // store card image parent variable into new variable
      pokeApp.cardImageOne = e.target.parentNode;
      console.log(pokeApp.cardImageOne);

      pokeApp.cardImageOne.classList.toggle("hide");

      pokeApp.firstChoiceSelected = true;
    } else {
      // ELSE, grab the elements and store in SECOND choice variables

      pokeApp.secondChoice = e.target.parentNode.nextSibling.firstChild;

      // store card image parent variable into new variable
      pokeApp.cardImageTwo = e.target.parentNode;
      console.log(pokeApp.cardImageTwo);

      pokeApp.cardImageTwo.classList.toggle("hide");
    }
    console.log(pokeApp.counter);
  } else {
    // if counter has reached two, remove event listener so users cannot click while we are checking if the two choices match
    pokeApp.newLi.removeEventListener("click", pokeApp.handleClick);
  }

  if (
    pokeApp.firstChoice &&
    pokeApp.firstChoice !== e.target.parentNode.nextSibling.firstChild
  ) {
    pokeApp.checkMatch();
  } else {
  }

  console.log("first choice");
  console.log(pokeApp.firstChoice.alt);
  console.log("second choice");
  console.log(pokeApp.secondChoice.alt);
  console.log(pokeApp.counter);
};

// checks Pokemon Match
pokeApp.checkMatch = () => {
  if (
    pokeApp.firstChoiceSelected &&
    pokeApp.secondChoice.alt === pokeApp.firstChoice.alt
  ) {
    // IF the Value of the First choice and second choice is the same, it will remove the image from the page

    setTimeout(function () {
      pokeApp.firstChoice.remove();
      pokeApp.secondChoice.remove();
      pokeApp.counter = 0;
      // reset first choice back to false
      pokeApp.firstChoiceSelected = false;
      pokeApp.firstChoice = "";
      pokeApp.secondChoice = "";
      console.log("first choice time out");
      console.log(pokeApp.firstChoice);
      console.log(pokeApp.secondChoice);
      pokeApp.addClickSetup();
    }, 2000);
  } else {
    // If value of first and second choice do NOT match, flip the cards back over
    setTimeout(function () {
      pokeApp.cardImageOne.classList.toggle("hide");
      pokeApp.cardImageTwo.classList.toggle("hide");
      pokeApp.counter = 0;
      // reset first choice back to false
      pokeApp.firstChoiceSelected = false;
      pokeApp.firstChoice = "";
      pokeApp.secondChoice = "";
      console.log(pokeApp.firstChoice);
      console.log(pokeApp.secondChoice);
      pokeApp.addClickSetup();
    }, 2000);
  }
};

pokeApp.init = () => {
  pokeApp.fetchData();
};

pokeApp.init();
