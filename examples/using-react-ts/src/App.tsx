import React, { FormEvent, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import HanziWriterComponent from "./HanziWriterComponent";

function App() {
  const hanziWriterRef = useRef<HanziWriter>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [character, setCharacter] = useState("我");
  const [showCharacter, setShowCharacter] = useState(true);
  const [showOutline, setShowOutline] = useState(true);

  function onChangeCharacter(e: FormEvent) {
    e.preventDefault();
    console.log(e);
    const formData = new FormData(e.target as HTMLFormElement);
    setCharacter(formData.get("character") as string);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Character: {character}</h1>
      <form onSubmit={onChangeCharacter} style={{ marginBottom: "1rem" }}>
        <label>
          Character
          <input
            type="text"
            name="character"
            size={1}
            maxLength={1}
            placeholder={character}
          />
        </label>
        <button type="submit">Update</button>
      </form>
      <div style={{ border: "2px solid #000", width: 400, height: 400, margin: "auto" }}>
        <HanziWriterComponent
          ref={hanziWriterRef}
          char={character}
          quiz={{
            active: quizActive,
            options: {
              onComplete() {
                console.log("Quiz complete!");
              },
              onHighlightComplete() {
                console.log("Quiz animation complete!");
                setQuizActive(false);
              },
            },
          }}
          options={{
            showCharacter,
            showOutline,
          }}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setQuizActive(!quizActive)}>
          {quizActive ? "Stop quiz" : "Start quiz"}
        </button>

        <label>
          <input
            type="checkbox"
            onChange={() => setShowCharacter(!showCharacter)}
            checked={showCharacter}
          />
          Show character
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => setShowOutline(!showOutline)}
            checked={showOutline}
          />
          Show outline
        </label>
      </div>
    </div>
  );
}

export default App;
