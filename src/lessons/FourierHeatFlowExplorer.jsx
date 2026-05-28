import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2,
  Flame,
  HelpCircle,
  Layers,
  Map,
  RotateCcw,
  Sigma,
  Sparkles,
  ThermometerSun,
} from "lucide-react";

const PI = Math.PI;
const X_MAX = 4;
const Y_MIN = -PI / 2;
const Y_MAX = PI / 2;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function fourierTemperature(x, y, terms) {
  let sum = 0;

  for (let n = 0; n < terms; n += 1) {
    const odd = 2 * n + 1;
    const sign = n % 2 === 0 ? 1 : -1;
    const coefficient = (4 / PI) * (sign / odd);
    sum += coefficient * Math.exp(-odd * x) * Math.cos(odd * y);
  }

  return clamp(sum, 0, 1.2);
}

function heatColor(value) {
  const clamped = clamp(value, 0, 1);
  const hue = 220 - clamped * 210;
  const saturation = 84;
  const lightness = 30 + clamped * 42;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function formatNumber(value) {
  return Number(value).toFixed(2);
}

const unitOptions = {
  celsius: { label: "Celsius", symbol: "°C" },
  kelvin: { label: "Kelvin", symbol: "K" },
  fahrenheit: { label: "Fahrenheit", symbol: "°F" },
};

function convertTemperature(normalizedValue, unit) {
  const celsius = normalizedValue * 100;
  if (unit === "kelvin") return celsius + 273.15;
  if (unit === "fahrenheit") return (celsius * 9) / 5 + 32;
  return celsius;
}

function formatTemperature(normalizedValue, unit) {
  return `${convertTemperature(normalizedValue, unit).toFixed(1)} ${unitOptions[unit].symbol}`;
}

function nearlyEqual(a, b, tolerance = 0.001) {
  return Math.abs(a - b) <= tolerance;
}

function runSelfTests() {
  return [
    { name: "0 normalized temperature is 0 °C", passed: nearlyEqual(convertTemperature(0, "celsius"), 0) },
    { name: "1 normalized temperature is 100 °C", passed: nearlyEqual(convertTemperature(1, "celsius"), 100) },
    { name: "0 normalized temperature is 273.15 K", passed: nearlyEqual(convertTemperature(0, "kelvin"), 273.15) },
    { name: "1 normalized temperature is 212 °F", passed: nearlyEqual(convertTemperature(1, "fahrenheit"), 212) },
    { name: "Temperature stays finite at the hot center", passed: Number.isFinite(fourierTemperature(0, 0, 5)) },
    { name: "Cold side boundary is near zero", passed: fourierTemperature(1, PI / 2, 8) < 0.02 },
    { name: "Temperature is clamped to a nonnegative value", passed: fourierTemperature(0, PI / 2, 3) >= 0 },
    { name: "Temperature decreases away from the hot source", passed: fourierTemperature(0.2, 0, 5) > fourierTemperature(2.5, 0, 5) },
    { name: "Unknown unit falls back to Celsius math", passed: nearlyEqual(convertTemperature(0.5, "unknown"), 50) },
  ];
}

const quizQuestions = [
  {
    prompt: "In this steady-state model, the temperature no longer changes with time.",
    answer: true,
    explanation:
      "Correct. The time derivative disappears because this lesson models the final pattern after heat has settled into balance.",
  },
  {
    prompt: "The side boundaries are held at temperature 1.",
    answer: false,
    explanation:
      "Not here. The hot edge at x = 0 is held near temperature 1, while the two side boundaries at y = ±π/2 are held at 0.",
  },
  {
    prompt: "Higher-frequency Fourier terms fade faster as x increases.",
    answer: true,
    explanation:
      "Yes. The factor e^{-(2n+1)x} makes larger odd frequencies decay quickly as heat moves away from the source.",
  },
];

const panelClass = "rounded-2xl border border-stone-300 bg-amber-50 shadow-md";
const insetPanelClass = "rounded-xl border border-stone-300 bg-orange-50";

function Fraction({ numerator, denominator }) {
  return (
    <span className="inline-flex translate-y-1 flex-col items-center px-0.5 align-middle leading-none">
      <span className="border-b-2 border-current px-1 pb-0.5">{numerator}</span>
      <span className="px-1 pt-0.5 text-[0.72em]">{denominator}</span>
    </span>
  );
}

function SteadyStatePDE() {
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-2 font-serif text-2xl text-stone-900">
      <Fraction
        numerator={
          <>
            ∂<sup>2</sup>v
          </>
        }
        denominator={
          <>
            ∂x<sup>2</sup>
          </>
        }
      />
      <span>+</span>
      <Fraction
        numerator={
          <>
            ∂<sup>2</sup>v
          </>
        }
        denominator={
          <>
            ∂y<sup>2</sup>
          </>
        }
      />
      <span>=</span>
      <span>0</span>
    </span>
  );
}

function TermFormula({ terms }) {
  return (
    <div
      tabIndex={0}
      className="group relative rounded-2xl border border-stone-700 bg-slate-800 p-5 text-white shadow-md outline-none ring-offset-2 transition focus:ring-2 focus:ring-cyan-300"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-200">Fourier model</p>
          <div className="mt-3 overflow-x-auto pb-3 pt-3">
            <div className="flex min-w-max items-center gap-2 whitespace-nowrap font-serif text-base leading-none md:text-xl lg:text-2xl">
              <span>v(x,y) ≈</span>
              <span className="relative inline-flex items-center justify-center px-3 py-2">
                <span className="absolute -top-3 text-[10px] leading-none md:text-xs">{terms - 1}</span>
                <span className="text-4xl leading-none md:text-5xl">∑</span>
                <span className="absolute -bottom-3 text-[10px] leading-none md:text-xs">n = 0</span>
              </span>
              <Fraction
                numerator={
                  <>
                    4(-1)<sup>n</sup>
                  </>
                }
                denominator={
                  <>
                    π(2n+1)
                  </>
                }
              />
              <span>
                e<sup>-(2n+1)x</sup>
              </span>
              <span>cos((2n+1)y)</span>
            </div>
          </div>
        </div>
        <span className="rounded-md border border-cyan-200/40 bg-white/10 px-3 py-1 font-mono text-xs font-bold text-cyan-100">
          hover for derivation
        </span>
      </div>

      <div className="pointer-events-none absolute left-4 right-4 top-full z-30 mt-3 rounded-2xl border border-stone-300 bg-amber-50 p-5 text-stone-900 opacity-0 shadow-xl transition duration-200 group-hover:opacity-100 group-focus:opacity-100">
        <div className="flex items-center gap-2">
          <Sigma className="h-5 w-5 text-stone-700" />
          <h3 className="text-lg font-black">How this model is built</h3>
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-xl bg-stone-100 p-3">
            <p className="font-bold">1. Steady heat balance</p>
            <p className="mt-1 text-stone-700">At equilibrium, temperature stops changing with time, leaving a spatial balance equation.</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-3">
            <p className="font-bold">2. Separate x and y</p>
            <p className="mt-1 text-stone-700">Fourier looks for pieces shaped like F(x)f(y): decay in x and waves across y.</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-3">
            <p className="font-bold">3. Cold walls force cosines</p>
            <p className="mt-1 text-stone-700">The boundaries y = ±π/2 are matched by cos(y), cos(3y), cos(5y), and later odd terms.</p>
          </div>
          <div className="rounded-xl bg-fuchsia-50 p-3">
            <p className="font-bold">4. Coefficients rebuild the hot edge</p>
            <p className="mt-1 text-stone-700">The alternating coefficients combine the waves so the heated boundary is close to v = 1.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatMap({ terms, probeX, probeY, unit, onProbeChange }) {
  const columns = 34;
  const rows = 22;
  const cells = [];

  for (let row = 0; row < rows; row += 1) {
    const y = Y_MAX - (row / (rows - 1)) * (Y_MAX - Y_MIN);
    for (let col = 0; col < columns; col += 1) {
      const x = (col / (columns - 1)) * X_MAX;
      const temperature = fourierTemperature(x, y, terms);
      cells.push({ row, col, x, y, temperature });
    }
  }

  const probeLeft = `${(probeX / X_MAX) * 100}%`;
  const probeTop = `${((Y_MAX - probeY) / (Y_MAX - Y_MIN)) * 100}%`;

  function updateProbeFromPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const relativeY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    onProbeChange(relativeX * X_MAX, Y_MAX - relativeY * (Y_MAX - Y_MIN));
  }

  return (
    <div className="relative rounded-2xl border border-stone-300 bg-orange-50 p-4 shadow-inner">
      <div className="absolute bottom-4 left-4 top-4 w-2 rounded-md bg-gradient-to-b from-rose-600 via-orange-500 to-amber-300" />
      <div className="absolute left-8 top-5 rounded-md border border-rose-200 bg-amber-50 px-3 py-1 text-xs font-bold text-rose-900 shadow-sm">
        hot edge: x = 0
      </div>
      <div
        className="relative grid cursor-crosshair touch-none overflow-hidden rounded-xl border border-stone-300"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        onPointerDown={(event) => {
          updateProbeFromPointer(event);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) updateProbeFromPointer(event);
        }}
      >
        {cells.map((cell) => (
          <div
            key={`${cell.row}-${cell.col}`}
            title={`x=${formatNumber(cell.x)}, y=${formatNumber(cell.y)}, temperature=${formatTemperature(cell.temperature, unit)}`}
            className="aspect-square"
            style={{ backgroundColor: heatColor(cell.temperature) }}
          />
        ))}
        <motion.div
          animate={{ left: probeLeft, top: probeTop }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-slate-900 shadow-lg ring-4 ring-slate-950/20"
        />
        <motion.div
          animate={{ left: probeLeft, top: probeTop }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="pointer-events-none absolute -translate-x-1/2 translate-y-4 rounded-md bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow-lg"
        >
          probe
        </motion.div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-stone-600">
        <span>near heat source</span>
        <span>{unitOptions[unit].label}</span>
        <span>farther into the plate</span>
      </div>
    </div>
  );
}

function InteractiveParallelepiped({ terms, probeX, probeY, unit, onProbeChange }) {
  const width = 640;
  const height = 300;
  const left = 110;
  const right = 540;
  const top = 72;
  const bottom = 220;
  const depthX = 55;
  const depthY = -42;
  const probeLeft = left + (probeX / X_MAX) * (right - left);
  const probeTop = top + ((Y_MAX - probeY) / (Y_MAX - Y_MIN)) * (bottom - top);
  const probeTemp = fourierTemperature(probeX, probeY, terms);
  const sampleLines = Array.from({ length: 9 }, (_, index) => {
    const x = (index / 8) * X_MAX;
    const px = left + (x / X_MAX) * (right - left);
    return { x, px, centerTemp: fourierTemperature(x, 0, terms) };
  });

  function updateProbeFromSvgPointer(event) {
    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transform = svg.getScreenCTM();
    if (!transform) return;
    const svgPoint = point.matrixTransform(transform.inverse());
    const relativeX = clamp((svgPoint.x - left) / (right - left), 0, 1);
    const relativeY = clamp((svgPoint.y - top) / (bottom - top), 0, 1);
    onProbeChange(relativeX * X_MAX, Y_MAX - relativeY * (Y_MAX - Y_MIN));
  }

  return (
    <div className={insetPanelClass + " p-5 shadow-sm"}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold">Interactive parallelepiped model</h3>
          <p className="text-sm text-stone-600">Drag the probe across the solid to sample how heat fades from the hot face and drops toward the cold side walls.</p>
        </div>
        <div className="rounded-md border border-orange-200 bg-orange-100 px-3 py-1 text-sm font-bold text-orange-900">
          {formatTemperature(probeTemp, unit)}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 w-full cursor-crosshair touch-none rounded-xl border border-stone-300 bg-amber-50 shadow-inner"
        onPointerDown={(event) => {
          updateProbeFromSvgPointer(event);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) updateProbeFromSvgPointer(event);
        }}
      >
        <defs>
          <linearGradient id="heatDepth" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={heatColor(1)} />
            <stop offset="40%" stopColor={heatColor(0.45)} />
            <stop offset="100%" stopColor={heatColor(0.04)} />
          </linearGradient>
          <linearGradient id="topFace" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="rgb(125, 211, 252)" stopOpacity="0.45" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.18" />
          </filter>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
          </marker>
        </defs>

        <polygon points={`${left},${top} ${right},${top} ${right + depthX},${top + depthY} ${left + depthX},${top + depthY}`} fill="url(#topFace)" stroke="#78716c" strokeWidth="2" />
        <polygon points={`${right},${top} ${right},${bottom} ${right + depthX},${bottom + depthY} ${right + depthX},${top + depthY}`} fill="#dbeafe" opacity="0.85" stroke="#78716c" strokeWidth="2" />
        <rect x={left} y={top} width={right - left} height={bottom - top} rx="10" fill="url(#heatDepth)" stroke="#44403c" strokeWidth="2" filter="url(#softShadow)" />
        <rect x={left - 12} y={top} width="12" height={bottom - top} rx="6" fill="#ef4444" />

        <text x={left - 62} y={(top + bottom) / 2} fontSize="13" fontWeight="700" fill="#991b1b" transform={`rotate(-90 ${left - 62} ${(top + bottom) / 2})`}>
          hot source
        </text>
        <line x1={left} y1={top} x2={right} y2={top} stroke="#0284c7" strokeWidth="5" opacity="0.9" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="#0284c7" strokeWidth="5" opacity="0.9" />
        <text x={right - 130} y={top - 12} fontSize="13" fontWeight="700" fill="#0369a1">cold wall y = π/2</text>
        <text x={right - 130} y={bottom + 22} fontSize="13" fontWeight="700" fill="#0369a1">cold wall y = -π/2</text>

        {sampleLines.map((line) => (
          <g key={line.x} opacity="0.45">
            <line x1={line.px} y1={top} x2={line.px} y2={bottom} stroke="#ffffff" strokeWidth="2" />
            <circle cx={line.px} cy={(top + bottom) / 2} r="4" fill={heatColor(line.centerTemp)} stroke="#fff" />
          </g>
        ))}

        {[0.65, 1.45, 2.25].map((arrowX, index) => {
          const startX = left + (arrowX / X_MAX) * (right - left);
          return (
            <motion.line
              key={arrowX}
              x1={startX}
              y1={top + 36 + index * 32}
              x2={startX + 62}
              y2={top + 36 + index * 32}
              stroke="#334155"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.25 }}
            />
          );
        })}

        <motion.g animate={{ x: probeLeft, y: probeTop }} transition={{ type: "spring", stiffness: 500, damping: 35 }}>
          <circle r="12" fill="#0f172a" stroke="#ffffff" strokeWidth="5" />
          <circle r="20" fill="none" stroke="#0f172a" strokeOpacity="0.18" strokeWidth="6" />
          <text x="18" y="5" fontSize="13" fontWeight="800" fill="#0f172a">probe</text>
        </motion.g>

        <text x={left} y={bottom + 48} fontSize="13" fill="#57534e">x = 0</text>
        <text x={right - 30} y={bottom + 48} fontSize="13" fill="#57534e">x = {X_MAX}</text>
        <text x={(left + right) / 2 - 70} y={bottom + 48} fontSize="13" fill="#57534e">distance from heat source</text>
      </svg>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">Probe x</p><p className="font-bold">{probeX.toFixed(2)}</p></div>
        <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">Probe y</p><p className="font-bold">{probeY.toFixed(2)}</p></div>
        <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">Temperature</p><p className="font-bold">{formatTemperature(probeTemp, unit)}</p></div>
      </div>
    </div>
  );
}

function SelfTestCard({ tests }) {
  const passedCount = tests.filter((test) => test.passed).length;
  const allPassed = passedCount === tests.length;

  return (
    <div className={`mt-5 rounded-xl p-4 text-sm ${allPassed ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
      <p className="font-bold">Model helper self-tests: {allPassed ? "passing" : "needs attention"}</p>
      <p className="mt-1">{passedCount}/{tests.length} checks passed.</p>
    </div>
  );
}

export default function FourierHeatFlowExplorer() {
  const [terms, setTerms] = useState(3);
  const [probeX, setProbeX] = useState(0.8);
  const [probeY, setProbeY] = useState(0);
  const [unit, setUnit] = useState("celsius");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizResult, setQuizResult] = useState(null);

  const probeTemp = useMemo(() => fourierTemperature(probeX, probeY, terms), [probeX, probeY, terms]);
  const currentQuiz = quizQuestions[quizIndex];
  const selfTests = useMemo(() => runSelfTests(), []);

  function answerQuiz(value) {
    setQuizResult(value === currentQuiz.answer);
  }

  function nextQuiz() {
    setQuizIndex((quizIndex + 1) % quizQuestions.length);
    setQuizResult(null);
  }

  function updateProbe(nextX, nextY) {
    setProbeX(nextX);
    setProbeY(nextY);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-amber-100 p-4 text-stone-950 md:p-8">
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute left-0 top-0 h-full w-16 border-r border-red-300 bg-red-100" />
        <div className="absolute left-20 top-0 h-full w-px bg-stone-400" />
        <div className="absolute bottom-8 right-8 h-28 w-28 rotate-6 border border-stone-400" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-6">
        <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-stone-400 bg-amber-50 p-6 shadow-md">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border border-stone-800 bg-yellow-100 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-stone-900 shadow-sm">
                <Sparkles className="h-4 w-4" /> Fourier field note
              </div>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl font-black leading-tight tracking-tight text-stone-950 md:text-6xl">How does heat spread through a plate?</h1>
              <p className="mt-4 max-w-3xl border-l-4 border-orange-700 pl-4 font-serif text-lg leading-8 text-stone-700">
                A small mathematical laboratory for Fourier's steady-state heat model: a heated edge, cold side walls, and a temperature field reconstructed from fading cosine waves.
              </p>
            </div>
            <motion.div initial={{ scale: 0.9, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15 }} className="rotate-1 rounded-xl border border-stone-700 bg-slate-800 p-5 text-white shadow-md">
              <Flame className="h-10 w-10 text-orange-300" />
              <p className="mt-4 font-mono text-xs uppercase tracking-wide text-orange-100">Notebook prompt</p>
              <p className="mt-1 max-w-56 font-serif text-xl font-bold">Use waves to reconstruct a heat pattern.</p>
            </motion.div>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className={panelClass + " overflow-hidden lg:col-span-2"}>
            <CardContent className="p-0">
              <div className="border-b border-stone-700 bg-slate-800 p-5 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-orange-200"><Map className="h-4 w-4" /> Plate experiment</div>
                    <h2 className="mt-1 text-2xl font-bold">Steady-state temperature field</h2>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm">
                    <p className="text-slate-300">Temperature at probe</p>
                    <p className="mt-1 text-3xl font-black text-white">{formatTemperature(probeTemp, unit)}</p>
                    <p className="mt-1 text-xs text-slate-300">normalized v = {probeTemp.toFixed(3)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <TermFormula terms={terms} />

                <div className={insetPanelClass + " mt-5 p-5 shadow-sm"}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold">Temperature scale</h3>
                      <p className="text-sm text-stone-600">The math uses normalized temperature v from 0 to 1. Choose a display scale below.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(unitOptions).map(([key, option]) => (
                        <Button key={key} variant={unit === key ? "default" : "outline"} className="rounded-md" onClick={() => setUnit(key)}>{option.symbol}</Button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">Cold side walls</p><p className="font-bold">{formatTemperature(0, unit)}</p></div>
                    <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">Hot edge</p><p className="font-bold">{formatTemperature(1, unit)}</p></div>
                    <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">Probe</p><p className="font-bold">{formatTemperature(probeTemp, unit)}</p></div>
                  </div>
                </div>

                <div className="mt-5">
                  <HeatMap terms={terms} probeX={probeX} probeY={probeY} unit={unit} onProbeChange={updateProbe} />
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className={insetPanelClass + " p-5 shadow-sm"}>
                    <div className="flex items-center justify-between">
                      <label className="font-bold">Fourier terms</label>
                      <span className="rounded-md bg-slate-800 px-3 py-1 text-sm font-bold text-white">{terms} terms</span>
                    </div>
                    <Slider value={[terms]} min={1} max={15} step={1} onValueChange={(value) => setTerms(value[0])} className="mt-5" />
                    <p className="mt-3 text-sm text-stone-600">More terms sharpen the hot boundary pattern at x = 0, while higher-frequency waves fade quickly as x increases.</p>
                  </div>

                  <div className={insetPanelClass + " p-5 shadow-sm"}>
                    <div className="flex items-center justify-between gap-3">
                      <label className="font-bold">Drag the heat probe</label>
                      <span className="rounded-md bg-orange-100 px-3 py-1 text-sm font-bold text-orange-900">x={probeX.toFixed(2)}, y={probeY.toFixed(2)}</span>
                    </div>
                    <p className="mt-3 text-sm text-stone-600">Click or drag directly on the heat map or parallelepiped to sample the temperature at different points in the plate.</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">x</p><p className="font-bold">{probeX.toFixed(2)}</p></div>
                      <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">y</p><p className="font-bold">{probeY.toFixed(2)}</p></div>
                      <div className="rounded-xl border border-stone-200 bg-amber-50 p-3"><p className="text-stone-500">Temp.</p><p className="font-bold">{formatTemperature(probeTemp, unit)}</p></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <InteractiveParallelepiped terms={terms} probeX={probeX} probeY={probeY} unit={unit} onProbeChange={updateProbe} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className={panelClass}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2"><Layers className="h-5 w-5 text-orange-600" /><h2 className="font-serif text-2xl font-bold">Reading the model</h2></div>
                <div className="mt-5 space-y-3">
                  {[
                    "The hot boundary at x = 0 starts near temperature 1.",
                    "The side walls at y = ±π/2 stay cold, so the temperature drops to 0 there.",
                    "Odd cosine waves fit those side boundaries naturally.",
                    "The exponential factor makes heat fade as it moves away from the source.",
                  ].map((item, index) => (
                    <motion.div key={item} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="rounded-xl bg-orange-50 p-4">
                      <p className="font-mono text-xs font-black text-stone-500">NOTE {index + 1}</p>
                      <p className="mt-1 text-sm text-stone-700">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card tabIndex={0} className={panelClass + " group outline-none ring-offset-2 transition focus:ring-2 focus:ring-rose-300"}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2"><ThermometerSun className="h-5 w-5 text-rose-600" /><h2 className="font-serif text-2xl font-bold">Boundary conditions</h2></div>
                <div className="mt-4 space-y-3 text-sm text-stone-700">
                  <p className="rounded-xl bg-rose-50 p-3"><strong>x = 0:</strong> the heat source keeps the base warm.</p>
                  <p className="rounded-xl bg-sky-50 p-3"><strong>y = ±π/2:</strong> the side walls stay cold.</p>
                  <p className="rounded-xl bg-orange-50 p-3"><strong>x → ∞:</strong> heat fades away from the source.</p>
                </div>
                <div className="mt-4 max-h-0 overflow-hidden rounded-xl border border-rose-100 bg-amber-50 text-stone-900 opacity-0 transition-all duration-300 group-hover:max-h-[650px] group-hover:p-5 group-hover:opacity-100 group-focus:max-h-[650px] group-focus:p-5 group-focus:opacity-100">
                  <h3 className="font-serif text-lg font-black">What are boundary conditions?</h3>
                  <p className="mt-3 text-sm text-stone-700">A partial differential equation gives a rule inside a region. Boundary conditions state what happens along the edges, selecting the physically meaningful solution from many possible ones.</p>
                  <div className="mt-4 space-y-3 text-sm">
                    <p className="rounded-xl bg-rose-50 p-3"><strong>Hot boundary:</strong> x = 0 tells the model where heat enters.</p>
                    <p className="rounded-xl bg-sky-50 p-3"><strong>Cold boundaries:</strong> y = ±π/2 forces zero temperature at the side walls.</p>
                    <p className="rounded-xl bg-orange-50 p-3"><strong>Far field:</strong> x → ∞ rules out growing exponential terms.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={panelClass}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2"><Sigma className="h-5 w-5 text-stone-700" /><h2 className="font-serif text-2xl font-bold">Derivation sketch</h2></div>
                <div className="mt-4 space-y-3 text-sm text-stone-700">
                  <p className="rounded-xl bg-orange-50 p-3">At steady state, temperature stops changing with time, so the time-change term becomes 0.</p>
                  <p className="rounded-xl bg-orange-50 p-3">Every slice in the z-direction is treated the same, so the z-term is omitted.</p>
                  <div className="rounded-xl bg-cyan-50 p-4 text-center"><SteadyStatePDE /></div>
                  <p className="rounded-xl bg-fuchsia-50 p-3">Separated solutions combine exponential decay in x with cosine waves in y. The cold side walls force odd frequencies.</p>
                </div>
              </CardContent>
            </Card>

            <Card className={panelClass}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-fuchsia-600" /><h2 className="font-serif text-2xl font-bold">Quick check</h2></div>
                <p className="mt-4 text-stone-700">{currentQuiz.prompt}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button className="rounded-md" onClick={() => answerQuiz(true)}>True</Button>
                  <Button className="rounded-md" variant="outline" onClick={() => answerQuiz(false)}>False</Button>
                </div>
                {quizResult !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-orange-50 p-4">
                    <div className="flex items-center gap-2 font-bold">
                      {quizResult ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <RotateCcw className="h-5 w-5 text-amber-600" />}
                      {quizResult ? "Nice reasoning." : "Revise the model."}
                    </div>
                    <p className="mt-2 text-sm text-stone-700">{currentQuiz.explanation}</p>
                    <Button variant="ghost" className="mt-3 rounded-md" onClick={nextQuiz}>Next question</Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className={panelClass}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2"><Sigma className="h-6 w-6 text-stone-700" /><h2 className="font-serif text-2xl font-bold">Design notes</h2></div>
            <div className="mt-4 grid gap-4 text-stone-700 md:grid-cols-3">
              <div className="rounded-xl bg-orange-50 p-5"><h3 className="font-bold text-orange-950">From boundary to model</h3><p className="mt-2 text-sm">The lesson starts with physical constraints, then shows how the series is shaped by them.</p></div>
              <div className="rounded-xl bg-cyan-50 p-5"><h3 className="font-bold text-cyan-950">Visual PDE intuition</h3><p className="mt-2 text-sm">The heat map makes the steady-state equation feel like a balance rule instead of a symbolic abstraction.</p></div>
              <div className="rounded-xl bg-fuchsia-50 p-5"><h3 className="font-bold text-fuchsia-950">Series as construction</h3><p className="mt-2 text-sm">The term slider lets learners see how a Fourier series builds a shape out of simpler wave components.</p></div>
            </div>
            <SelfTestCard tests={selfTests} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
