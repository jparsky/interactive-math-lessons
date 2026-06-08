import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Crown,
  Dumbbell,
  Feather,
  Flame,
  Footprints,
  HeartPulse,
  Home,
  Mountain,
  Music,
  Shield,
  Sparkles,
  Sword,
  Wand2,
} from "lucide-react";

const stats = [
  { key: "strength", label: "Strength", short: "STR", icon: Dumbbell },
  { key: "dexterity", label: "Dexterity", short: "DEX", icon: Feather },
  { key: "constitution", label: "Constitution", short: "CON", icon: HeartPulse },
  { key: "wisdom", label: "Wisdom", short: "WIS", icon: Sparkles },
  { key: "intelligence", label: "Intelligence", short: "INT", icon: Brain },
  { key: "charisma", label: "Charisma", short: "CHA", icon: Music },
];

const characters = [
  {
    id: "fighter",
    name: "Fighter",
    tagline: "Reliable, direct, and built for physical contests.",
    description:
      "A classic armored hero who wins through strength, discipline, and courage under pressure.",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    accent: "bg-red-50 text-red-950 border-red-100",
    stats: {
      strength: 15,
      constitution: 14,
      dexterity: 13,
      wisdom: 12,
      charisma: 10,
      intelligence: 8,
    },
  },
  {
    id: "rogue",
    name: "Rogue",
    tagline: "Quick hands, quick feet, and a talent for risky moves.",
    description:
      "A sneaky problem-solver who relies on speed, timing, and precision instead of brute force.",
    icon: Feather,
    color: "from-slate-700 to-violet-600",
    accent: "bg-violet-50 text-violet-950 border-violet-100",
    stats: {
      dexterity: 15,
      intelligence: 14,
      charisma: 13,
      wisdom: 12,
      constitution: 10,
      strength: 8,
    },
  },
  {
    id: "wizard",
    name: "Wizard",
    tagline: "Careful, clever, and strongest when knowledge matters.",
    description:
      "A spellcaster who studies first, acts second, and turns the right idea into the right spell.",
    icon: Wand2,
    color: "from-blue-500 to-indigo-600",
    accent: "bg-blue-50 text-blue-950 border-blue-100",
    stats: {
      intelligence: 15,
      wisdom: 14,
      dexterity: 13,
      constitution: 12,
      charisma: 10,
      strength: 8,
    },
  },
  {
    id: "druid",
    name: "Druid",
    tagline: "Patient, perceptive, and guided by instinct.",
    description:
      "A nature-wise wanderer who reads the world carefully and looks for balance before violence.",
    icon: Sparkles,
    color: "from-emerald-500 to-lime-500",
    accent: "bg-emerald-50 text-emerald-950 border-emerald-100",
    stats: {
      wisdom: 15,
      constitution: 14,
      intelligence: 13,
      dexterity: 12,
      charisma: 10,
      strength: 8,
    },
  },
  {
    id: "bard",
    name: "Bard",
    tagline: "Persuasive, flexible, and always ready to improvise.",
    description:
      "A performer, negotiator, and storyteller who can turn charm into a survival strategy.",
    icon: Music,
    color: "from-pink-500 to-fuchsia-600",
    accent: "bg-fuchsia-50 text-fuchsia-950 border-fuchsia-100",
    stats: {
      charisma: 15,
      dexterity: 14,
      intelligence: 13,
      wisdom: 12,
      constitution: 10,
      strength: 8,
    },
  },
  {
    id: "barbarian",
    name: "Barbarian",
    tagline: "Tough, forceful, and difficult to take down.",
    description:
      "A hardy brawler who trusts endurance, instinct, and raw momentum when danger appears.",
    icon: Flame,
    color: "from-amber-500 to-red-600",
    accent: "bg-amber-50 text-amber-950 border-amber-100",
    stats: {
      constitution: 15,
      strength: 14,
      dexterity: 13,
      wisdom: 12,
      charisma: 10,
      intelligence: 8,
    },
  },
];

const dragonChoices = [
  {
    id: "charge",
    title: "Draw your sword and charge into battle.",
    statKey: "strength",
    icon: Sword,
    tone: "bg-red-50 text-red-950 border-red-100",
    outcomePreview:
      "A direct approach. This favors characters who solve problems by force.",
    successText:
      "You charge with heroic force, strike true, and drive the blue dragon from the kingdom.",
    failureText:
      "You charge with heroic confidence, but the dragon opens one eye, yawns, and swats you across the cavern before making you its breakfast.",
  },
  {
    id: "assassinate",
    title: "Sneak up on the dragon and attempt to assassinate it.",
    statKey: "dexterity",
    icon: Footprints,
    tone: "bg-violet-50 text-violet-950 border-violet-100",
    outcomePreview:
      "A quiet approach. This favors characters who are quick, precise, and hard to notice.",
    successText:
      "You move like a shadow through the lair and land the perfect strike before the dragon can react.",
    failureText:
      "You step carefully through the treasure pile, but one tiny coin clinks against another. The dragon wakes, spots you immediately, and eats you.",
  },
  {
    id: "grenade",
    title: "Toss the holy hand grenade, trusting that you can withstand its blast.",
    statKey: "constitution",
    icon: HeartPulse,
    tone: "bg-amber-50 text-amber-950 border-amber-100",
    outcomePreview:
      "A reckless approach. This favors characters who can survive the consequences.",
    successText:
      "The holy hand grenade explodes in a flash of thunder. You somehow remain standing. The dragon does not.",
    failureText:
      "You toss the holy hand grenade with great dramatic flair. Unfortunately, the blast reaches you too. The dragon survives just long enough to eat what remains.",
  },
  {
    id: "spellbook",
    title: "Look through your spellbook for the perfect anti-dragon spell.",
    statKey: "intelligence",
    icon: BookOpen,
    tone: "bg-blue-50 text-blue-950 border-blue-100",
    outcomePreview:
      "A studied approach. This favors characters who rely on knowledge and preparation.",
    successText:
      "You find exactly the right spell, speak the final syllable, and the dragon collapses beneath a perfectly chosen enchantment.",
    failureText:
      "You flip through your spellbook in a panic and confidently cast something labeled 'mostly harmless.' The dragon is not impressed, and eats you.",
  },
  {
    id: "new-home",
    title: "Help the dragon find a new home, far from the kingdom.",
    statKey: "wisdom",
    icon: Home,
    tone: "bg-emerald-50 text-emerald-950 border-emerald-100",
    outcomePreview:
      "A perceptive approach. This favors characters who understand motives, instincts, and consequences.",
    successText:
      "You understand what the dragon truly wants and guide it toward a distant mountain range where it can live in peace.",
    failureText:
      "You try to understand the dragon's needs, but badly misread the situation. What the dragon wants, apparently, is lunch. It eats you.",
  },
  {
    id: "dragon-rider",
    title: "Charm the dragon and become its rider.",
    statKey: "charisma",
    icon: Crown,
    tone: "bg-fuchsia-50 text-fuchsia-950 border-fuchsia-100",
    outcomePreview:
      "A dramatic approach. This favors characters who can win trust, inspire awe, or talk their way into legend.",
    successText:
      "The dragon opens one enormous eye, listens, and decides you are not a snack but a legend. You become its rider.",
    failureText:
      "You attempt a legendary speech about friendship, destiny, and shared glory. The dragon listens politely, then eats you anyway.",
  },
];

function statModifier(score) {
  return score - 10;
}

function formatModifier(score) {
  const modifier = statModifier(score);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function successOutcomes(targetRoll) {
  if (targetRoll <= 1) return 20;
  if (targetRoll > 20) return 0;
  return 21 - targetRoll;
}

function probabilityText(outcomes) {
  return `${outcomes}/20 = ${Math.round((outcomes / 20) * 100)}%`;
}

function parseProbabilityInput(input) {
  const cleaned = input.trim().toLowerCase();

  if (!cleaned) return null;

  if (cleaned.includes("/")) {
    const [top, bottom] = cleaned.split("/").map((part) => Number(part.trim()));
    if (!Number.isFinite(top) || !Number.isFinite(bottom) || bottom === 0) {
      return null;
    }
    return top / bottom;
  }

  const withoutPercent = cleaned.replace("%", "");
  const value = Number(withoutPercent);

  if (!Number.isFinite(value)) return null;

  if (cleaned.includes("%")) return value / 100;
  if (value <= 1) return value;
  return value / 100;
}

function isProbabilityCorrect(input, expectedOutcomes) {
  const parsed = parseProbabilityInput(input);
  if (parsed === null) return false;

  const expected = expectedOutcomes / 20;
  return Math.abs(parsed - expected) < 0.001;
}

function getStatInfo(statKey) {
  return stats.find((stat) => stat.key === statKey);
}

function CharacterAvatar({ character, size = 88 }) {
  const costumes = {
    fighter: (
      <>
        <path d="M28 90 Q50 64 72 90 Z" fill="#94a3b8" />
        <path d="M36 68 L50 60 L64 68 L60 84 L40 84 Z" fill="#cbd5e1" />
        <circle cx="50" cy="48" r="20" fill="#d1d5db" />
        <path d="M30 46 Q50 18 70 46 L66 60 Q50 52 34 60 Z" fill="#cbd5e1" />
        <rect x="39" y="44" width="22" height="10" rx="5" fill="#475569" />
        <path d="M48 16 L52 16 L58 28 L42 28 Z" fill="#ef4444" />
        <path d="M44 58 Q50 62 56 58" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    rogue: (
      <>
        <path d="M28 92 Q50 62 72 92 Z" fill="#1e293b" />
        <path d="M24 42 Q50 10 76 42 L68 62 Q50 54 32 62 Z" fill="#312e81" />
        <circle cx="50" cy="52" r="15" fill="#f2d3b1" />
        <rect x="36" y="50" width="28" height="9" rx="4.5" fill="#0f172a" />
        <circle cx="43" cy="54" r="1.8" fill="#e2e8f0" />
        <circle cx="57" cy="54" r="1.8" fill="#e2e8f0" />
        <path d="M74 70 L82 62 L80 76 Z" fill="#cbd5e1" />
        <rect x="72" y="74" width="8" height="3" rx="1.5" fill="#7c3aed" />
      </>
    ),
    wizard: (
      <>
        <path d="M28 92 Q50 62 72 92 Z" fill="#4338ca" />
        <circle cx="50" cy="50" r="17" fill="#f2d3b1" />
        <path d="M50 10 L72 42 L28 42 Z" fill="#4338ca" />
        <rect x="24" y="40" width="52" height="7" rx="3.5" fill="#6366f1" />
        <circle cx="66" cy="22" r="2" fill="#fef08a" />
        <circle cx="42" cy="27" r="1.7" fill="#fef08a" />
        <circle cx="54" cy="18" r="1.4" fill="#fef08a" />
        <rect x="78" y="22" width="4" height="58" rx="2" fill="#8b5e3c" />
        <circle cx="80" cy="18" r="6" fill="#93c5fd" stroke="#dbeafe" strokeWidth="2" />
        <circle cx="43" cy="50" r="2" fill="#0f172a" />
        <circle cx="57" cy="50" r="2" fill="#0f172a" />
        <path d="M44 58 Q50 62 56 58" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    druid: (
      <>
        <path d="M28 92 Q50 62 72 92 Z" fill="#166534" />
        <circle cx="50" cy="50" r="17" fill="#f2d3b1" />
        <path d="M32 48 L24 52 L32 56 Z" fill="#f2d3b1" />
        <path d="M68 48 L76 52 L68 56 Z" fill="#f2d3b1" />
        <ellipse cx="38" cy="30" rx="5" ry="9" fill="#22c55e" transform="rotate(-30 38 30)" />
        <ellipse cx="50" cy="26" rx="5" ry="9" fill="#84cc16" />
        <ellipse cx="62" cy="30" rx="5" ry="9" fill="#22c55e" transform="rotate(30 62 30)" />
        <ellipse cx="34" cy="72" rx="7" ry="11" fill="#22c55e" transform="rotate(-25 34 72)" />
        <ellipse cx="66" cy="72" rx="7" ry="11" fill="#22c55e" transform="rotate(25 66 72)" />
        <circle cx="43" cy="50" r="2" fill="#0f172a" />
        <circle cx="57" cy="50" r="2" fill="#0f172a" />
        <path d="M44 58 Q50 62 56 58" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    bard: (
      <>
        <path d="M28 92 Q50 62 72 92 Z" fill="#a21caf" />
        <path d="M28 34 Q50 16 72 34 L68 44 Q50 38 32 44 Z" fill="#86198f" />
        <path d="M66 18 Q77 10 80 24 Q73 23 66 30 Z" fill="#f9a8d4" />
        <circle cx="50" cy="52" r="16" fill="#f2d3b1" />
        <ellipse cx="75" cy="70" rx="8" ry="10" fill="#d97706" />
        <rect x="67" y="58" width="4" height="20" rx="2" fill="#92400e" transform="rotate(35 69 68)" />
        <line x1="73" y1="63" x2="79" y2="76" stroke="#fef3c7" strokeWidth="1" />
        <line x1="71" y1="64" x2="77" y2="77" stroke="#fef3c7" strokeWidth="1" />
        <circle cx="43" cy="52" r="2" fill="#0f172a" />
        <circle cx="57" cy="52" r="2" fill="#0f172a" />
        <path d="M44 60 Q50 64 56 60" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    barbarian: (
      <>
        <path d="M24 92 Q50 64 76 92 Z" fill="#7c2d12" />
        <circle cx="50" cy="48" r="18" fill="#f2d3b1" />
        <path d="M34 56 Q50 84 66 56 L62 74 Q50 90 38 74 Z" fill="#92400e" />
        <path d="M32 40 Q50 20 68 40" fill="none" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <path d="M34 34 Q26 22 16 28 Q22 38 32 40" fill="#d6d3d1" />
        <path d="M66 34 Q74 22 84 28 Q78 38 68 40" fill="#d6d3d1" />
        <circle cx="43" cy="48" r="2" fill="#0f172a" />
        <circle cx="57" cy="48" r="2" fill="#0f172a" />
        <path d="M44 55 Q50 58 56 55" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <div
      className="shrink-0 rounded-[1.5rem] bg-white shadow-md ring-1 ring-slate-200"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full rounded-[1.5rem]" aria-hidden="true">
        <defs>
          <linearGradient id={`bg-${character.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" rx="22" fill={`url(#bg-${character.id})`} />
        <ellipse cx="50" cy="92" rx="24" ry="6" fill="#cbd5e1" opacity="0.7" />
        {costumes[character.id]}
      </svg>
    </div>
  );
}

function AnimatedD20({ face, isRolling, character }) {
  return (
    <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
      <motion.div
        key={isRolling ? "rolling" : `settled-${face}`}
        initial={{ scale: 0.92, rotate: -12, y: 0 }}
        animate={
          isRolling
            ? {
                scale: [0.95, 1.1, 0.98, 1.08, 1],
                rotate: [0, 130, 270, 440, 720],
                y: [0, -18, 8, -10, 0],
              }
            : {
                scale: [1.1, 0.96, 1],
                rotate: [10, -4, 0],
                y: [0, -6, 0],
              }
        }
        transition={
          isRolling
            ? {
                duration: 1.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }
            : {
                duration: 0.45,
                ease: "easeOut",
              }
        }
        className="relative h-40 w-40 drop-shadow-2xl"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id={`d20-${character.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id={`d20-glow-${character.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#ddd6fe" />
            </linearGradient>
          </defs>

          <polygon
            points="100,8 176,52 176,148 100,192 24,148 24,52"
            fill={`url(#d20-${character.id})`}
            stroke="#0f172a"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          <polygon points="100,8 176,52 100,88 24,52" fill="#f8fafc" opacity="0.9" stroke="#64748b" strokeWidth="2" />
          <polygon points="24,52 100,88 100,192 24,148" fill="#cbd5e1" opacity="0.85" stroke="#64748b" strokeWidth="2" />
          <polygon points="176,52 100,88 100,192 176,148" fill="#94a3b8" opacity="0.8" stroke="#64748b" strokeWidth="2" />
          <polygon points="100,88 176,52 176,148" fill={`url(#d20-glow-${character.id})`} opacity="0.35" />

          <line x1="100" y1="8" x2="100" y2="192" stroke="#64748b" strokeWidth="2" />
          <line x1="24" y1="52" x2="176" y2="148" stroke="#64748b" strokeWidth="2" />
          <line x1="176" y1="52" x2="24" y2="148" stroke="#64748b" strokeWidth="2" />

          <circle cx="100" cy="100" r="44" fill="#0f172a" opacity="0.9" />
        </svg>

        <motion.div
          key={face}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.12 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="select-none text-5xl font-black text-white drop-shadow">
            {face}
          </span>
        </motion.div>
      </motion.div>

      {isRolling && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.35, 0], scale: [0.7, 1.25, 1.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute h-44 w-44 rounded-full bg-amber-300 blur-2xl"
          />
          <p className="absolute bottom-0 rounded-full bg-slate-950 px-4 py-1 text-sm font-black uppercase tracking-wide text-white shadow-lg">
            rolling...
          </p>
        </>
      )}
    </div>
  );
}

function StatBar({ stat, value }) {
  const Icon = stat.icon;
  const percent = ((value - 8) / 7) * 100;

  return (
    <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-bold text-slate-800">{stat.short}</span>
        </div>

        <div className="text-right">
          <span className="font-black text-slate-950">{value}</span>
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
            {formatModifier(value)}
          </span>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.45 }}
          className="h-full rounded-full bg-slate-950"
        />
      </div>
    </div>
  );
}

function CharacterCard({ character, selected, onSelect }) {
  const Icon = character.icon;

  const bestStat = stats.reduce((best, stat) => {
    return character.stats[stat.key] > character.stats[best.key] ? stat : best;
  }, stats[0]);

  return (
    <motion.button
      layout
      onClick={() => onSelect(character)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`text-left transition ${selected ? "scale-[1.02]" : "opacity-95"}`}
    >
      <Card
        className={`h-full overflow-hidden rounded-[2rem] border-2 bg-white shadow-lg transition ${
          selected ? "border-slate-950 shadow-2xl" : "border-slate-100"
        }`}
      >
        <div className={`h-3 bg-gradient-to-r ${character.color}`} />

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <CharacterAvatar character={character} size={80} />

              <div>
                <div className="flex items-center gap-2">
                  <div className={`rounded-2xl bg-gradient-to-br ${character.color} p-2 text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-950">
                    {character.name}
                  </h3>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-600">
                  {character.tagline}
                </p>
              </div>
            </div>

            {selected && (
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                chosen
              </span>
            )}
          </div>

          <p className={`mt-4 rounded-2xl border p-3 text-sm ${character.accent}`}>
            {character.description}
          </p>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              strongest stat
            </p>
            <p className="mt-1 font-black text-slate-950">
              {bestStat.label}: {character.stats[bestStat.key]}{" "}
              <span className="text-slate-500">
                ({formatModifier(character.stats[bestStat.key])})
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.button>
  );
}

function SelectedCharacterPanel({ character, onContinue }) {
  return (
    <Card className="sticky top-24 rounded-[2rem] border border-slate-200 bg-white/90 shadow-xl backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <CharacterAvatar character={character} size={96} />

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Your character
            </p>
            <h2 className="text-3xl font-black text-slate-950">
              {character.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {character.tagline}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Standard array
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Each character uses the same six scores:{" "}
            <span className="font-black text-slate-950">15, 14, 13, 12, 10, 8</span>.
            The only difference is where those scores are placed.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {stats.map((stat) => (
            <StatBar
              key={stat.key}
              stat={stat}
              value={character.stats[stat.key]}
            />
          ))}
        </div>

        <Button className="mt-5 w-full rounded-2xl" onClick={onContinue}>
          Enter the tavern <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ProbabilityInputCard({
  label,
  question,
  value,
  onChange,
  expectedOutcomes,
  explanation,
  disabled = false,
}) {
  const isCorrect = isProbabilityCorrect(value, expectedOutcomes);
  const hasAnswer = value.trim().length > 0;

  return (
    <Card
      className={`rounded-[2rem] border-2 bg-white shadow-lg transition ${
        isCorrect ? "border-emerald-400" : "border-slate-100"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <CardContent className="p-5">
        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-950">{question}</h3>

        <input
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Try 45%, 0.45, or 9/20"
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold text-slate-950 outline-none transition focus:border-slate-950 disabled:cursor-not-allowed"
        />

        {hasAnswer && !disabled && (
          <div
            className={`mt-4 rounded-2xl p-4 text-sm leading-6 ${
              isCorrect
                ? "bg-emerald-50 text-emerald-950"
                : "bg-amber-50 text-amber-950"
            }`}
          >
            {isCorrect ? (
              <p>
                Correct. {explanation} The probability is{" "}
                <span className="font-black">{probabilityText(expectedOutcomes)}</span>.
              </p>
            ) : (
              <p>
                Not quite. Count how many successful die faces there are out of
                20 total faces.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RollResultCard({ rollResult, statScore, successText, failureText, children }) {
  if (!rollResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 rounded-[2rem] p-5 ${
        rollResult.success
          ? "bg-emerald-50 text-emerald-950"
          : "bg-rose-50 text-rose-950"
      }`}
    >
      <p className="text-sm font-black uppercase tracking-wide">Result</p>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide opacity-70">
            d20
          </p>
          <p className="text-3xl font-black">{rollResult.roll}</p>
        </div>

        <div className="rounded-2xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide opacity-70">
            modifier
          </p>
          <p className="text-3xl font-black">{formatModifier(statScore)}</p>
        </div>

        <div className="rounded-2xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide opacity-70">
            total
          </p>
          <p className="text-3xl font-black">{rollResult.total}</p>
        </div>
      </div>

      <p className="mt-4 text-lg font-black">
        {rollResult.success ? successText : failureText}
      </p>

      {children}
    </motion.div>
  );
}

function CheckScene({
  character,
  onBack,
  onContinue,
  continueText,
  sceneBadge,
  title,
  intro,
  statKey,
  dc,
  firstQuestionLabel,
  secondQuestionLabel,
  rollPanelTitle,
  rollButtonText,
  successText,
  failureText,
  backgroundClass,
  quote,
}) {
  const [unmodifiedAnswer, setUnmodifiedAnswer] = useState("");
  const [modifiedAnswer, setModifiedAnswer] = useState("");
  const [rollResult, setRollResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [animatedFace, setAnimatedFace] = useState(20);

  const statInfo = getStatInfo(statKey);
  const statScore = character.stats[statKey];
  const modifier = statModifier(statScore);
  const modifiedTarget = dc - modifier;

  const unmodifiedOutcomes = successOutcomes(dc);
  const modifiedOutcomes = successOutcomes(modifiedTarget);

  const unmodifiedCorrect = isProbabilityCorrect(unmodifiedAnswer, unmodifiedOutcomes);
  const modifiedCorrect = isProbabilityCorrect(modifiedAnswer, modifiedOutcomes);
  const canRoll = unmodifiedCorrect && modifiedCorrect;

  const challengeSummary = useMemo(() => {
    const sign = modifier >= 0 ? "+" : "";
    return `d20 ${sign}${modifier} vs. DC ${dc}`;
  }, [modifier, dc]);

  function rollD20() {
    if (!canRoll || isRolling) return;

    const finalRoll = Math.floor(Math.random() * 20) + 1;
    const finalTotal = finalRoll + modifier;

    setRollResult(null);
    setIsRolling(true);

    let ticks = 0;
    const maxTicks = 16;

    const intervalId = window.setInterval(() => {
      ticks += 1;

      if (ticks >= maxTicks) {
        window.clearInterval(intervalId);
        setAnimatedFace(finalRoll);
        setIsRolling(false);
        setRollResult({
          roll: finalRoll,
          total: finalTotal,
          success: finalTotal >= dc,
        });
        return;
      }

      setAnimatedFace(Math.floor(Math.random() * 20) + 1);
    }, 90);
  }

  return (
    <div className={`min-h-screen p-4 text-slate-950 md:p-8 ${backgroundClass}`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <Button
          className="rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
          onClick={onBack}
        >
          Back to character choice
        </Button>

        <Card className="overflow-hidden rounded-[2.5rem] border border-white bg-white/90 shadow-2xl backdrop-blur">
          <div className={`h-4 bg-gradient-to-r ${character.color}`} />

          <CardContent className="p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">
                  {sceneBadge}
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                  {title}
                </h1>

                {quote && (
                  <div className="mt-5 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm">
                    <p className="text-lg font-black leading-8">{quote}</p>
                  </div>
                )}

                <div className="mt-5 max-w-3xl space-y-4 text-lg leading-8 text-slate-700">
                  {intro}
                </div>
              </div>

              <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl">
                <div className="flex items-center gap-4">
                  <CharacterAvatar character={character} size={96} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                      Adventurer
                    </p>
                    <h2 className="text-3xl font-black">{character.name}</h2>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                      {statInfo.label}
                    </p>
                    <p className="mt-1 text-3xl font-black">{statScore}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                      Modifier
                    </p>
                    <p className="mt-1 text-3xl font-black">
                      {formatModifier(statScore)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                    Challenge
                  </p>
                  <p className="mt-1 text-xl font-black">{challengeSummary}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="rounded-[2rem] bg-white/90 shadow-lg">
            <CardContent className="p-5">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                Step 1
              </p>
              <h3 className="mt-2 text-xl font-black">Set the DC</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The difficulty class is DC {dc}. Your final total needs to be at
                least {dc}.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] bg-white/90 shadow-lg">
            <CardContent className="p-5">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                Step 2
              </p>
              <h3 className="mt-2 text-xl font-black">Use the right stat</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This check uses {statInfo.label}. Add the {statInfo.label} modifier
                to the d20 roll.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] bg-white/90 shadow-lg">
            <CardContent className="p-5">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                Step 3
              </p>
              <h3 className="mt-2 text-xl font-black">Count success faces</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Probability is favorable outcomes divided by 20 possible d20
                outcomes.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            <ProbabilityInputCard
              label={firstQuestionLabel}
              question={`Without any modifier, what is the probability of rolling a ${dc} or higher on a d20?`}
              value={unmodifiedAnswer}
              onChange={setUnmodifiedAnswer}
              expectedOutcomes={unmodifiedOutcomes}
              explanation={`The successful rolls are ${dc} through 20, which gives ${unmodifiedOutcomes} successful outcomes.`}
            />

            <ProbabilityInputCard
              label={secondQuestionLabel}
              question={`With ${character.name}'s ${statInfo.label} modifier of ${formatModifier(
                statScore
              )}, what is the probability of succeeding on this DC ${dc} check?`}
              value={modifiedAnswer}
              onChange={setModifiedAnswer}
              expectedOutcomes={modifiedOutcomes}
              disabled={!unmodifiedCorrect}
              explanation={`Because ${character.name} adds ${formatModifier(
                statScore
              )}, the die only needs to show ${modifiedTarget} or higher.`}
            />
          </div>

          <Card className="rounded-[2.5rem] border border-slate-200 bg-white/90 shadow-xl">
            <CardContent className="p-6">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                {rollPanelTitle}
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Ready to roll?
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Once both probability questions are correct, roll the d20 and
                see what happens.
              </p>

              <AnimatedD20
                face={animatedFace}
                isRolling={isRolling}
                character={character}
              />

              <div className="mt-6 rounded-[2rem] bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    Needed on die
                  </span>
                  <span className="text-2xl font-black text-slate-950">
                    {modifiedTarget}+
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    Success chance
                  </span>
                  <span className="text-2xl font-black text-slate-950">
                    {canRoll ? probabilityText(modifiedOutcomes) : "?"}
                  </span>
                </div>
              </div>

              <Button
                disabled={!canRoll || isRolling}
                onClick={rollD20}
                className={`mt-6 w-full rounded-2xl ${
                  canRoll && !isRolling
                    ? "bg-slate-950 text-white"
                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                }`}
              >
                {isRolling
                  ? "Rolling..."
                  : rollResult
                  ? "Roll again"
                  : rollButtonText}
              </Button>

              {rollResult && !isRolling && (
                <>
                  <RollResultCard
                    rollResult={rollResult}
                    statScore={statScore}
                    successText={successText}
                    failureText={failureText}
                  />

                  {onContinue && (
                    <Button
                      onClick={onContinue}
                      className="mt-5 w-full rounded-2xl bg-slate-950 text-white"
                    >
                      {continueText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TavernDartChallenge({ character, onBack, onContinue }) {
  return (
    <CheckScene
      character={character}
      onBack={onBack}
      onContinue={onContinue}
      continueText="Continue the adventure"
      sceneBadge="🍺 Scene 1 · The Rowdy Tavern"
      title="A dartboard, a dare, and a d20."
      statKey="dexterity"
      dc={12}
      firstQuestionLabel="Question 1"
      secondQuestionLabel="Question 2"
      rollPanelTitle="The dart throw"
      rollButtonText="Roll the d20"
      successText="Success! The dart thunks into the target and the tavern erupts."
      failureText="Failure! The dart misses, and someone at the bar laughs a little too loudly."
      backgroundClass="bg-[radial-gradient(circle_at_top_left,_#fed7aa,_transparent_30%),radial-gradient(circle_at_bottom_right,_#ddd6fe,_transparent_30%),linear-gradient(135deg,_#fff7ed,_#f8fafc)]"
      intro={
        <>
          <p>
            The tavern is loud, crowded, and just a little suspicious. Someone
            slams a mug on the table and points at the dartboard: “Think you can
            hit the center?”
          </p>
          <p>
            This is a <span className="font-black">Dexterity check</span>. To
            attempt it, your character rolls a 20-sided die and adds their
            Dexterity modifier.
          </p>
        </>
      }
    />
  );
}

function RoyalMessengerChallenge({ character, onBack, onContinue }) {
  return (
    <CheckScene
      character={character}
      onBack={onBack}
      onContinue={onContinue}
      continueText="Travel to the dragon’s lair"
      sceneBadge="📜 Scene 2 · The Royal Announcement"
      title="The king needs adventurers."
      statKey="charisma"
      dc={8}
      firstQuestionLabel="Question 3"
      secondQuestionLabel="Question 4"
      rollPanelTitle="The first impression"
      rollButtonText="Roll the charisma check"
      successText="Success! The messenger points your way. You look exactly like the kind of hero the kingdom needs."
      failureText="Failure! The messenger scans the room, pauses for a moment, then looks right past you."
      backgroundClass="bg-[radial-gradient(circle_at_top_left,_#bfdbfe,_transparent_30%),radial-gradient(circle_at_bottom_right,_#fde68a,_transparent_30%),linear-gradient(135deg,_#eff6ff,_#fff7ed)]"
      quote="“Calling all adventurers, warriors, mages, and other skilled individuals! The king has put out a large reward for anyone brave enough and mighty enough to defeat the dreaded blue dragon that has been terrorizing our kingdom! Who among you is worthy?”"
      intro={
        <>
          <p>
            The tavern goes quiet. Every would-be hero suddenly sits up a little
            straighter. To get noticed by the messenger, your character needs to
            look confident, impressive, and worth recruiting.
          </p>
          <p>
            This is a <span className="font-black">Charisma check</span>. Roll a
            d20, add your Charisma modifier, and try to meet or beat the
            difficulty class.
          </p>
        </>
      }
    />
  );
}

function DragonLairChoice({ character, onBack, onContinue }) {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const selectedStatInfo = selectedChoice
    ? getStatInfo(selectedChoice.statKey)
    : null;

  const selectedScore = selectedChoice
    ? character.stats[selectedChoice.statKey]
    : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_30%),radial-gradient(circle_at_bottom_right,_#c7d2fe,_transparent_30%),linear-gradient(135deg,_#f8fafc,_#eff6ff)] p-4 text-slate-950 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Button
          className="rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
          onClick={onBack}
        >
          Back to character choice
        </Button>

        <Card className="overflow-hidden rounded-[2.5rem] border border-white bg-white/90 shadow-2xl backdrop-blur">
          <div className={`h-4 bg-gradient-to-r ${character.color}`} />

          <CardContent className="p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">
                  <Mountain className="h-4 w-4" /> Scene 3 · The Foggy Mountains
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                  The dragon is asleep.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
                  You accept the king’s quest and travel deep into the Foggy
                  Mountains. At last, you find the blue dragon’s lair: a cavern
                  lit by pale lightning, scattered treasure, and the slow,
                  thunderous breathing of a sleeping monster.
                </p>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                  This time, you get to choose the approach. Each choice uses a
                  different stat, which means each character has a different
                  probability profile.
                </p>
              </div>

              <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl">
                <div className="flex items-center gap-4">
                  <CharacterAvatar character={character} size={96} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                      Adventurer
                    </p>
                    <h2 className="text-3xl font-black">{character.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {character.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                    Choose your own path
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Each plan uses a different stat. You can play to your
                    character’s strengths, take a risky path, or simply choose
                    the most entertaining option.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-black">How do you proceed?</h2>
              <p className="mt-1 text-sm text-slate-600">
                Pick a strategy. The stat attached to that strategy will shape
                the final probability calculation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {dragonChoices.map((choice) => {
                const StatIcon = getStatInfo(choice.statKey).icon;
                const ChoiceIcon = choice.icon;
                const score = character.stats[choice.statKey];
                const selected = selectedChoice?.id === choice.id;

                return (
                  <motion.button
                    key={choice.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedChoice(choice)}
                    className="text-left"
                  >
                    <Card
                      className={`h-full rounded-[2rem] border-2 bg-white shadow-lg transition ${
                        selected
                          ? "border-slate-950 shadow-2xl"
                          : "border-slate-100"
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className={`rounded-2xl border p-3 ${choice.tone}`}>
                            <ChoiceIcon className="h-6 w-6" />
                          </div>

                          {selected && (
                            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                              chosen
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 text-xl font-black text-slate-950">
                          {choice.title}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {choice.outcomePreview}
                        </p>

                        <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                          <div className="flex items-center gap-2">
                            <StatIcon className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-black text-slate-700">
                              {getStatInfo(choice.statKey).label}
                            </span>
                          </div>

                          <span className="text-lg font-black text-slate-950">
                            {score}{" "}
                            <span className="text-sm text-slate-500">
                              ({formatModifier(score)})
                            </span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <Card className="rounded-[2.5rem] border border-slate-200 bg-white/90 shadow-xl">
            <CardContent className="p-6">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                Your plan
              </p>

              {!selectedChoice ? (
                <div className="mt-4 rounded-[2rem] bg-slate-50 p-5">
                  <h2 className="text-3xl font-black text-slate-950">
                    Choose a strategy.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    The final probability problem will depend on which stat you
                    choose to rely on. A character can attempt any plan, but some
                    plans are more likely to work for some characters than
                    others.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-5"
                >
                  <div className={`rounded-[2rem] border p-5 ${selectedChoice.tone}`}>
                    <h2 className="text-2xl font-black">
                      {selectedChoice.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6">
                      {selectedChoice.outcomePreview}
                    </p>
                  </div>

                  <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                      Check type
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {selectedStatInfo.label} check
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                          Score
                        </p>
                        <p className="mt-1 text-3xl font-black">
                          {selectedScore}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                          Modifier
                        </p>
                        <p className="mt-1 text-3xl font-black">
                          {formatModifier(selectedScore)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] bg-slate-50 p-5">
                    <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                      Final probability check
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Next, calculate your chance of success before rolling. The
                      dragon encounter will use a{" "}
                      <span className="font-black">{selectedStatInfo.label}</span>{" "}
                      check.
                    </p>
                  </div>

                  <Button
                    onClick={() => onContinue(selectedChoice)}
                    className="w-full rounded-2xl bg-slate-950 text-white"
                  >
                    Continue with this plan{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DragonFinalCheck({ character, choice, onBack, onChangeChoice }) {
  const statInfo = getStatInfo(choice.statKey);
  const dc = 15;

  return (
    <CheckScene
      character={character}
      onBack={onBack}
      onContinue={onChangeChoice}
      continueText="Try a different approach"
      sceneBadge="🐉 Final Scene · The Sleeping Dragon"
      title="One roll decides the legend."
      statKey={choice.statKey}
      dc={dc}
      firstQuestionLabel="Question 5"
      secondQuestionLabel="Question 6"
      rollPanelTitle="The dragon encounter"
      rollButtonText={`Roll the ${statInfo.label} check`}
      successText={`${choice.successText} You return to the capital as a celebrated hero, and the grateful king rewards you with chests of gold, jewels, and enough riches to retire comfortably — or fund your next adventure.`}
      failureText={choice.failureText}
      backgroundClass="bg-[radial-gradient(circle_at_top_left,_#bfdbfe,_transparent_30%),radial-gradient(circle_at_bottom_right,_#fecaca,_transparent_30%),linear-gradient(135deg,_#eff6ff,_#fff1f2)]"
      intro={
        <>
          <p>
            You stand in the dragon’s lair. Treasure glitters beneath your feet.
            Blue sparks crackle around the creature’s sleeping jaws.
          </p>
          <p>
            Your chosen plan is:{" "}
            <span className="font-black">{choice.title}</span>
          </p>
          <p>
            This is the final check: a{" "}
            <span className="font-black">{statInfo.label} check</span> against
            DC {dc}. Calculate the probability first, then roll to decide your
            fate.
          </p>
        </>
      }
    />
  );
}

export default function DiceProbabilityLesson() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [selectedDragonChoice, setSelectedDragonChoice] = useState(null);
  const [page, setPage] = useState("choose");

  if (page === "tavern") {
    return (
      <TavernDartChallenge
        character={selectedCharacter}
        onBack={() => setPage("choose")}
        onContinue={() => setPage("messenger")}
      />
    );
  }

  if (page === "messenger") {
    return (
      <RoyalMessengerChallenge
        character={selectedCharacter}
        onBack={() => setPage("choose")}
        onContinue={() => setPage("dragon")}
      />
    );
  }

  if (page === "dragon") {
    return (
      <DragonLairChoice
        character={selectedCharacter}
        onBack={() => setPage("choose")}
        onContinue={(choice) => {
          setSelectedDragonChoice(choice);
          setPage("final");
        }}
      />
    );
  }

  if (page === "final" && selectedDragonChoice) {
    return (
      <DragonFinalCheck
        character={selectedCharacter}
        choice={selectedDragonChoice}
        onBack={() => setPage("dragon")}
        onChangeChoice={() => {
          setSelectedDragonChoice(null);
          setPage("dragon");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fef3c7,_transparent_30%),radial-gradient(circle_at_bottom_right,_#ddd6fe,_transparent_30%),linear-gradient(135deg,_#fff7ed,_#eef2ff)] p-4 text-slate-950 md:p-8">
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-amber-200 blur-3xl" />
        <div className="absolute bottom-20 right-16 h-40 w-40 rounded-full bg-violet-200 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white shadow-sm">
                <Sparkles className="h-4 w-4" /> Probability Quest
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                Choose your character.
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                In this lesson, probability begins with a choice. Every
                character uses the same six numbers, but each class places those
                numbers differently. That choice will change their chances once
                the dice start rolling.
              </p>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                Lesson goal
              </p>
              <p className="mt-2 max-w-56 text-xl font-black">
                Use d20 rolls to understand probability.
              </p>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">Character menu</h2>
                <p className="text-sm text-slate-600">
                  Pick a class. You can change your choice before continuing.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  selected={selectedCharacter.id === character.id}
                  onSelect={setSelectedCharacter}
                />
              ))}
            </div>
          </div>

          <SelectedCharacterPanel
            character={selectedCharacter}
            onContinue={() => setPage("tavern")}
          />
        </div>
      </div>
    </div>
  );
}
