# Interactive Math Lessons

An interactive learning portfolio built with JavaScript, React, Vite, Tailwind CSS, Framer Motion, Recharts, and custom UI components. This project explores how math and probability concepts can be taught through visual feedback, guided interaction, and narrative-driven design.

Live site: [Interactive Math Lessons](https://jparsky.github.io/interactive-math-lessons/)

## Overview

This project is a collection of interactive math learning experiences designed to make abstract concepts feel more intuitive and engaging. Instead of presenting formulas as static text, each lesson invites the learner to experiment, make predictions, receive feedback, and see the consequences of their choices.

The project currently includes lessons on Taylor approximations, Fourier-style heat flow, and probability through dice-based roleplaying scenarios.

## Lessons

### Taylor Approximation Explorer

An interactive lesson that helps learners understand how Taylor polynomials approximate functions. Users can adjust the function, expansion point, and polynomial degree to see how the approximation changes in real time.

Key concepts:

* Function approximation
* Taylor polynomials
* Local versus global accuracy
* Visual comparison between a function and its approximation

### Fourier Heat Flow Explorer

A visual exploration of how Fourier-style components can model heat flow over time. The lesson uses interactive graphs and explanatory structure to connect mathematical equations with changing physical behavior.

Key concepts:

* Fourier components
* Heat diffusion
* Time-dependent change
* Mathematical modeling

### Probability Quest

A narrative-based probability lesson inspired by tabletop roleplaying games. Learners choose a character, make decisions, calculate probabilities, and roll a virtual d20 to see how their choices play out.

Key concepts:

* Probability as favorable outcomes over total outcomes
* Dice rolls and modifiers
* Difficulty classes
* How changes in modifiers affect probability
* Decision-making under uncertainty

## Why I Built This

I built this project to combine my interests in computer science, education, mathematics, and interactive design. My goal was to create learning tools that are not only accurate, but also engaging and approachable.

The project reflects several priorities:

* **Interactivity:** learners should be able to manipulate inputs and immediately see results.
* **Clarity:** each lesson should break a concept into small, understandable steps.
* **Feedback:** users should receive clear responses based on their choices and answers.
* **Visual learning:** graphs, animation, and layout should support understanding rather than distract from it.
* **Narrative design:** math can feel more meaningful when it is connected to a scenario or goal.

## Tech Stack

- **JavaScript** for application logic and interactive lesson behavior
- **React** for component-based UI development
- **Vite** for fast local development and production builds
- **Tailwind CSS** for responsive styling
- **Framer Motion** for animation and transitions
- **Recharts** for data visualization
- **Lucide React** for icons
- **GitHub Pages** for deployment

## Features

* Multi-lesson navigation
* Interactive sliders and controls
* Real-time visual feedback
* Animated dice rolls
* Probability answer checking
* Narrative branching in the probability lesson
* Responsive layout for different screen sizes
* Deployed static site through GitHub Pages

## Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/jparsky/interactive-math-lessons.git
cd interactive-math-lessons
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is deployed with GitHub Pages using GitHub Actions. The Vite configuration includes the correct base path for the repository:

```js
base: "/interactive-math-lessons/"
```

After changes are pushed to the main branch, GitHub Actions builds and deploys the site automatically.

## Project Structure

```text
src/
  components/
    ui/
      button.jsx
      card.jsx
      slider.jsx
  lessons/
    TaylorLesson.jsx
    FourierHeatFlowExplorer.jsx
    DiceProbabilityLesson.jsx
  App.jsx
```

## Future Improvements

Planned or possible future additions include:

* More lessons covering statistics, calculus, and linear algebra
* Additional graph-based visualizations
* More advanced probability simulations
* Better accessibility support
* Expanded lesson explanations and reflection questions
* A more polished landing page for browsing lessons
* Optional quiz summaries at the end of each lesson

## About

Created by Jacob Parsky as part of a growing software development and interactive learning design portfolio. This project demonstrates front-end development, mathematical visualization, educational design, and React-based application structure.
