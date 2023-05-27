import { useState, useEffect } from 'react';
import './App.css'
import SingleCard from './components/SingleCard';

// Array of objects
// Array of cards where each card item in the array points to a specific image source in public folder
// also we create this array outside of component because there are a constant and they are never need to change and also card array also won't get recreated every time when component is rendered
const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false }
]

function App() {

  // create a state to store our cards in for a particular game
  const [cards, setCards] = useState([]);

  // state variable for the turns, how many turns the user is taking to complete the game(which is increased after every turn)
  const [turns, setTurns] = useState(0);  

  // when choose two cards we compare the two cards to see if they match or not
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  // state for disabling the card, the disabled is either true or false, if a card which has a disabled prop is true then inside the card later on we prevent the card to be clicked 
  const [disabled, setDisabled] = useState(false)

  // shuffle card -> this function will do 3 things
  const shuffleCards = () => {

    // (i) take objects from line 7 to 12, duplicate them and put them all inside this new array
    const shuffledCards = [...cardImages, ...cardImages]

    // (ii) sort these images to mix and shuffle them basically randomize them
    .sort(() => Math.random()-0.5)       // sometimes this will be a negative number and sometimes positive, when negative the items will remain in same order, when positive it is going the swith the order around. So the end result is basically a shuffled array
    .map((card) => ({ ...card, id: Math.random() }))  // we fire a function for each item in a sorted array, each item is represented by argument card. And each time we added a property to a card the property which is already there is "src" but we also  added new property to each card is "id". (iii) task

    // if we start the game these two should be null
    setChoiceOne(null);
    setChoiceTwo(null);

    // update the state
    setCards(shuffledCards);  
    setTurns(0);  // every time we start a New Game by clicking on 'New Game' button we are going to call the function shuffleCards, which is going the shuffle the cards and set the cards  
  }

  // Handle a choice 
  const handleChoice = (card) => {
    // console.log(card);
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);

    // we do not compare the cards right here, then it probably won't work because these state updates are scheduled(they don't happen instantly), instead we use useEffect hook
  }
  
  // compare and evaluate 2 selected cards (useEffect is going to fire initially when component first mounts) once automatically and then it will fire the function again whenever dependency array changes (PS: both the dependency array should be changing)
  useEffect(() => {
    // check whether we have the value of choiceOne or choiceTwo
    if(choiceOne && choiceTwo) {
      setDisabled(true);  // after we selected two cards untill they both get verified and they both get flipped over we want to disabled click on the all other cards
      if(choiceOne.src === choiceTwo.src && choiceOne.id !== choiceTwo.id) {
        // console.log("Cards match");

        // set the matched property of the both the cards if they match (updating the card state), the function is taking the previous card state
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src) {
              // if they match, return a new object in which the match property is set 
              return {...card, matched:true}   // now it is going the return the new object instead the original card object in the array
            }
            else {
              // not match return card unchanged
              return card;     
            }
          })
        })
        resetTurn();
      }
      else {
        // console.log("Cards do not match");

        // we want a delay on reseting
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);
  
  // reset the choices and increase the turn, the function is going to fire after you done cards choice comparison
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns+1);
    setDisabled(false);
  }

  // automatically starts a new game when user comes to the page
  useEffect( () => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      {/* display the card in grid , inside this we are going to map card state*/}
      <div className="card-grid">
        {cards.map((card) => (        // return the template of card
          <SingleCard key={card.id} card={card} handleChoice={handleChoice} flipped={card === choiceOne || card === choiceTwo || card.matched} disabled={disabled}/>   // flipped property is either true or false. If true -> then only the card front is shows not the back, If false -> we only show back not front. There are three condition on which the card is flipped or not
        ))}
      </div>
      <p id="turns">Turns: {turns}</p>
    </div>
  );
}

export default App