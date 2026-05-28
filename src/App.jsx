import { useState } from "react";
import TaylorLesson from "./lessons/TaylorLesson";
import FourierHeatFlowExplorer from "./lessons/FourierHeatFlowExplorer";

export default function App() {
  const [activeLesson, setActiveLesson] = useState("taylor");

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

          <div className="flex gap-2">
            <button
              onClick={() => setActiveLesson("taylor")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeLesson === "taylor"
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              Taylor Approximation
            </button>

            <button
              onClick={() => setActiveLesson("fourier")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeLesson === "fourier"
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              Fourier Heat Flow
            </button>
          </div>
        </div>
      </nav>

      {activeLesson === "taylor" ? <TaylorLesson /> : <FourierHeatFlowExplorer />}
    </div>
  );
}