import { createSignal, createEffect } from "solid-js";

const GradientShape = (props) => {
  const [shape, setShape] = createSignal(props.shape || "circle");
  const [theme, setTheme] = createSignal(props.theme || "cosmic");
  const [morphSpeed, setMorphSpeed] = createSignal(props.speed || 3);

  const shapes = {
    circle: "rounded-full",
    square: "rounded-none",
    blob: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
    diamond: "rotate-45",
    hexagon:
      "clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  };

  const themes = {
    cosmic: {
      colors: "from-purple-600 via-pink-600 to-blue-600",
      blur: "20px",
    },
    aurora: {
      colors: "from-green-400 via-cyan-500 to-blue-600",
      blur: "15px",
    },
    sunset: {
      colors: "from-orange-500 via-red-600 to-purple-700",
      blur: "12px",
    },
    neon: {
      colors: "from-pink-500 via-purple-500 to-indigo-500",
      blur: "18px",
    },
  };

  const getMorphingAnimation = () => {
    const baseClasses = "transition-all duration-1000 ease-in-out";
    return `${baseClasses} ${shapes[shape()]}`;
  };

  return (
    <div class="gradient-shape-container">
      <div
        class={getMorphingAnimation()}
        style={{
          width: "200px",
          height: "200px",
          background: `linear-gradient(to right, ${themes[theme()].colors.split(" ").join(", ")})`,
          "background-size": "200% 200%",
          animation: `morphGradient ${morphSpeed()}s ease infinite`,
          filter: `blur(${themes[theme()].blur})`,
        }}
      >
        {props.children}
      </div>

      <div class="flex gap-4 mt-4">
        <div class="space-y-2">
          <label class="block text-sm opacity-70">Shape</label>
          <div class="flex gap-2">
            {Object.keys(shapes).map((shapeName) => (
              <button
                class={`px-3 py-1 rounded-md text-sm ${shape() === shapeName ? "bg-primary text-white" : "bg-base-200"}`}
                onClick={() => setShape(shapeName)}
              >
                {shapeName}
              </button>
            ))}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm opacity-70">Theme</label>
          <div class="flex gap-2">
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

        <div class="space-y-2 min-w-[200px]">
          <label class="block text-sm opacity-70">Morph Speed</label>
          <input
            type="range"
            class="range range-primary"
            min="1"
            max="10"
            step="0.5"
            value={morphSpeed()}
            onChange={(e) => setMorphSpeed(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default GradientShape;
