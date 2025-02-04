import { createSignal } from "solid-js";

const GradientBackground = (props) => {
  const [pattern, setPattern] = createSignal(props.pattern || "radial");
  const [theme, setTheme] = createSignal(props.theme || "aurora");
  const [speed, setSpeed] = createSignal(props.speed || 3);

  const gradientThemes = {
    aurora: "from-blue-400 via-teal-500 to-purple-600",
    sunset: "from-orange-400 via-pink-500 to-purple-600",
    candy: "from-pink-400 via-purple-500 to-indigo-600",
    forest: "from-green-400 via-emerald-500 to-teal-600",
    ocean: "from-blue-400 via-cyan-500 to-teal-600",
  };

  const patterns = {
    radial: (theme) =>
      `radial-gradient(circle at center, ${theme.split(" ").join(", ")})`,
    conic: (theme) =>
      `conic-gradient(from 0deg, ${theme.split(" ").join(", ")})`,
    diagonal: (theme) =>
      `linear-gradient(45deg, ${theme.split(" ").join(", ")})`,
  };

  return (
    <div class="relative min-h-[200px] w-full overflow-hidden rounded-xl">
      <div
        class="absolute inset-0 transition-opacity duration-500"
        style={{
          background: patterns[pattern()](themes[theme()]),
          "background-size": "200% 200%",
          animation: `gradient ${speed()}s ease infinite`,
          filter: "blur(0px)",
          transform: "scale(1.1)",
        }}
      />
      <div class="relative z-10 p-6">{props.children}</div>

      <div class="absolute bottom-4 left-4 flex gap-4">
        <div class="flex gap-2">
          {Object.keys(patterns).map((patternName) => (
            <button
              class={`px-3 py-1 rounded-md text-sm bg-white/10 backdrop-blur-sm
                ${pattern() === patternName ? "ring-2 ring-white/50" : ""}`}
              onClick={() => setPattern(patternName)}
            >
              {patternName}
            </button>
          ))}
        </div>

        <div class="flex gap-2">
          {Object.keys(themes).map((themeName) => (
            <button
              class={`px-3 py-1 rounded-md text-sm bg-white/10 backdrop-blur-sm
                ${theme() === themeName ? "ring-2 ring-white/50" : ""}`}
              onClick={() => setTheme(themeName)}
            >
              {themeName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradientBackground;
