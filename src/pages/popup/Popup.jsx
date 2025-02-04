import { createSignal, onMount } from "solid-js";
import { FaSolidGear } from "solid-icons/fa";
import { HiOutlineInformationCircle } from "solid-icons/hi";
import "./popup.css";

const borderStyles = [
  {
    id: 1,
    name: "rainbow",
    displayName: "Rainbow",
    class: "gradient-rainbow",
  },
  {
    id: 2,
    name: "neon",
    displayName: "Neon",
    class: "gradient-neon",
  },
  {
    id: 3,
    name: "cyber",
    displayName: "Cyber",
    class: "gradient-cyber",
  },
  {
    id: 4,
    name: "fire",
    displayName: "Fire",
    class: "gradient-fire",
  },
  {
    id: 5,
    name: "gold",
    displayName: "Gold",
    class: "gradient-gold",
  },
  {
    id: 6,
    name: "ocean",
    displayName: "Ocean",
    class: "gradient-ocean",
  },
];

const Popup = () => {
  const [activeButton, setActiveButton] = createSignal(null);
  const [message, setMessage] = createSignal("");
  const [defaultStyle, setDefaultStyle] = createSignal("neon");
  const storage = chrome.storage.local;

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const applyStyleByName = async (styleName) => {
    const style = borderStyles.find(
      (s) => s.name.toLowerCase() === styleName.toLowerCase()
    );
    if (style) {
      await injectStyle(style);
      setActiveButton(style.id);
    }
  };

  onMount(async () => {
    const { defaultStyle: storedDefault } = await storage.get("defaultStyle");
    if (storedDefault) {
      setDefaultStyle(storedDefault);
    }

    chrome.commands.onCommand.addListener(async (command) => {
      if (command === "toggle-border-animation") {
        await applyStyleByName(defaultStyle());
      }
    });

    // Load and apply previously selected style
    const { selectedStyle } = await storage.get("selectedStyle");
    if (selectedStyle) {
      const style = borderStyles.find((s) => s.id === selectedStyle);
      if (style) {
        setActiveButton(style.id);
        injectStyle(style);
      }
    }

    // Add debug logging
    console.log("[Popup] Initializing with styles:", {
      animations: {
        duration: getComputedStyle(document.documentElement).getPropertyValue(
          "--base-duration",
        ),
        radius: getComputedStyle(document.documentElement).getPropertyValue(
          "--base-radius",
        ),
      },
    });
  });

  const injectStyle = async (style) => {
    try {
      console.log("[Popup] Injecting style:", {
        name: style.name,
        gradient: style.gradient,
        duration: style.duration,
      });

      // Get user settings from storage
      const { borderWidth = 1, animationSpeed = 2 } = await storage.get([
        "borderWidth",
        "animationSpeed",
      ]);

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log("Current tab:", tab);

      if (!tab?.id) {
        throw new Error("No valid tab found for injection");
      }

      // Updated Base CSS with user settings
      const baseCSS = `
        .border-box {
          position: fixed;
          pointer-events: none;
          z-index: 99999999;
          transition: all 0.15s ease;
          visibility: hidden;
          top: 0;
          left: 0;
          transform: translate3d(0, 0, 0);
        }

        .border-box.visible {
          visibility: visible;
        }

        .border-box::after,
        .border-box::before {
          content: '';
          position: absolute;
          inset: calc(-1 * ${borderWidth}px);
          border-radius: inherit;
          opacity: 1;
          animation: var(--animate-rotate);
          padding: ${borderWidth}px;
        }

        .border-box::after {
          background: var(--gradient-${style.name});
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: exclude;
          mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          z-index: -1;
        }

        .border-box::before {
          background: var(--gradient-${style.name});
          filter: blur(20px) brightness(1.2) opacity(0.2);
        }

        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
      `;

      console.log("Attempting to inject CSS...");
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          css: baseCSS,
        });
        console.log("CSS injection successful");
      } catch (cssError) {
        console.error("CSS injection failed:", cssError);
        throw cssError;
      }

      console.log("Attempting to inject script...");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (debugMode) => {
            console.log("Script injection started");

            try {
              // Remove existing border box if present
              const existingBox = document.querySelector(".border-box");
              if (existingBox) {
                console.log("Removing existing border box");
                existingBox.remove();
              }

          const borderBox = document.createElement("div");
          borderBox.className = "border-box";
          document.body.appendChild(borderBox);

          let currentElement = null;
          let isHovering = false;

          const updateBorderBox = (element) => {
            if (!element || !isHovering) return;

            const rect = element.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            borderBox.style.left = `${rect.left + scrollX}px`;
            borderBox.style.top = `${rect.top + scrollY}px`;
            borderBox.style.width = `${rect.width}px`;
            borderBox.style.height = `${rect.height}px`;
            borderBox.style.borderRadius = getComputedStyle(element).borderRadius;
            borderBox.classList.add("visible");
          };

          document.addEventListener("mouseover", (e) => {
            isHovering = true;
            currentElement = e.target;
            if (currentElement === document.body || currentElement === document.documentElement) {
              borderBox.classList.remove("visible");
              return;
            }
            updateBorderBox(currentElement);
          });

          document.addEventListener("mouseout", () => {
            isHovering = false;
            borderBox.classList.remove("visible");
          });

          window.addEventListener("scroll", () => {
            updateBorderBox(currentElement);
          }, { passive: true });

              window.addEventListener(
                "resize",
                () => {
                  debugMode && console.log("Resize event triggered");
                  updateBorderBox(currentElement);
                },
                { passive: true },
              );

              console.log("Script injection completed successfully");
            } catch (error) {
              console.error("Error in injected script:", error);
            }
          },
          args: [true], // Enable debug mode
        });
        console.log("Script injection successful");
      } catch (scriptError) {
        console.error("Script injection failed:", scriptError);
        throw scriptError;
      }

      // Save to storage
      try {
        await storage.set({
          selectedStyle: style.id,
          currentCSS: baseCSS,
        });
        console.log("Style saved to storage");
      } catch (storageError) {
        console.error("Storage operation failed:", storageError);
        throw storageError;
      }

      setMessage("Style injected successfully!");
      console.log("Style injection completed successfully");
    } catch (error) {
      console.error("Style injection failed:", error);
      setMessage(`Failed to inject style: ${error.message}`);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeStyle = async () => {
    try {
      console.log("Starting style removal");

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log("Current tab:", tab);

      if (!tab?.id) {
        throw new Error("No valid tab found for removal");
      }

      // Remove the CSS
      try {
        const { currentCSS } = await storage.get("currentCSS");
        if (currentCSS) {
          console.log("Removing injected CSS");
          await chrome.scripting.removeCSS({
            target: { tabId: tab.id },
            css: currentCSS,
          });
          console.log("CSS removed successfully");
        } else {
          console.log("No CSS found in storage to remove");
        }
      } catch (cssError) {
        console.error("Failed to remove CSS:", cssError);
        throw cssError;
      }

      // Remove the border box element
      try {
        console.log("Removing border box element");
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const borderBox = document.querySelector(".border-box");
            if (borderBox) {
              console.log("Border box found and removed");
              borderBox.remove();
            } else {
              console.log("No border box found to remove");
            }
          },
        });
      } catch (scriptError) {
        console.error("Failed to remove border box:", scriptError);
        throw scriptError;
      }

      // Clear storage
      try {
        await storage.remove(["selectedStyle", "currentCSS"]);
        console.log("Storage cleared successfully");
      } catch (storageError) {
        console.error("Failed to clear storage:", storageError);
        throw storageError;
      }

      setMessage("Style removed successfully!");
      console.log("Style removal completed successfully");
    } catch (error) {
      console.error("Style removal failed:", error);
      setMessage(`Failed to remove style: ${error.message}`);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const saveDefaultStyle = async (styleName) => {
    try {
      await storage.set({ defaultStyle: styleName });
      setDefaultStyle(styleName);
      setMessage("Default style updated! Use Alt+Shift+B to apply");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving default style:", error);
      setMessage("Error saving default style");
    }
  };

  return (
    <div class="popup-base">
      <div class="flex items-center justify-between px-4 py-2">
        <h2 class="text-xl font-bold">Border Animation</h2>
        <button
          class="btn btn-ghost btn-circle"
          onClick={openOptions}
          title="Settings"
        >
          <FaSolidGear size={24} class="text-teal-600" />
        </button>
      </div>

      {message() && (
        <div class="px-4 mb-4">
          <div role="alert" class="alert alert-info shadow-lg">
            <HiOutlineInformationCircle size={24} />
            <span>{message()}</span>
          </div>
        </div>
      )}

      <div class="divider px-4">Select Style</div>

      <div class="grid grid-cols-2 gap-4 p-4">
        {borderStyles.map((style) => (
          <button
            class={`gradient-border btn ${style.class} ${
              activeButton() === style.id ? "active" : ""
            }`}
            onMouseEnter={() => setActiveButton(style.id)}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => injectStyle(style)}
            onContextMenu={(e) => {
              e.preventDefault();
              saveDefaultStyle(style.name.toLowerCase());
            }}
            title={`Left click to apply, Right click to set as default${
              defaultStyle() === style.name.toLowerCase()
                ? " (Current Default)"
                : ""
            }`}
          >
            <div class="relative">
              {style.displayName}
              {defaultStyle() === style.name.toLowerCase() && (
                <div class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div class="divider px-4">Actions</div>

      <div class="px-4 pb-4">
        <button class="btn btn-error btn-block gap-2" onClick={removeStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Reset Animation
        </button>
      </div>
    </div>
  );
};

export default Popup;
