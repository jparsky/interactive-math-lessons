export function Slider({ value, min, max, step, onValueChange, className = "" }) {
  const currentValue = Array.isArray(value) ? value[0] : value;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onChange={(event) => onValueChange([Number(event.target.value)])}
      className={`w-full accent-slate-950 ${className}`}
    />
  );
}