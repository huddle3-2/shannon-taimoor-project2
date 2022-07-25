// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  get,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBO-or17dlSQPyVbIa9RvZ6vwIXvHv_1G8",

  authDomain: "pokemonhighscore.firebaseapp.com",

  projectId: "pokemonhighscore",

  storageBucket: "pokemonhighscore.appspot.com",

  messagingSenderId: "694648099374",

  appId: "1:694648099374:web:1bed1e36794bdaa71d85bf",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

export default function storeInfo(tile, playerName, playerMoves) {
  console.log(tile, playerName, playerMoves);

  const userObj = {
    tile: {
      name: playerName,
      numberOfMoves: playerMoves,
    },
  };

  console.log(userObj);
  const firebaseObj = push(dbRef, userObj);
  console.log(firebaseObj);
}

// essentially we want to push an obj
// -- PLAYER NAME, HOW MANY MOVES
// -- push this into a property key depending on which tile they selected
