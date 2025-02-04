import { createSignal } from "solid-js";

const GradientText = (props) => {
  const [theme, setTheme] = createSignal(props.theme || "rainbow");

  const themes = {
    rainbow:
      "from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
    sunset: "from-orange-500 via-red-500 to-pink-500",
    ocean: "from-cyan-500 via-blue-500 to-indigo-500",
    forest: "from-green-500 via-emerald-500 to-teal-500",
    neon: "from-fuchsia-500 via-violet-500 to-indigo-500",
  };

  const getGradientClass = () => {
    const baseClasses =
      "bg-gradient-to-r bg-clip-text text-transparent animate-gradient";
    return `${baseClasses} ${themes[theme()]}`;
  };

  return (
    <div class="gradient-text-container">
      <h1
        class={getGradientClass()}
        style={{
          "background-size": "200% auto",
          animation: "gradient 3s linear infinite",
        }}
      >
        {props.children}
      </h1>
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

export default GradientText;
