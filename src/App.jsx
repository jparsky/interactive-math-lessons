import { useEffect, useState } from "react";
import TaylorLesson from "./lessons/TaylorLesson.jsx";
import FourierHeatFlowExplorer from "./lessons/FourierHeatFlowExplorer.jsx";
import DiceProbabilityLesson from "./lessons/DiceProbabilityLesson.jsx";

function getInitialLesson() {
  const hash = window.location.hash.replace("#", "");

  if (hash === "probability") return "dice";
  if (hash === "dice") return "dice";
  if (hash === "fourier") return "fourier";
  if (hash === "taylor") return "taylor";

  return "taylor";
}

function updateHashForLesson(lesson) {
  if (lesson === "dice") {
    window.location.hash = "probability";
    return;
  }

  window.location.hash = lesson;
}

export default function App() {
  const [activeLesson, setActiveLesson] = useState(getInitialLesson);

  useEffect(() => {
    function handleHashChange() {
      setActiveLesson(getInitialLesson());
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function changeLesson(lesson) {
    setActiveLesson(lesson);
    updateHashForLesson(lesson);
  }

  return (
    <div>
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Jake Parsky
            </p>
            <h1 className="text-xl font-black text-slate-950">
              Interactive Math Learning Samples
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => changeLesson("taylor")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeLesson === "taylor"
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              Taylor
            </button>

            <button
              onClick={() => changeLesson("fourier")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeLesson === "fourier"
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              Fourier
            </button>

            <button
              onClick={() => changeLesson("dice")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeLesson === "dice"
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              Probability Quest
            </button>
          </div>
        </div>
      </nav>

      {activeLesson === "taylor" && <TaylorLesson />}
      {activeLesson === "fourier" && <FourierHeatFlowExplorer />}
      {activeLesson === "dice" && <DiceProbabilityLesson />}
    </div>
  );
}