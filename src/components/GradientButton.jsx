import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

const GradientButton = (props) => {
  // Console group for component lifecycle logging
  console.group("GradientButton Component");

  try {
    // State management
    const [theme, setTheme] = createSignal(props.theme || "rainbow");
    const [isHovered, setIsHovered] = createSignal(false);
    const [isPressed, setIsPressed] = createSignal(false);
    const [ripples, setRipples] = createStore([]);

    // Theme configurations with fallbacks
    const themes = {
      rainbow: {
        colors:
          "from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
        duration: "3s",
      },
      neon: {
        colors: "from-fuchsia-500 via-violet-500 to-indigo-500",
        duration: "2s",
      },
      sunset: {
        colors: "from-orange-500 via-red-500 to-pink-500",
        duration: "2.5s",
      },
      ocean: {
        colors: "from-cyan-500 via-blue-500 to-indigo-500",
        duration: "3s",
      },
    };

    // Validate theme on mount
    onMount(() => {
      console.log("GradientButton: Mounting with theme:", theme());
      if (!themes[theme()]) {
        console.warn(
          `GradientButton: Invalid theme '${theme()}', falling back to 'rainbow'`,
        );
        setTheme("rainbow");
      }
    });

    // Cleanup function
    onCleanup(() => {
      console.log("GradientButton: Cleaning up component");
      console.groupEnd();
    });

    // Ripple effect handler
    const createRipple = (event) => {
      try {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(button.offsetWidth, button.offsetHeight);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = {
          id: Date.now(),
          size,
          x,
          y,
        };

        console.log("GradientButton: Creating ripple effect:", ripple);
        setRipples([...ripples, ripple]);

        // Cleanup ripple after animation
        setTimeout(() => {
          setRipples(ripples.filter((r) => r.id !== ripple.id));
        }, 1000);
      } catch (error) {
        console.error("GradientButton: Error creating ripple effect:", error);
      }
    };

    // Dynamic class generation
    const getButtonClass = () => {
      try {
        const baseClasses =
          "relative overflow-hidden rounded-lg transition-all duration-300";
        const hoverClasses = isHovered() ? "scale-[1.02] shadow-lg" : "";
        const pressedClasses = isPressed() ? "scale-[0.98]" : "";
        const themeClasses = `bg-gradient-to-r ${themes[theme()].colors}`;

        return `${baseClasses} ${hoverClasses} ${pressedClasses} ${themeClasses}`;
      } catch (error) {
        console.error(
          "GradientButton: Error generating button classes:",
          error,
        );
        return "relative overflow-hidden rounded-lg"; // Fallback classes
      }
    };

    return (
      <div class="gradient-button-container">
        <button
          class={getButtonClass()}
          style={{
            animation: `gradient ${themes[theme()].duration} linear infinite`,
            "background-size": "200% auto",
          }}
          onMouseEnter={() => {
            console.log("GradientButton: Mouse enter event");
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            console.log("GradientButton: Mouse leave event");
            setIsHovered(false);
          }}
          onMouseDown={(e) => {
            console.log("GradientButton: Mouse down event");
            setIsPressed(true);
            createRipple(e);
          }}
          onMouseUp={() => {
            console.log("GradientButton: Mouse up event");
            setIsPressed(false);
          }}
          {...props}
        >
          <div class="relative px-6 py-3 text-white font-medium">
            {props.children}
          </div>

          {/* Ripple effects */}
          {ripples.map((ripple) => (
            <div
              class="absolute rounded-full bg-white/30 animate-ripple"
              style={{
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
              }}
            />
          ))}
        </button>

        {/* Theme selector */}
        <div class="flex gap-2 mt-4">
          {Object.keys(themes).map((themeName) => (
            <button
              class={`px-3 py-1 rounded-md text-sm ${theme() === themeName ? "bg-primary text-white" : "bg-base-200"}`}
              onClick={() => {
                console.log("GradientButton: Theme changed to:", themeName);
                setTheme(themeName);
              }}
            >
              {themeName}
            </button>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("GradientButton: Fatal error in component:", error);
    return <div class="text-error">Error rendering gradient button</div>;
  }
};

export default GradientButton;
