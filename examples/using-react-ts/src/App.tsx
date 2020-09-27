import React, { FormEvent, useEffect, useRef, useState } from "react";
import HanziWriter, { ColorOptions, QuizOptions } from "hanzi-writer";
import HanziWriterComponent from "./HanziWriterComponent";
import { useCurrentRef } from "./hooks";

export default function App() {
  const hanziWriterRef = useRef<HanziWriter>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [character, setCharacter] = useState("我");
  const [showCharacter, setShowCharacter] = useState(true);
  const [showOutline, setShowOutline] = useState(true);
  const [showHintAfterMisses, setShowHintAfterMisses] = useState(3);
  const [numMistakesOnStroke, setNumMistakesOnStroke] = useState(0);
  const [colorOptions, setColorOptions] = useState({
    strokeColor: "#555555",
    radicalColor: null,
    highlightColor: "#aaaaff",
    outlineColor: "#DDDDDD",
    drawingColor: "#333333",
    highlightCompleteColor: null,
  } as ColorOptions);

  useQuiz(hanziWriterRef, quizActive, {
    showHintAfterMisses,
    onMistake(strokeData) {
      setNumMistakesOnStroke(strokeData.mistakesOnStroke);
      console.log("[useQuiz].onMistake", strokeData);
    },
    onCorrectStroke(strokeData) {
      setNumMistakesOnStroke(strokeData.mistakesOnStroke);
      console.log("[useQuiz].onCorrectStroke", strokeData);
    },
    onComplete(summary) {
      // Note: If you don't want to see the highlight, you can set "quizActive" to false here
      console.log("[useQuiz].onComplete", summary);
    },
    onHighlightComplete(summary) {
      console.log("[useQuiz].onHighlightComplete", summary);
      setQuizActive(false);
    },
  });

  function onChangeCharacter(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setCharacter(formData.get("character") as string);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Hanzi Writer</h1>
      <form
        onSubmit={onChangeCharacter}
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label style={{ margin: 0 }}>
          Character
          <input
            type="text"
            name="character"
            size={1}
            maxLength={1}
            placeholder={character}
            style={{ margin: "0 5px" }}
          />
        </label>
        <button type="submit" disabled={quizActive}>
          Update
        </button>
      </form>
      <div style={{ border: "2px solid #000", width: 300, height: 300, margin: "auto" }}>
        <HanziWriterComponent
          ref={hanziWriterRef}
          char={character}
          width={300}
          height={300}
          showCharacter={showCharacter}
          showOutline={showOutline}
          {...colorOptions}
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
            disabled={quizActive}
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

        <label>
          [Quiz] Show hint after
          <input
            type="number"
            min={0}
            style={{ width: 30, margin: "0 5px" }}
            value={showHintAfterMisses}
            disabled={quizActive}
            onChange={(e) => setShowHintAfterMisses(Number(e.target.value))}
          />
          misses ({numMistakesOnStroke}/{showHintAfterMisses})
        </label>

        <h3>Color options</h3>

        {Object.keys(colorOptions).map((key) => {
          return (
            <form
              key={key}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const value = formData.get("color") as string;
                setColorOptions((currentState) => ({
                  ...currentState,
                  [key]: value,
                }));
              }}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <label>
                {key}
                <input
                  type="color"
                  name="color"
                  style={{ margin: "0 5px" }}
                  defaultValue={colorOptions[key as keyof ColorOptions] ?? "#000000"}
                />
              </label>
              <button>Update</button>
            </form>
          );
        })}
      </div>
    </div>
  );
}

function useQuiz(
  /** Ref object that contains the Hanzi Writer class */
  hanziWriterRef: React.RefObject<HanziWriter>,
  /** Whether the quiz is active or not */
  active: boolean,
  /** Quiz options */
  options: Partial<QuizOptions>,
) {
  const quizOptionsRef = useCurrentRef(options);

  useEffect(() => {
    if (!active) {
      if (hanziWriterRef.current?._quiz) {
        hanziWriterRef.current?.cancelQuiz({
          resetDisplay: true,
        });
      }
      return;
    }

    hanziWriterRef.current?.quiz({
      ...quizOptionsRef.current,
      onComplete(summary) {
        // Calling .current will make sure that we're using a non-stale reference on quizOptions.
        quizOptionsRef.current.onComplete?.(summary);
      },
      onCorrectStroke(strokeData) {
        quizOptionsRef.current.onCorrectStroke?.(strokeData);
      },
      onMistake(strokeData) {
        quizOptionsRef.current.onMistake?.(strokeData);
      },
      onHighlightComplete(summary) {
        hanziWriterRef.current?.cancelQuiz({
          resetDisplay: true,
        });
        quizOptionsRef.current.onHighlightComplete?.(summary);
      },
    });
  }, [active, hanziWriterRef, quizOptionsRef]);
}
