import { createSignal, createEffect } from "solid-js";

const GradientBorder = (props) => {
  const [theme, setTheme] = createSignal(props.theme || "rainbow");
  const [isHovered, setIsHovered] = createSignal(false);
  const [borderWidth, setBorderWidth] = createSignal(props.borderWidth || 2);
  const [duration, setDuration] = createSignal(props.duration || 3);

  const themes = {
    rainbow:
      "from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
    cyber: "from-cyan-400 via-blue-500 to-purple-600",
    fire: "from-yellow-500 via-orange-500 to-red-500",
    nature: "from-green-400 via-emerald-500 to-teal-600",
    neon: "from-pink-500 via-purple-500 to-indigo-500",
  };

  return (
    <div class="relative inline-block">
      <div
        class={`relative overflow-hidden rounded-lg p-[2px] transition-all duration-300 ${isHovered() ? "scale-[1.02]" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          class="absolute inset-0 rounded-lg"
          style={{
            background: `conic-gradient(from 0deg, ${themes[theme()].split(" ").join(", ")})`,
            animation: `rotate ${duration()}s linear infinite`,
            opacity: isHovered() ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        />
        <div
          class="relative rounded-[calc(0.5rem-1px)] bg-base-100 p-4"
          style={{
            margin: `${borderWidth()}px`,
          }}
        >
          {props.children}
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        {Object.keys(themes).map((themeName) => (
          <button
            class={`px-3 py-1 rounded-md text-sm ${theme() === themeName ? "bg-primary text-white" : "bg-base-200"}`}
            onClick={() => setTheme(themeName)}
          >
            {themeName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GradientBorder;
