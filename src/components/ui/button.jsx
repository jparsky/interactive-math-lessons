export function Button({
  className = "",
  variant = "default",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50";

  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-950 hover:bg-slate-100"
      : variant === "ghost"
        ? "bg-transparent text-slate-950 hover:bg-slate-100"
        : "bg-slate-950 text-white hover:bg-slate-800";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}