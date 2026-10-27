import { useEffect, useState } from "react";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1600;
const GAP_MS = 350;

/**
 * Cycles through `suggestions` with a typewriter effect and returns the
 * current text for use as an input placeholder. Pauses while `paused` is true
 * (e.g. when the user has typed something).
 */
export default function useTypewriterPlaceholder(suggestions, paused = false) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (paused || !suggestions.length) return;

    let index = 0;
    let count = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const word = suggestions[index];
      let delay;

      if (!deleting) {
        count += 1;
        delay = count === word.length ? HOLD_MS : TYPE_MS;
        if (count === word.length) deleting = true;
      } else {
        count -= 1;
        delay = DELETE_MS;
        if (count === 0) {
          deleting = false;
          index = (index + 1) % suggestions.length;
          delay = GAP_MS;
        }
      }

      setText(word.slice(0, count));
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, GAP_MS);
    return () => clearTimeout(timer);
  }, [suggestions, paused]);

  return text;
}
