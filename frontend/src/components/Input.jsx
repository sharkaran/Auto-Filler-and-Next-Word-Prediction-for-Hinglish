import React, { useState, useEffect } from "react";
import Suggestion from "./Suggestion";

const Input = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([
    "accounts",
    "according",
    "aur",
    "se",
  ]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = () => {
    setText("");
  };

  useEffect(() => {
    let sentence = text.split(".").slice(-1);
    console.log(sentence);
  }, [text]);

  return (
    <main>
      <div className="input">
        <h2>Suggestions:</h2>
        <div className="suggestionWrapper">
          {suggestions.map((word, key) => {
            return (
              <div key={key}>
                <Suggestion word={word} text={text} setText={setText} />
              </div>
            );
          })}
        </div>
        <label htmlFor="inputText">
          <h2>Enter Hinglish Text:</h2>
        </label>
        {/* <p>{text}</p> */}
        <textarea
          id="inputText"
          name="inputText"
          rows="4"
          cols="50"
          placeholder="Type something..."
          value={text}
          onChange={handleChange}
        />
        <button className="clearBtn" onClick={handleClick}>
          CLEAR
        </button>
      </div>
    </main>
  );
};

export default Input;
