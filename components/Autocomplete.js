import {useState} from "react";
import Toast from '../components/Toast'
import './Autocomplete.module.css'

/** 
 * This code is inspired from https://codesandbox.io/s/long-wave-0tgqs
 */


const AutoComplete = ({getSuggestions}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(undefined);

  const onChange = async (e) => {
    const userInput = e.target.value;
    setInput(e.target.value);

    if (userInput == "") {
      setSuggestions([])
      setShowSuggestions(false);
      return
    }

    const request = await getSuggestions(userInput);
    if (request.error) {
      setError("Impossible de rechercher votre adresse !")
      setSuggestions([])
      setShowSuggestions(false);
    } else {
      console.log("results", request.results)
      setSuggestions(request.results || [])
      setActiveSuggestionIndex(0);
      setShowSuggestions(true);
    }
  };

  const onClick = (e) => {
    setSuggestions([]);
    setInput(e.target.innerText);
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
  };

  const onKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      setInput(suggestions[activeSuggestionIndex].label);
      setActiveSuggestionIndex(0);
      setShowSuggestions(false);
    }

    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestionIndex === 0) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    }

    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestionIndex - 1 === suggestions.length) {
        return;
      }

      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  const SuggestionsListComponent = () => {
    return suggestions.length ? (
      <ul className="suggestions">
        {suggestions.map((suggestion, index) => {
          let className;

          // Flag the active suggestion with a class
          if (index === activeSuggestionIndex) {
            className = "suggestion-active";
          }

          return (
            <li className={className} key={index} onClick={onClick}>
              {suggestion.label}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="no-suggestions">
        <span role="img" aria-label="tear emoji">
          😪
        </span>{" "}
        <em>Aucun résultat...</em>
      </div>
    );
  };

  return (
    <>
      {error ? <Toast message={error} success={false} /> : null}

      <input
        type="text"
        className="auto-complete"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={input}
      />
      {showSuggestions && input && <SuggestionsListComponent />}
    </>
  );
};

export default AutoComplete;

