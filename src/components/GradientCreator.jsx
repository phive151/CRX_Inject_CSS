import { createSignal, createEffect, Show, For, onMount } from "solid-js";
import {
  FaSolidPlus,
  FaSolidPlay,
  FaSolidPause,
  FaSolidXmark,
} from "solid-icons/fa";
import { HuePicker, AlphaPicker } from "solid-color";

const GradientCreator = () => {
  const [colors, setColors] = createSignal([]);
  const [currentColor, setCurrentColor] = createSignal("#ffffff");
  const [isTransparent, setIsTransparent] = createSignal(false);
  const [transparencySpread, setTransparencySpread] = createSignal(25); // percentage
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [showPicker, setShowPicker] = createSignal(false);
  const [gradientName, setGradientName] = createSignal("");
  const [savedGradients, setSavedGradients] = createSignal([]);
  const [showSavedGradients, setShowSavedGradients] = createSignal(false);

  // Load saved gradients on mount
  onMount(async () => {
    const { savedGradients = [] } =
      await chrome.storage.sync.get("savedGradients");
    setSavedGradients(savedGradients);
  });

  createEffect(() => {
    console.log("Current Color:", currentColor());
    console.log("Is Transparent:", isTransparent());
    console.log("Transparency Spread:", transparencySpread());
    console.log("Saved Colors:", colors());
    updateGradient();
  });

  const updateGradient = () => {
    const gradientEl = document.querySelector(".gradient-preview");
    if (!gradientEl) return;

    const colorsList = colors();
    if (colorsList.length === 0) {
      gradientEl.style.background = "#ffffff";
      return;
    }

    let gradientColors = [...colorsList];

    // If transparency is enabled, modify the colors to include transparent segments
    if (isTransparent()) {
      const spread = transparencySpread() / 100;
      const totalDegrees = 360;
      const spreadDegrees = totalDegrees * spread;
      const halfSpread = spreadDegrees / 2;
      const transitionLength = halfSpread / 3; // Create a smoother transition

      // Create gradient stops with smooth transitions on both ends
      gradientColors = [
        `rgba(0,0,0,0) 0deg`,
        `rgba(0,0,0,0) ${halfSpread - transitionLength}deg`,
        `${colorsList[0]} ${halfSpread}deg`,
        ...colorsList.map((color, index) => {
          const position =
            (index / colorsList.length) * (totalDegrees - spreadDegrees) +
            halfSpread;
          return `${color} ${position}deg`;
        }),
        `${colorsList[colorsList.length - 1]} ${totalDegrees - halfSpread}deg`,
        `rgba(0,0,0,0) ${totalDegrees - halfSpread + transitionLength}deg`,
        `rgba(0,0,0,0) ${totalDegrees}deg`,
      ];
    } else {
      // Regular color gradient
      gradientColors = [
        ...gradientColors,
        colorsList[0], // Add first color to end for continuity
      ];
    }

    const gradient = gradientColors.join(", ");
    gradientEl.style.background = `conic-gradient(from 0deg, ${gradient})`;
  };

  const addColor = () => {
    if (colors().length >= 10) return;

    const style = currentColorStyle();
    console.log("Adding Color:", style);
    setColors((prev) => [...prev, style]);
    setShowPicker(false);
    setCurrentColor("#ffffff");
  };

  const removeColor = (index) => {
    setColors(colors().filter((_, i) => i !== index));
  };

  const hexToRgb = (hex) => {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };

  const resetColors = () => {
    setColors([]);
    setShowPicker(false);
    setCurrentColor("#ffffff");
    setIsTransparent(false);
    setTransparencySpread(25);
    setIsPlaying(false);
  };

  const handleHueChange = (colorObj) => {
    console.log("Hue Changed:", colorObj);
    // The color object has a different structure than expected
    // Let's handle both possible formats
    if (typeof colorObj === "string") {
      setCurrentColor(colorObj);
    } else if (colorObj.rgb) {
      const { r, g, b } = colorObj.rgb;
      setCurrentColor(rgbToHex(r, g, b));
    } else if (colorObj.hex) {
      setCurrentColor(colorObj.hex);
    }
  };

  const handleAlphaChange = (alpha) => {
    console.log("Alpha Changed:", alpha);
    if (typeof alpha === "number") {
      setIsTransparent(alpha === 0);
    }
  };

  // Add helper function to convert RGB to Hex
  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const currentColorStyle = (transparent = false) => {
    const rgb = hexToRgb(currentColor());
    const alpha = transparent ? 0 : 1;
    return `rgba(${rgb.join(",")},${alpha})`;
  };

  const saveGradient = async () => {
    if (!gradientName() || colors().length === 0) return;

    const newGradient = {
      id: Date.now(),
      name: gradientName(),
      colors: colors(),
      isTransparent: isTransparent(),
      transparencySpread: transparencySpread(),
    };

    const updatedGradients = [...savedGradients(), newGradient];
    await chrome.storage.sync.set({ savedGradients: updatedGradients });
    setSavedGradients(updatedGradients);
    setGradientName("");
  };

  const loadGradient = (gradient) => {
    setColors(gradient.colors);
    setIsTransparent(gradient.isTransparent);
    setTransparencySpread(gradient.transparencySpread);
    setShowSavedGradients(false);
  };

  const deleteGradient = async (id) => {
    const updatedGradients = savedGradients().filter((g) => g.id !== id);
    await chrome.storage.sync.set({ savedGradients: updatedGradients });
    setSavedGradients(updatedGradients);
  };

  const toggleAnimation = () => {
    const gradientEl = document.querySelector(".gradient-preview");
    if (!gradientEl) return;

    setIsPlaying(!isPlaying());
    if (isPlaying()) {
      gradientEl.style.animation = "rotate 3s linear infinite";
    } else {
      gradientEl.style.animation = "none";
    }
  };

  return (
    <div class="gradient-creator p-4 bg-base-200 rounded-lg">
      <div
        class={`gradient-preview h-64 rounded-lg relative mb-4 ${isPlaying() ? "playing" : ""}`}
      >
        {/* Preview card */}
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="color-preview-card w-32 h-32 rounded-lg shadow-lg">
            <div
              class="w-full h-full"
              style={{
                "background-color": currentColorStyle(),
                opacity: currentColorStyle(true),
              }}
            />
          </div>
        </div>

        {/* Color circles */}
        <div class="absolute bottom-4 left-4 flex gap-2">
          <For each={colors()}>
            {(color, index) => (
              <div
                class="color-circle w-8 h-8 rounded-full cursor-pointer relative"
                style={{
                  "background-color": color,
                  border: "2px solid white",
                }}
                onMouseEnter={(e) =>
                  e.currentTarget
                    .querySelector(".delete-icon")
                    .classList.remove("hidden")
                }
                onMouseLeave={(e) =>
                  e.currentTarget
                    .querySelector(".delete-icon")
                    .classList.add("hidden")
                }
              >
                <div
                  class="delete-icon hidden absolute -top-1 -right-1 bg-error rounded-full p-1"
                  onClick={() => removeColor(index())}
                >
                  <FaSolidXmark size={12} class="text-white" />
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Controls */}
        <div class="absolute bottom-4 right-4 flex gap-2">
          <button class="btn btn-circle btn-primary" onClick={toggleAnimation}>
            <Show when={!isPlaying()} fallback={<FaSolidPause size={20} />}>
              <FaSolidPlay size={20} />
            </Show>
          </button>
        </div>
      </div>

      {/* Color Picker Controls - Modified */}
      <div class="color-picker-card bg-base-100 p-4 rounded-lg">
        <div class="grid grid-cols-[1fr,auto] gap-4 items-end">
          <div class="space-y-4">
            <div>
              <label class="block text-sm mb-2">Color</label>
              <HuePicker
                color={currentColor()}
                onChange={handleHueChange}
                onInput={handleHueChange}
              />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-2">
                <label class="block text-sm">Transparency</label>
                <input
                  type="checkbox"
                  class="toggle toggle-primary"
                  checked={isTransparent()}
                  onChange={(e) => setIsTransparent(e.target.checked)}
                />
              </div>
              <Show when={isTransparent()}>
                <div class="space-y-2">
                  <label class="block text-xs opacity-70">Spread (%)</label>
                  <input
                    type="range"
                    class="range range-primary"
                    min="1"
                    max="100"
                    step="1"
                    value={transparencySpread()}
                    onChange={(e) =>
                      setTransparencySpread(parseInt(e.target.value))
                    }
                  />
                  <div class="flex justify-between text-xs opacity-70">
                    <span>1%</span>
                    <span>{transparencySpread()}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </Show>
            </div>
          </div>
          <button
            class="btn btn-primary h-12 w-12 btn-circle"
            onClick={addColor}
            disabled={colors().length >= 10}
          >
            <FaSolidPlus size={20} />
          </button>
        </div>

        {/* Save Gradient Section */}
        <div class="mt-4 pt-4 border-t border-base-300">
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm mb-2">Gradient Name</label>
              <input
                type="text"
                class="input input-bordered w-full"
                value={gradientName()}
                onChange={(e) => setGradientName(e.target.value)}
                placeholder="Enter gradient name"
              />
            </div>
            <button
              class="btn btn-primary"
              onClick={saveGradient}
              disabled={!gradientName() || colors().length === 0}
            >
              Save Gradient
            </button>
          </div>
        </div>

        {/* Saved Gradients Dropdown */}
        <div class="mt-4">
          <button
            class="btn btn-outline w-full"
            onClick={() => setShowSavedGradients(!showSavedGradients())}
          >
            {showSavedGradients() ? "Hide" : "Show"} Saved Gradients
          </button>
          <Show when={showSavedGradients()}>
            <div class="mt-2 space-y-2 max-h-48 overflow-y-auto">
              <For each={savedGradients()}>
                {(gradient) => (
                  <div class="flex items-center gap-2 p-2 bg-base-200 rounded-lg">
                    <div
                      class="w-8 h-8 rounded-full cursor-pointer"
                      style={{
                        background: `conic-gradient(from 0deg, ${gradient.colors.join(", ")})`,
                      }}
                      onClick={() => loadGradient(gradient)}
                    />
                    <span class="flex-1">{gradient.name}</span>
                    <button
                      class="btn btn-ghost btn-xs"
                      onClick={() => deleteGradient(gradient.id)}
                    >
                      <FaSolidXmark size={12} />
                    </button>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <button class="btn btn-error" onClick={resetColors}>
          Reset All
        </button>
      </div>
    </div>
  );
};

export default GradientCreator;
