import React, { useState } from 'react';
import './App.css';
import wordList from './words.json';

function App() {
  const [history, setHistory] = useState([]);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleAdd = () => {
    if (guess.length !== 5 || feedback.length !== 5) return;
    setHistory([...history, { guess: guess.toLowerCase(), feedback: feedback.toLowerCase() }]);
    setGuess('');
    setFeedback('');
  };

  const handleClear = () => {
    setHistory([]);
    setSuggestions([]);
  };

  const isWordValid = (word, history) => {
    for (const { guess, feedback } of history) {
      const used = Array(5).fill(false);

      // Check greens
      for (let i = 0; i < 5; i++) {
        if (feedback[i] === 'g' && word[i] !== guess[i]) return false;
      }

      // Check yellows
      for (let i = 0; i < 5; i++) {
        if (feedback[i] === 'y') {
          if (word[i] === guess[i]) return false;
          if (!word.includes(guess[i])) return false;
        }
      }

      // Check blacks (exclude letters not in the word)
      const greenYellowLetters = new Set();
      for (let i = 0; i < 5; i++) {
        if (feedback[i] === 'g' || feedback[i] === 'y') {
          greenYellowLetters.add(guess[i]);
        }
      }
      for (let i = 0; i < 5; i++) {
        if (feedback[i] === 'b' && !greenYellowLetters.has(guess[i])) {
          if (word.includes(guess[i])) return false;
        }
      }
    }
    return true;
  };

  const handleSuggest = () => {
    const filtered = wordList.filter((word) => isWordValid(word, history));
    setSuggestions(filtered.slice(0, 10));
  };

  return (
    <div className="app">
      <h1 className="title">Wordle AI 助手</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter guess (e.g. ADIEU)"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
        />
        <input
          type="text"
          placeholder="Enter feedback (e.g. GBYBB)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.toUpperCase())}
        />
        <button onClick={handleAdd}>Add Word</button>
        <button onClick={handleSuggest}>Suggest Word</button>
        <button onClick={handleClear}>Clear History</button>
      </div>

      <div className="history">
        <h2>History</h2>
        {history.map((item, idx) => (
          <div key={idx}>{item.guess.toUpperCase()} → {item.feedback.toUpperCase()}</div>
        ))}
      </div>

      <div className="suggestions">
        <h2>Suggestions</h2>
        {suggestions.map((word, idx) => (
          <div key={idx}>{word.toUpperCase()}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
