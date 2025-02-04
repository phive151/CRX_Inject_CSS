import { createSignal } from "solid-js";
import { PreviewWindow } from "../components/PreviewWindow";

const daisyComponents = [
  {
    name: "Button",
    variants: ["btn-primary", "btn-secondary", "btn-accent", "btn-neutral"],
    template: (variant) => `<button class="btn ${variant}">Button</button>`
  },
  {
    name: "Card",
    variants: ["bg-base-100", "bg-primary", "bg-secondary", "bg-accent"],
    template: (variant) => `<div class="card w-96 ${variant} shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Card title</h2>
    <p>Card content goes here.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>`
  },
  {
    name: "Alert",
    variants: ["alert-info", "alert-success", "alert-warning", "alert-error"],
    template: (variant) => `<div class="alert ${variant}">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Alert message goes here</span>
</div>`
  }
];

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter"
];

const DaisyUIPreview = () => {
  const [selectedComponent, setSelectedComponent] = createSignal(daisyComponents[0]);
  const [selectedVariant, setSelectedVariant] = createSignal(daisyComponents[0].variants[0]);
  const [selectedTheme, setSelectedTheme] = createSignal("light");
  const [controls, setControls] = createSignal({
    borderWidth: 3,
    duration: 3,
    blur: 10,
    opacity: 0.2,
    spread: 6
  });

  const previewCode = () => {
    const { borderWidth, duration, blur, opacity, spread } = controls();
    const component = selectedComponent();
    const variant = selectedVariant();
    
    return {
      html: `<div data-theme="${selectedTheme()}" class="p-4 bg-base-200 rounded-lg">
  <div class="gradient-border">
    ${component.template(variant)}
  </div>
</div>`,
      css: `@theme {
  --radius-field: 0.5rem;
  --duration-normal: ${duration}s;
}

.gradient-border {
  position: relative;
  isolation: isolate;
  overflow: visible;
  display: inline-block;
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: -${borderWidth}px;
  border-radius: calc(var(--radius-field) + ${borderWidth}px);
  background: conic-gradient(from var(--angle), var(--gradient-rainbow));
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
  background: conic-gradient(from var(--angle), var(--gradient-rainbow));
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
        <h2 class="text-xl font-bold mb-6">DaisyUI Components</h2>
        
        <div class="flex flex-col gap-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Theme</span>
            </label>
            <select 
              class="select select-bordered w-full"
              value={selectedTheme()}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              {themes.map(theme => (
                <option value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Component</span>
            </label>
            <select 
              class="select select-bordered w-full"
              value={selectedComponent().name}
              onChange={(e) => {
                const component = daisyComponents.find(c => c.name === e.target.value);
                setSelectedComponent(component);
                setSelectedVariant(component.variants[0]);
              }}
            >
              {daisyComponents.map(component => (
                <option value={component.name}>{component.name}</option>
              ))}
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Variant</span>
            </label>
            <select 
              class="select select-bordered w-full"
              value={selectedVariant()}
              onChange={(e) => setSelectedVariant(e.target.value)}
            >
              {selectedComponent().variants.map(variant => (
                <option value={variant}>{variant}</option>
              ))}
            </select>
          </div>

          <div class="divider">Animation Controls</div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Border Width</span>
              <span class="label-text-alt">{controls().borderWidth}px</span>
            </label>
            <input
              type="range"
              class="range range-primary"
              min={1}
              max={10}
              step={1}
              value={controls().borderWidth}
              onChange={(e) => updateControl("borderWidth", parseInt(e.target.value))}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Animation Duration</span>
              <span class="label-text-alt">{controls().duration}s</span>
            </label>
            <input
              type="range"
              class="range range-primary"
              min={0.5}
              max={10}
              step={0.5}
              value={controls().duration}
              onChange={(e) => updateControl("duration", parseFloat(e.target.value))}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Blur Amount</span>
              <span class="label-text-alt">{controls().blur}px</span>
            </label>
            <input
              type="range"
              class="range range-primary"
              min={0}
              max={20}
              step={1}
              value={controls().blur}
              onChange={(e) => updateControl("blur", parseInt(e.target.value))}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Glow Opacity</span>
              <span class="label-text-alt">{controls().opacity}</span>
            </label>
            <input
              type="range"
              class="range range-primary"
              min={0}
              max={1}
              step={0.1}
              value={controls().opacity}
              onChange={(e) => updateControl("opacity", parseFloat(e.target.value))}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Spread Distance</span>
              <span class="label-text-alt">{controls().spread}px</span>
            </label>
            <input
              type="range"
              class="range range-primary"
              min={1}
              max={20}
              step={1}
              value={controls().spread}
              onChange={(e) => updateControl("spread", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div class="bg-base-100 rounded-box shadow-lg">
        <PreviewWindow code={previewCode()} />
      </div>
    </div>
  );
};

export default DaisyUIPreview; 
