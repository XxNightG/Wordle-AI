import React, { useState } from 'react'

const WORD_LIST = [
  "about", "angle", "apple", "audio", "beast", "bored", "clean", "crane",
  "drink", "eagle", "flame", "grape", "house", "input", "jelly", "kneel",
  "lemon", "mouse", "noble", "ocean", "piano", "queen", "river", "snake",
  "table", "ultra", "vocal", "whale", "xenon", "youth", "zebra"
]

function getMatchingWords(words, attempts) {
  return words.filter(word =>
    attempts.every(({ guess, feedback }) =>
      [...word].every((letter, i) => {
        if (feedback[i] === "g") return word[i] === guess[i]
        if (feedback[i] === "y") return word.includes(guess[i]) && word[i] !== guess[i]
        if (feedback[i] === "b") return !word.includes(guess[i]) || guess.filter((l, idx) => l === guess[i] && feedback[idx] !== "b").length < word.split(guess[i]).length
        return true
      })
    )
  )
}

export default function WordleHelper() {
  const [attempts, setAttempts] = useState([{ guess: "", feedback: "" }])
  const [suggestions, setSuggestions] = useState([])

  const update = (index, field, value) => {
    const copy = [...attempts]
    copy[index][field] = value.toLowerCase()
    setAttempts(copy)
  }

  const addAttempt = () => setAttempts([...attempts, { guess: "", feedback: "" }])

  const calculate = () => {
    const filtered = attempts.filter(a => a.guess.length === 5 && a.feedback.length === 5)
    setSuggestions(getMatchingWords(WORD_LIST, filtered))
  }

  return (
    <div>
      {attempts.map((a, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <input value={a.guess} onChange={e => update(i, "guess", e.target.value)} placeholder="Guess" maxLength={5} />
          <input value={a.feedback} onChange={e => update(i, "feedback", e.target.value)} placeholder="ggbyb" maxLength={5} />
        </div>
      ))}
      <button onClick={addAttempt}>+ Add Try</button>
      <button onClick={calculate}>🎯 Suggest Words</button>

      {suggestions.length > 0 && (
        <div>
          <h3>Suggestions:</h3>
          <ul>
            {suggestions.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
