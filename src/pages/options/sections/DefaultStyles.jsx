import { createSignal, createEffect } from "solid-js";
import { PreviewWindow } from "../components/PreviewWindow";

const defaultControls = {
  borderWidth: { min: 1, max: 10, default: 3, step: 1, label: "Border Width" },
  duration: { min: 0.5, max: 10, default: 3, step: 0.5, label: "Animation Duration" },
  blur: { min: 0, max: 20, default: 10, step: 1, label: "Blur Amount" },
  opacity: { min: 0, max: 1, default: 0.2, step: 0.1, label: "Glow Opacity" },
  spread: { min: 1, max: 20, default: 6, step: 1, label: "Spread Distance" }
};

const DefaultStyles = () => {
  const [activeStyle, setActiveStyle] = createSignal("rainbow");
  const [controls, setControls] = createSignal({
    borderWidth: defaultControls.borderWidth.default,
    duration: defaultControls.duration.default,
    blur: defaultControls.blur.default,
    opacity: defaultControls.opacity.default,
    spread: defaultControls.spread.default
  });

  const previewCode = () => {
    const style = activeStyle();
    const { borderWidth, duration, blur, opacity, spread } = controls();
    
    return {
      html: `<button class="gradient-border gradient-${style}">
  Hover Me
</button>`,
      css: `@theme {
  --radius-field: 0.5rem;
  --duration-normal: ${duration}s;
  --gradient-${style}: var(--gradient-${style}-colors);
}

.gradient-border {
  position: relative;
  isolation: isolate;
  overflow: visible;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-field);
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: -${borderWidth}px;
  border-radius: calc(var(--radius-field) + ${borderWidth}px);
  background: conic-gradient(from var(--angle), var(--gradient-${style}));
  animation: var(--animate-rotate);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
  padding: ${borderWidth}px;
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: exclude;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.gradient-border::after {
  content: "";
  position: absolute;
  inset: -${spread}px;
  border-radius: calc(var(--radius-field) + ${spread}px);
  background: conic-gradient(from var(--angle), var(--gradient-${style}));
  animation: var(--animate-rotate);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -2;
  filter: blur(${blur}px) opacity(${opacity});
}

.gradient-border:hover::before,
.gradient-border:hover::after {
  opacity: 1;
}`
    };
  };

  const updateControl = (name, value) => {
    setControls(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-base-100 rounded-box p-6 shadow-lg">
        <h2 class="text-xl font-bold mb-6">Style Controls</h2>
        
        <div class="flex flex-col gap-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Style</span>
            </label>
            <select 
              class="select select-bordered w-full"
              value={activeStyle()}
              onChange={(e) => setActiveStyle(e.target.value)}
            >
              <option value="rainbow">Rainbow</option>
              <option value="neon">Neon</option>
              <option value="cyber">Cyber</option>
              <option value="fire">Fire</option>
              <option value="gold">Gold</option>
              <option value="ocean">Ocean</option>
            </select>
          </div>

          {Object.entries(defaultControls).map(([key, config]) => (
            <div class="form-control">
              <label class="label">
                <span class="label-text">{config.label}</span>
                <span class="label-text-alt">{controls()[key]}</span>
              </label>
              <input
                type="range"
                class="range range-primary"
                min={config.min}
                max={config.max}
                step={config.step}
                value={controls()[key]}
                onChange={(e) => updateControl(key, parseFloat(e.target.value))}
              />
              <div class="w-full flex justify-between text-xs px-2 mt-1">
                <span>{config.min}</span>
                <span>{config.max}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div class="bg-base-100 rounded-box shadow-lg">
        <PreviewWindow code={previewCode()} />
      </div>
    </div>
  );
};

export default DefaultStyles; 
