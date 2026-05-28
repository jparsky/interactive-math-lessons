import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2,
  FunctionSquare,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Target,
  Waves,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function factorial(n) {
  if (n <= 1) return 1;
  let product = 1;
  for (let i = 2; i <= n; i += 1) product *= i;
  return product;
}

function taylorSin(x, terms) {
  let sum = 0;
  for (let k = 0; k < terms; k += 1) {
    const sign = k % 2 === 0 ? 1 : -1;
    const power = 2 * k + 1;
    sum += (sign * Math.pow(x, power)) / factorial(power);
  }
  return sum;
}

function taylorCos(x, terms) {
  let sum = 0;
  for (let k = 0; k < terms; k += 1) {
    const sign = k % 2 === 0 ? 1 : -1;
    const power = 2 * k;
    sum += (sign * Math.pow(x, power)) / factorial(power);
  }
  return sum;
}

function taylorExp(x, terms) {
  let sum = 0;
  for (let k = 0; k < terms; k += 1) {
    sum += Math.pow(x, k) / factorial(k);
  }
  return sum;
}

function taylorGeometric(x, terms) {
  let sum = 0;
  for (let k = 0; k < terms; k += 1) {
    sum += Math.pow(x, k);
  }
  return sum;
}

const functionLibrary = {
  sin: {
    id: "sin",
    shortName: "sin(x)",
    title: "Can a polynomial learn to move like a wave?",
    mission: "Build a better wave using only powers of x.",
    actualLabel: "true sin(x)",
    approxLabel: "polynomial model",
    actual: Math.sin,
    approx: taylorSin,
    domain: [-3.14, 3.14],
    yDomain: [-1.5, 1.5],
    startX: 1.5,
    equations: {
      1: "x",
      2: "x - x^3/3!",
      3: "x - x^3/3! + x^5/5!",
      4: "x - x^3/3! + x^5/5! - x^7/7!",
      5: "x - x^3/3! + x^5/5! - x^7/7! + x^9/9!",
    },
    insight:
      "Near x = 0, sin(x) behaves like x. The extra terms bend the line into a wave while keeping the model polynomial-based.",
    missions: [
      "Start with the simplest guess: sin(x) is close to x near zero.",
      "Add a correction term. Watch the edges bend closer to the wave.",
      "Test a point far from zero. Does the approximation still behave?",
      "Use the error value to decide whether more terms are needed.",
    ],
  },
  cos: {
    id: "cos",
    shortName: "cos(x)",
    title: "How can a polynomial start at the top?",
    mission: "Approximate a curve that begins at 1 instead of 0.",
    actualLabel: "true cos(x)",
    approxLabel: "polynomial model",
    actual: Math.cos,
    approx: taylorCos,
    domain: [-3.14, 3.14],
    yDomain: [-1.5, 1.5],
    startX: 1.5,
    equations: {
      1: "1",
      2: "1 - x^2/2!",
      3: "1 - x^2/2! + x^4/4!",
      4: "1 - x^2/2! + x^4/4! - x^6/6!",
      5: "1 - x^2/2! + x^4/4! - x^6/6! + x^8/8!",
    },
    insight:
      "Cosine starts at 1, so its first approximation is a flat line. The later even-powered terms create the curve.",
    missions: [
      "Start with the simplest guess: cos(x) is close to 1 near zero.",
      "Add a squared term. Why does the graph bend downward on both sides?",
      "Move away from zero and watch the error grow.",
      "Use more terms to repair the model.",
    ],
  },
  exp: {
    id: "exp",
    shortName: "e^x",
    title: "Can repeated small corrections create growth?",
    mission: "Model exponential growth one polynomial term at a time.",
    actualLabel: "true e^x",
    approxLabel: "polynomial model",
    actual: Math.exp,
    approx: taylorExp,
    domain: [-2, 2],
    yDomain: [-0.5, 7.5],
    startX: 1,
    equations: {
      1: "1",
      2: "1 + x",
      3: "1 + x + x^2/2!",
      4: "1 + x + x^2/2! + x^3/3!",
      5: "1 + x + x^2/2! + x^3/3! + x^4/4!",
    },
    insight:
      "The exponential function is built from a steady stack of positive correction terms. Each term adds a little more growth.",
    missions: [
      "Start with the roughest guess: e^x is close to 1 near zero.",
      "Add x. Where does the line help most?",
      "Add more positive terms and watch the right side rise.",
      "Compare the error for negative x and positive x.",
    ],
  },
  geometric: {
    id: "geometric",
    shortName: "1/(1-x)",
    title: "When does a polynomial approximation break?",
    mission: "Explore a model that only behaves well inside a safe zone.",
    actualLabel: "true 1/(1-x)",
    approxLabel: "polynomial model",
    actual: (x) => 1 / (1 - x),
    approx: taylorGeometric,
    domain: [-0.9, 0.9],
    yDomain: [-1, 10],
    startX: 0.5,
    equations: {
      1: "1",
      2: "1 + x",
      3: "1 + x + x^2",
      4: "1 + x + x^2 + x^3",
      5: "1 + x + x^2 + x^3 + x^4",
    },
    insight:
      "This approximation works when |x| < 1. As x gets close to 1, the true function shoots upward and the polynomial struggles to keep up.",
    missions: [
      "Start with 1 as the simplest guess.",
      "Add powers of x and watch the approximation improve.",
      "Move toward x = 1. What happens to the true function?",
      "Notice that some approximations have a limited safe zone.",
    ],
  },
};

const misconceptions = [
  {
    prompt: "A Taylor approximation is usually best near the point where it is centered.",
    answer: true,
    explanation:
      "Correct. These examples are centered at x = 0, so they are usually most accurate near 0 and become less reliable farther away unless more terms are added.",
  },
  {
    prompt: "Adding more terms usually gives the model more ways to match the original function.",
    answer: true,
    explanation:
      "Yes. Each term acts like another correction. More terms do not make every approximation perfect everywhere, but they usually improve the local model.",
  },
  {
    prompt: "Every Taylor approximation works equally well for every x-value.",
    answer: false,
    explanation:
      "Not quite. Some approximations are excellent near the center but break down far away, and some functions have limited intervals where the series behaves well.",
  },
];

function errorBadge(error) {
  if (error < 0.01) return { label: "Excellent match", tone: "bg-emerald-100 text-emerald-800" };
  if (error < 0.1) return { label: "Pretty close", tone: "bg-sky-100 text-sky-800" };
  if (error < 0.35) return { label: "Needs more terms", tone: "bg-amber-100 text-amber-800" };
  return { label: "Model breaking down", tone: "bg-rose-100 text-rose-800" };
}

function splitExpression(expression) {
  const pieces = [];
  let current = "";

  for (let i = 0; i < expression.length; i += 1) {
    const char = expression[i];
    const previous = expression[i - 1];
    const next = expression[i + 1];
    const isBinarySign =
      (char === "+" || char === "-") &&
      previous === " " &&
      next === " " &&
      current.trim().length > 0;

    if (isBinarySign) {
      pieces.push(current.trim());
      pieces.push(char);
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) pieces.push(current.trim());
  return pieces;
}

function formatPower(text) {
  const caretIndex = text.indexOf("^");
  if (caretIndex === -1) return text;

  const base = text.slice(0, caretIndex);
  const exponent = text.slice(caretIndex + 1);

  return (
    <>
      {base}
      <sup className="text-[0.65em] leading-none">{exponent}</sup>
    </>
  );
}

function MathAtom({ text }) {
  if (text.includes("/")) {
    const slashIndex = text.indexOf("/");
    const numerator = text.slice(0, slashIndex);
    const denominator = text.slice(slashIndex + 1);

    return (
      <span className="inline-flex translate-y-1 flex-col items-center px-1 align-middle leading-none">
        <span className="border-b-2 border-current px-1 pb-0.5">{formatPower(numerator)}</span>
        <span className="px-1 pt-0.5 text-[0.72em]">{formatPower(denominator)}</span>
      </span>
    );
  }

  return <span>{formatPower(text)}</span>;
}

function MathExpression({ expression }) {
  const pieces = splitExpression(expression);

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-serif leading-relaxed">
      {pieces.map((piece, index) => {
        if (piece === "+" || piece === "-") {
          return (
            <span key={`${piece}-${index}`} className="px-0.5 font-sans">
              {piece}
            </span>
          );
        }

        return <MathAtom key={`${piece}-${index}`} text={piece} />;
      })}
    </span>
  );
}

export default function InteractiveTaylorApproximationLesson() {
  const [terms, setTerms] = useState(1);
  const [functionId, setFunctionId] = useState("sin");
  const [selectedX, setSelectedX] = useState(functionLibrary.sin.startX);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizResult, setQuizResult] = useState(null);

  const activeFunction = functionLibrary[functionId];
  const [minX, maxX] = activeFunction.domain;
  const currentQuiz = misconceptions[quizIndex];

  const data = useMemo(() => {
    const points = [];
    const step = (maxX - minX) / 110;
    for (let x = minX; x <= maxX + step / 2; x += step) {
      const actual = activeFunction.actual(x);
      const approx = activeFunction.approx(x, terms);
      points.push({
        x: Number(x.toFixed(2)),
        actual: Number(actual.toFixed(4)),
        approx: Number(approx.toFixed(4)),
      });
    }
    return points;
  }, [activeFunction, maxX, minX, terms]);

  const selectedValues = useMemo(() => {
    const actual = activeFunction.actual(selectedX);
    const approx = activeFunction.approx(selectedX, terms);
    return { actual, approx, error: Math.abs(actual - approx) };
  }, [activeFunction, selectedX, terms]);

  const badge = errorBadge(selectedValues.error);
  const progress = Math.round((terms / 5) * 100);

  function switchFunction(nextFunctionId) {
    const nextFunction = functionLibrary[nextFunctionId];
    setFunctionId(nextFunctionId);
    setSelectedX(nextFunction.startX);
    setTerms(1);
    setQuizResult(null);
  }

  function answerQuiz(value) {
    setQuizResult(value === currentQuiz.answer);
  }

  function nextQuiz() {
    setQuizIndex((quizIndex + 1) % misconceptions.length);
    setQuizResult(null);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_transparent_32%),radial-gradient(circle_at_top_right,_#fae8ff,_transparent_30%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] p-4 text-slate-950 md:p-8">
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute left-10 top-24 h-32 w-32 rounded-full bg-cyan-200 blur-3xl" />
        <div className="absolute right-16 top-40 h-40 w-40 rounded-full bg-fuchsia-200 blur-3xl" />
        <div className="absolute bottom-16 left-1/3 h-44 w-44 rounded-full bg-amber-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white shadow-sm">
                <Sparkles className="h-4 w-4" /> Interactive Math Learning Sample
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                {activeFunction.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-700">
                Taylor approximations turn familiar functions into polynomial models. Choose a function, add terms, test points, and use the error meter to decide when the model is good enough.
              </p>
            </div>

            <motion.div
              key={activeFunction.id}
              initial={{ scale: 0.9, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl bg-slate-950 p-5 text-white shadow-2xl"
            >
              <Waves className="h-10 w-10" />
              <p className="mt-4 text-sm uppercase tracking-wide text-slate-300">Mission</p>
              <p className="mt-1 max-w-48 text-xl font-bold">{activeFunction.mission}</p>
            </motion.div>
          </div>
        </motion.header>

        <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-xl backdrop-blur">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <FunctionSquare className="h-5 w-5 text-fuchsia-600" />
                <div>
                  <h2 className="text-xl font-bold">Choose a function to model</h2>
                  <p className="text-sm text-slate-600">Each option has its own pattern of correction terms.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                {Object.values(functionLibrary).map((fn) => (
                  <Button
                    key={fn.id}
                    variant={fn.id === functionId ? "default" : "outline"}
                    className="rounded-2xl"
                    onClick={() => switchFunction(fn.id)}
                  >
                    {fn.shortName}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="overflow-hidden rounded-[2rem] border-white/70 bg-white/85 shadow-xl backdrop-blur lg:col-span-2">
            <CardContent className="p-0">
              <div className="border-b bg-slate-950 p-5 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-cyan-200">
                      <Target className="h-4 w-4" /> Experiment Lab
                    </div>
                    <h2 className="mt-1 text-2xl font-bold">Tune the approximation for {activeFunction.shortName}</h2>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3 text-sm backdrop-blur">
                    <p className="text-slate-300">Current model</p>
                    <p className="mt-1 text-lg text-white">
                      <MathExpression expression={activeFunction.equations[terms]} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-cyan-50 p-5">
                    <p className="text-sm font-bold uppercase tracking-wide text-cyan-900">Actual function</p>
                    <p className="mt-2 text-2xl font-black text-cyan-950 md:text-3xl">
                      <span className="font-serif">f(x) = </span>
                      <MathExpression expression={activeFunction.shortName} />
                    </p>
                    <p className="mt-2 text-sm text-cyan-900">
                      This is the target curve the polynomial is trying to imitate.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-fuchsia-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold uppercase tracking-wide text-fuchsia-900">Approximation</p>
                      <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-black text-fuchsia-900">
                        {terms} {terms === 1 ? "term" : "terms"}
                      </span>
                    </div>
                    <p className="mt-2 text-2xl font-black text-fuchsia-950 md:text-3xl">
                      <span className="font-serif">P(x) = </span>
                      <MathExpression expression={activeFunction.equations[terms]} />
                    </p>
                    <p className="mt-2 text-sm text-fuchsia-900">
                      Move the slider below to add correction terms to the model.
                    </p>
                  </div>
                </div>

                <div className="h-80 rounded-3xl border bg-white p-3 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                      <defs>
                        <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="approxFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c026d3" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#c026d3" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="x" type="number" domain={activeFunction.domain} tick={{ fontSize: 12 }} />
                      <YAxis domain={activeFunction.yDomain} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <ReferenceLine x={0} stroke="#0f172a" strokeDasharray="4 4" />
                      <ReferenceLine x={selectedX} stroke="#f59e0b" strokeWidth={3} />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#0284c7"
                        fill="url(#actualFill)"
                        strokeWidth={4}
                        name={activeFunction.actualLabel}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="approx"
                        stroke="#c026d3"
                        fill="url(#approxFill)"
                        strokeWidth={4}
                        name={activeFunction.approxLabel}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-900">
                    <span className="h-2 w-2 rounded-full bg-cyan-600" /> {activeFunction.actualLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-100 px-3 py-1 font-medium text-fuchsia-900">
                    <span className="h-2 w-2 rounded-full bg-fuchsia-600" /> {activeFunction.approxLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> selected test point
                  </span>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <label className="font-bold">Number of terms</label>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">{progress}% built</span>
                    </div>
                    <Slider
                      value={[terms]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => setTerms(value[0])}
                      className="mt-5"
                    />
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                      <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-slate-950" />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{activeFunction.insight}</p>
                  </div>

                  <div className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <label className="font-bold">Move the test point</label>
                      <span className={`rounded-full px-3 py-1 text-sm font-bold ${badge.tone}`}>{badge.label}</span>
                    </div>
                    <Slider
                      value={[selectedX]}
                      min={minX}
                      max={maxX}
                      step={0.1}
                      onValueChange={(value) => setSelectedX(value[0])}
                      className="mt-5"
                    />
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-2xl bg-white p-3 shadow-sm">
                        <p className="text-slate-500">Actual</p>
                        <p className="font-bold">{selectedValues.actual.toFixed(3)}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3 shadow-sm">
                        <p className="text-slate-500">Model</p>
                        <p className="font-bold">{selectedValues.approx.toFixed(3)}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3 shadow-sm">
                        <p className="text-slate-500">Error</p>
                        <p className="font-bold">{selectedValues.error.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-xl backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <h2 className="text-2xl font-bold">Mission path</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {activeFunction.missions.map((mission, index) => (
                    <motion.div
                      key={mission}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl bg-slate-100 p-4"
                    >
                      <p className="text-sm font-black text-slate-500">Step {index + 1}</p>
                      <p className="mt-1 text-sm text-slate-700">{mission}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-xl backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-fuchsia-600" />
                  <h2 className="text-2xl font-bold">Quick check</h2>
                </div>
                <p className="mt-4 text-slate-700">{currentQuiz.prompt}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button className="rounded-2xl" onClick={() => answerQuiz(true)}>True</Button>
                  <Button className="rounded-2xl" variant="outline" onClick={() => answerQuiz(false)}>False</Button>
                </div>
                {quizResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-3xl bg-slate-100 p-4"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {quizResult ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <RotateCcw className="h-5 w-5 text-amber-600" />}
                      {quizResult ? "Nice reasoning." : "Revise the model."}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{currentQuiz.explanation}</p>
                    <Button variant="ghost" className="mt-3 rounded-2xl" onClick={nextQuiz}>Next question</Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-xl backdrop-blur">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Learning design notes</h2>
            <div className="mt-4 grid gap-4 text-slate-700 md:grid-cols-3">
              <div className="rounded-3xl bg-cyan-50 p-5">
                <h3 className="font-bold text-cyan-950">Compare patterns</h3>
                <p className="mt-2 text-sm">
                  Switching functions helps learners notice that different curves need different correction patterns: odd powers, even powers, factorials, or repeated powers.
                </p>
              </div>
              <div className="rounded-3xl bg-fuchsia-50 p-5">
                <h3 className="font-bold text-fuchsia-950">Interactive feedback</h3>
                <p className="mt-2 text-sm">
                  Sliders make error visible and give learners control over the experiment instead of asking them to passively read a derivation.
                </p>
              </div>
              <div className="rounded-3xl bg-amber-50 p-5">
                <h3 className="font-bold text-amber-950">Misconception checks</h3>
                <p className="mt-2 text-sm">
                  Quick checks target common misunderstandings about local accuracy, center points, and why some polynomial models eventually break down.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
