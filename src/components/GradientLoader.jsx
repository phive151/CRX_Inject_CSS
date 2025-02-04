import { createSignal, createEffect } from "solid-js";

const GradientLoader = (props) => {
  console.group("GradientLoader Component");

  try {
    const [size, setSize] = createSignal(props.size || "md");
    const [theme, setTheme] = createSignal(props.theme || "primary");
    const [pulseSpeed, setPulseSpeed] = createSignal(props.speed || 1.5);

    const sizes = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
      xl: "w-20 h-20",
    };

    const themes = {
      primary: {
        colors: "from-blue-500 via-blue-600 to-blue-700",
        glow: "blue",
      },
      success: {
        colors: "from-green-500 via-green-600 to-green-700",
        glow: "green",
      },
      warning: {
        colors: "from-yellow-500 via-yellow-600 to-yellow-700",
        glow: "yellow",
      },
      error: {
        colors: "from-red-500 via-red-600 to-red-700",
        glow: "red",
      },
    };

    const getLoaderClass = () => {
      try {
        const baseClasses = "rounded-full animate-pulse";
        const sizeClass = sizes[size()];
        const themeClasses = `bg-gradient-to-r ${themes[theme()].colors}`;
        return `${baseClasses} ${sizeClass} ${themeClasses}`;
      } catch (error) {
        console.error(
          "GradientLoader: Error generating loader classes:",
          error,
        );
        return "rounded-full w-12 h-12"; // Fallback classes
      }
    };

    return (
      <div class="gradient-loader-container">
        <div
          class={getLoaderClass()}
          style={{
            animation: `pulse ${pulseSpeed()}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            filter: `drop-shadow(0 0 10px ${themes[theme()].glow})`,
          }}
        />

        <div class="flex gap-4 mt-4">
          <div class="space-y-2">
            <label class="block text-sm opacity-70">Size</label>
            <div class="flex gap-2">
              {Object.keys(sizes).map((sizeName) => (
                <button
                  class={`px-3 py-1 rounded-md text-sm ${size() === sizeName ? "bg-primary text-white" : "bg-base-200"}`}
                  onClick={() => {
                    console.log("GradientLoader: Size changed to:", sizeName);
                    setSize(sizeName);
                  }}
                >
                  {sizeName}
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
                  onClick={() => {
                    console.log("GradientLoader: Theme changed to:", themeName);
                    setTheme(themeName);
                  }}
                >
                  {themeName}
                </button>
              ))}
            </div>
          </div>

          <div class="space-y-2 min-w-[200px]">
            <label class="block text-sm opacity-70">Pulse Speed</label>
            <input
              type="range"
              class="range range-primary"
              min="0.5"
              max="3"
              step="0.1"
              value={pulseSpeed()}
              onChange={(e) => {
                const newSpeed = parseFloat(e.target.value);
                console.log("GradientLoader: Speed changed to:", newSpeed);
                setPulseSpeed(newSpeed);
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("GradientLoader: Fatal error in component:", error);
    console.groupEnd();
    return <div class="text-error">Error rendering gradient loader</div>;
  }
};

export default GradientLoader;
