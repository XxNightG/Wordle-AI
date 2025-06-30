// Wordle AI 主页面 - 科技感风格 + Bug 修复版
import React, { useState } from 'react';
import './App.css';

const allWords = [
  "adieu", "angle", "apple", "alone", "arise", "alien", "aisle", "audio", "annex", "alert", // 可添加更多
];

function App() {
  const [tries, setTries] = useState([]); // [{ word, result }]
  const [currentWord, setCurrentWord] = useState("");
  const [currentResult, setCurrentResult] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleAddTry = () => {
    if (currentWord.length !== 5 || currentResult.length !== 5) return alert("Please enter 5-letter word and 5-letter result.");
    setTries([...tries, {
      word: currentWord.toLowerCase(),
      result: currentResult.toLowerCase(),
    }]);
    setCurrentWord("");
    setCurrentResult("");
  };

  const matchesFeedback = (word, guesses) => {
    for (const { word: guess, result } of guesses) {
      const seen = Array(5).fill(false);
      // First pass: Green check
      for (let i = 0; i < 5; i++) {
        if (result[i] === 'g' && word[i] !== guess[i]) return false;
        if (result[i] === 'g') seen[i] = true;
      }
      // Second pass: Yellow & Black check
      for (let i = 0; i < 5; i++) {
        if (result[i] === 'y') {
          if (word[i] === guess[i]) return false;
          if (!word.includes(guess[i])) return false;
        }
        if (result[i] === 'b') {
          const countInGuess = guess.split('').filter((ch, idx) => ch === guess[i] && result[idx] !== 'g' && idx !== i).length;
          const countInWord = word.split('').filter((ch, idx) => ch === guess[i] && idx !== i).length;
          if (word.includes(guess[i]) && countInWord > countInGuess) return false;
        }
      }
    }
    return true;
  };

  const handleSuggest = () => {
    const filtered = allWords.filter(word => matchesFeedback(word, tries));
    setSuggestions(filtered);
  };

  return (
    <div className="app">
      <h1 className="title">Wordle AI</h1>
      <div className="input-container">
        <input value={currentWord} maxLength={5} placeholder="Guess (e.g. adieu)" onChange={(e) => setCurrentWord(e.target.value)} />
        <input value={currentResult} maxLength={5} placeholder="Result (e.g. gbbyb)" onChange={(e) => setCurrentResult(e.target.value)} />
        <button onClick={handleAddTry}>Add Try</button>
        <button onClick={handleSuggest}>Suggest Word</button>
      </div>
      <div className="history">
        <h2>History:</h2>
        {tries.map((t, i) => (
          <div key={i}>{t.word.toUpperCase()} → {t.result.toUpperCase()}</div>
        ))}
      </div>
      <div className="suggestions">
        <h2>Suggestions:</h2>
        {suggestions.length > 0 ? (
          suggestions.map((s, i) => <div key={i}>{s.toUpperCase()}</div>)
        ) : (
          <p>No suggestions yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
