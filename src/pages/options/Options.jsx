import { createSignal, onMount } from "solid-js";
import GradientCreator from "@components/GradientCreator";
import "./options.css";
import { FaSolidXmark } from "solid-icons/fa";

const Options = () => {
  const [settings, setSettings] = createSignal({
    borderWidth: 3,
    animationSpeed: 3,
    theme: "dark",
    defaultStyle: "rainbow",
  });

  const [message, setMessage] = createSignal("");
  const [savedGradients, setSavedGradients] = createSignal([]);

  onMount(async () => {
    // Load saved settings
    const stored = await chrome.storage.sync.get("settings");
    if (stored.settings) {
      setSettings(stored.settings);
    }
  });

  const saveSettings = async () => {
    try {
      await chrome.storage.sync.set({ settings: settings() });
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error saving settings");
      console.error("Settings save error:", error);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const loadGradient = (gradient) => {
    // Implementation of loadGradient function
  };

  const deleteGradient = (id) => {
    // Implementation of deleteGradient function
  };

  return (
    <div class="options-wrapper">
      <div class="w-full min-h-screen p-8">
        <h1 class="text-3xl font-bold mb-8">Border Animation Settings</h1>

        {/* Preview Section */}
        <div class="preview-section mb-8">
          <h2 class="text-xl font-semibold mb-4">Preview</h2>
          <div class="preview-container flex justify-center items-center p-8 bg-base-200 rounded-lg">
            <div
              class="preview-element btn btn-lg min-w-64 min-h-32 flex items-center justify-center"
              style={{
                "--gradient-colors":
                  "#ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000",
                "--duration": `${settings().animationSpeed}s`,
                "--border-width": `${settings().borderWidth}px`,
                "--glow-color": "rgba(255, 0, 0, 0.5)",
              }}
            >
              Hover to Preview
            </div>
          </div>
        </div>

        {/* Theme Toggle Navbar */}
        <div class="navbar bg-base-200 mb-8 w-full">
          <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl">
              Border Animation Settings
            </a>
          </div>
          <div class="flex-none">
            <label class="swap swap-rotate">
              <input
                type="checkbox"
                checked={settings().theme === "dark"}
                onChange={(e) => {
                  const newTheme = e.target.checked ? "dark" : "light";
                  updateSetting("theme", newTheme);
                  document.documentElement.setAttribute("data-theme", newTheme);
                }}
              />
              <svg
                class="swap-on fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              <svg
                class="swap-off fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
        </div>

        {/* Main content grid with adjusted columns - ensure full width */}
        <div class="grid grid-cols-12 gap-8 w-full">
          {/* Left column - Settings (4 columns) */}
          <div class="col-span-4">
            <div class="card bg-base-200">
              <div class="card-body">
                <h2 class="card-title">General Settings</h2>

                {message() && (
                  <div class="alert alert-success">
                    <span>{message()}</span>
                  </div>
                )}

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Border Width (px)</span>
                    <span class="label-text-alt">
                      {settings().borderWidth}px
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings().borderWidth}
                    class="range range-primary"
                    step="1"
                    onChange={(e) =>
                      updateSetting("borderWidth", parseInt(e.target.value))
                    }
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Animation Speed (seconds)</span>
                    <span class="label-text-alt">
                      {settings().animationSpeed}s
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings().animationSpeed}
                    class="range range-primary"
                    step="0.5"
                    onChange={(e) =>
                      updateSetting(
                        "animationSpeed",
                        parseFloat(e.target.value),
                      )
                    }
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Default Animation Style</span>
                  </label>
                  <select
                    class="select select-bordered w-full"
                    value={settings().defaultStyle}
                    onChange={(e) =>
                      updateSetting("defaultStyle", e.target.value)
                    }
                  >
                    <option value="rainbow">Rainbow</option>
                    <option value="neon">Neon</option>
                    <option value="cyber">Cyber</option>
                    <option value="fire">Fire</option>
                    <option value="gold">Gold</option>
                    <option value="ocean">Ocean</option>
                  </select>
                </div>

                <button
                  class="btn btn-primary w-full mt-6"
                  onClick={saveSettings}
                >
                  Save Settings
                </button>
              </div>
            </div>

            <div class="mt-8">
              <div class="card bg-base-200">
                <div class="card-body">
                  <h2 class="card-title">Saved Gradients</h2>

                  <ul class="list bg-base-100 rounded-box">
                    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
                      Your Custom Gradients
                    </li>

                    <For each={savedGradients()}>
                      {(gradient) => (
                        <li
                          class="list-row hover:bg-base-200 cursor-pointer"
                          onClick={() => loadGradient(gradient)}
                        >
                          <div>
                            <div
                              class="size-10 rounded-box"
                              style={{
                                background: `conic-gradient(from 0deg, ${gradient.colors.join(", ")})`,
                              }}
                            />
                          </div>
                          <div>
                            <div>{gradient.name}</div>
                            <div class="text-xs uppercase font-semibold opacity-60">
                              {gradient.colors.length} colors
                              {gradient.isTransparent ? " • Transparent" : ""}
                            </div>
                          </div>
                          <button
                            class="btn btn-square btn-ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGradient(gradient.id);
                            }}
                          >
                            <FaSolidXmark size={16} />
                          </button>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Gradient Creator (8 columns) */}
          <div class="col-span-8">
            <div class="card bg-base-200 h-full">
              <div class="card-body">
                <h2 class="card-title">Custom Gradient Creator</h2>
                <GradientCreator />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
