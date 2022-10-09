import React, { useState, useEffect } from "react";
import Suggestion from "./Suggestion";
import axios from "axios";

const Input = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = () => {
    setText("");
    setSuggestions([]);
  };

  useEffect(() => {
    if (text === "") {
      setSuggestions([]);
      return;
    }
    let sentence = text.split(".").slice(-1);
    console.log(sentence[0].split(" "));
    if (sentence[0].split(" ").length - 1 < 4) {
      setSuggestions([]);

      return;
    }
    // console.log("not return");
    axios
      .get("http://127.0.0.1:5000/suggest", {
        params: { sentence: sentence[0] },
      })
      .then((res) => {
        console.log(res.data);
        setSuggestions(res.data);
      })
      .catch((err) => console.log(err));
  }, [text]);

  return (
    <main>
      <div className="input">
        <h2>Suggestions:</h2>
        {suggestions.length === 0 ? (
          <h4>Type minimum 4 words in a sentence for suggestions</h4>
        ) : (
          <div className="suggestionWrapper">
            {suggestions.map((word, key) => {
              return (
                <div key={key}>
                  <Suggestion word={word} text={text} setText={setText} />
                </div>
              );
            })}
          </div>
        )}
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
