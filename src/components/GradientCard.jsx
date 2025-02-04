import { createSignal, createEffect, onMount, onCleanup } from "solid-js";

const GradientCard = (props) => {
  console.group("GradientCard Component");

  try {
    // State management with fallbacks
    const [pattern, setPattern] = createSignal(props.pattern || "morphing");
    const [theme, setTheme] = createSignal(props.theme || "cosmic");
    const [speed, setSpeed] = createSignal(props.speed || 3);
    const [intensity, setIntensity] = createSignal(props.intensity || 0.5);

    // Theme configurations
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
      mystic: {
        colors: "from-indigo-500 via-purple-500 to-pink-500",
        blur: "18px",
      },
    };

    // Pattern configurations
    const patterns = {
      morphing: {
        base: "radial-gradient(circle at",
        positions: ["0% 0%", "100% 0%", "100% 100%", "0% 100%"],
      },
      wave: {
        base: "linear-gradient(",
        angles: ["0deg", "45deg", "90deg", "135deg"],
      },
      pulse: {
        base: "radial-gradient(circle at 50% 50%",
        scales: ["100%", "120%", "140%", "120%"],
      },
    };

    // Component lifecycle logging
    onMount(() => {
      console.log("GradientCard: Mounting with configuration:", {
        pattern: pattern(),
        theme: theme(),
        speed: speed(),
        intensity: intensity(),
      });

      // Validate configurations
      if (!themes[theme()]) {
        console.warn(
          `GradientCard: Invalid theme '${theme()}', falling back to 'cosmic'`,
        );
        setTheme("cosmic");
      }
      if (!patterns[pattern()]) {
        console.warn(
          `GradientCard: Invalid pattern '${pattern()}', falling back to 'morphing'`,
        );
        setPattern("morphing");
      }
    });

    onCleanup(() => {
      console.log("GradientCard: Cleaning up component");
      console.groupEnd();
    });

    // Dynamic gradient generation
    const generateGradient = () => {
      try {
        const currentTheme = themes[theme()];
        const currentPattern = patterns[pattern()];
        const colors = currentTheme.colors;

        let gradientStyle = "";

        switch (pattern()) {
          case "morphing":
            const position =
              currentPattern.positions[Math.floor(Date.now() / 1000) % 4];
            gradientStyle = `${currentPattern.base} ${position}, ${colors})`;
            break;
          case "wave":
            const angle =
              currentPattern.angles[Math.floor(Date.now() / 1000) % 4];
            gradientStyle = `${currentPattern.base}${angle}, ${colors})`;
            break;
          case "pulse":
            const scale =
              currentPattern.scales[Math.floor(Date.now() / 1000) % 4];
            gradientStyle = `${currentPattern.base}, ${scale}, ${colors})`;
            break;
          default:
            console.warn("GradientCard: Falling back to default gradient");
            gradientStyle = `radial-gradient(circle at center, ${colors})`;
        }

        return gradientStyle;
      } catch (error) {
        console.error("GradientCard: Error generating gradient:", error);
        return "linear-gradient(to right, #cbd5e1, #94a3b8)"; // Fallback gradient
      }
    };

    // Dynamic class generation
    const getCardClass = () => {
      try {
        const baseClasses =
          "relative overflow-hidden rounded-xl shadow-xl transition-all duration-300";
        const themeClasses = `bg-gradient-to-r ${themes[theme()].colors}`;
        return `${baseClasses} ${themeClasses}`;
      } catch (error) {
        console.error("GradientCard: Error generating card classes:", error);
        return "relative overflow-hidden rounded-xl"; // Fallback classes
      }
    };

    return (
      <div class="gradient-card-container">
        <div
          class={getCardClass()}
          style={{
            "min-height": "200px",
            "background-image": generateGradient(),
            "background-size": "200% 200%",
            animation: `gradient ${speed()}s ease infinite`,
            filter: `blur(${themes[theme()].blur}) opacity(${intensity()})`,
          }}
        >
          <div class="relative z-10 p-6 backdrop-blur-sm bg-white/10">
            {props.children}
          </div>
        </div>

        {/* Controls */}
        <div class="flex flex-wrap gap-4 mt-4">
          <div class="space-y-2">
            <label class="block text-sm opacity-70">Pattern</label>
            <div class="flex gap-2">
              {Object.keys(patterns).map((patternName) => (
                <button
                  class={`px-3 py-1 rounded-md text-sm ${pattern() === patternName ? "bg-primary text-white" : "bg-base-200"}`}
                  onClick={() => {
                    console.log(
                      "GradientCard: Pattern changed to:",
                      patternName,
                    );
                    setPattern(patternName);
                  }}
                >
                  {patternName}
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
                    console.log("GradientCard: Theme changed to:", themeName);
                    setTheme(themeName);
                  }}
                >
                  {themeName}
                </button>
              ))}
            </div>
          </div>

          <div class="space-y-2 min-w-[200px]">
            <label class="block text-sm opacity-70">Animation Speed</label>
            <input
              type="range"
              class="range range-primary"
              min="1"
              max="10"
              step="0.5"
              value={speed()}
              onChange={(e) => {
                const newSpeed = parseFloat(e.target.value);
                console.log("GradientCard: Speed changed to:", newSpeed);
                setSpeed(newSpeed);
              }}
            />
          </div>

          <div class="space-y-2 min-w-[200px]">
            <label class="block text-sm opacity-70">Intensity</label>
            <input
              type="range"
              class="range range-primary"
              min="0.1"
              max="1"
              step="0.1"
              value={intensity()}
              onChange={(e) => {
                const newIntensity = parseFloat(e.target.value);
                console.log(
                  "GradientCard: Intensity changed to:",
                  newIntensity,
                );
                setIntensity(newIntensity);
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("GradientCard: Fatal error in component:", error);
    return <div class="text-error">Error rendering gradient card</div>;
  }
};

export default GradientCard;
