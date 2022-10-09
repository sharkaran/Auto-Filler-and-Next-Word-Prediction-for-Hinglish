import React from "react";

const Suggestion = ({ word, text, setText }) => {
  const handleClick = () => {
    if (text.slice(-1) === " ") {
      setText(text + word + " ");
    } else {
      let lastSpace = text.lastIndexOf(" ");
      setText(text.substring(0, lastSpace) + " " + word + " ");
    }
  };
  return (
    <button className="suggestionBtn" onClick={handleClick}>
      {word}
    </button>
  );
};

export default Suggestion;
