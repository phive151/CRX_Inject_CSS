import { createSignal, createEffect } from "solid-js";
import { PreviewWindow } from "../components/PreviewWindow";
import { ColorPicker } from "../components/ColorPicker";

const defaultGradientStops = [
  { oklch: [0.7, 0.25, 0], position: 0 },
  { oklch: [0.7, 0.25, 120], position: 33 },
  { oklch: [0.7, 0.25, 240], position: 66 },
  { oklch: [0.7, 0.25, 360], position: 100 }
];

const interpolationModes = [
  { value: "oklab", label: "Oklab" },
  { value: "oklch", label: "OKLCH" },
  { value: "srgb", label: "sRGB" },
  { value: "hsl", label: "HSL" },
  { value: "longer", label: "Longer Hue" },
  { value: "shorter", label: "Shorter Hue" },
  { value: "increasing", label: "Increasing Hue" },
  { value: "decreasing", label: "Decreasing Hue" }
];

const defaultTags = ["Vibrant", "Subtle", "Dark", "Light", "Rainbow", "Monochrome", "Neon", "Pastel"];

const CustomGradients = () => {
  const [gradientStops, setGradientStops] = createSignal(defaultGradientStops);
  const [interpolation, setInterpolation] = createSignal("oklch");
  const [controls, setControls] = createSignal({
    borderWidth: 3,
    duration: 3,
    blur: 10,
    opacity: 0.2,
    spread: 6
  });
  const [savedGradients, setSavedGradients] = createSignal([]);
  const [gradientName, setGradientName] = createSignal("");
  const [selectedTags, setSelectedTags] = createSignal([]);
  const [filterTag, setFilterTag] = createSignal("all");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [customTags, setCustomTags] = createSignal([]);
  const [newTagInput, setNewTagInput] = createSignal("");
  const [editingGradient, setEditingGradient] = createSignal(null);

  // Load saved gradients and custom tags from storage on mount
  createEffect(() => {
    const saved = localStorage.getItem("savedGradients");
    const savedTags = localStorage.getItem("customTags");
    if (saved) {
      setSavedGradients(JSON.parse(saved));
    }
    if (savedTags) {
      setCustomTags(JSON.parse(savedTags));
    }
  });

  const generatePreviewGradient = (stops) => {
    const stopsStr = stops
      .map(stop => `oklch(${stop.oklch[0]} ${stop.oklch[1]} ${stop.oklch[2]}) ${stop.position}%`)
      .join(", ");
    return `conic-gradient(from 0deg, ${stopsStr})`;
  };

  const saveGradient = () => {
    if (!gradientName()) return;
    
    const newGradient = {
      name: gradientName(),
      stops: gradientStops(),
      interpolation: interpolation(),
      controls: controls(),
      tags: selectedTags()
    };

    const updated = [...savedGradients(), newGradient];
    setSavedGradients(updated);
    localStorage.setItem("savedGradients", JSON.stringify(updated));
    setGradientName("");
    setSelectedTags([]);
  };

  const exportGradients = () => {
    const dataStr = JSON.stringify(savedGradients(), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'border-gradients.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importGradients = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const updated = [...savedGradients(), ...imported];
        setSavedGradients(updated);
        localStorage.setItem("savedGradients", JSON.stringify(updated));
      } catch (error) {
        console.error('Error importing gradients:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const addCustomTag = () => {
    if (newTagInput() && !getAllTags().includes(newTagInput())) {
      const updated = [...customTags(), newTagInput()];
      setCustomTags(updated);
      localStorage.setItem("customTags", JSON.stringify(updated));
      setNewTagInput("");
    }
  };

  const removeCustomTag = (tag) => {
    const updated = customTags().filter(t => t !== tag);
    setCustomTags(updated);
    localStorage.setItem("customTags", JSON.stringify(updated));
  };

  const getAllTags = () => [...defaultTags, ...customTags()];

  const updateGradientTags = (index, tags) => {
    const updated = savedGradients().map((g, i) => 
      i === index ? { ...g, tags } : g
    );
    setSavedGradients(updated);
    localStorage.setItem("savedGradients", JSON.stringify(updated));
  };

  const filteredGradients = () => {
    let gradients = savedGradients();
    
    // Apply search filter
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      gradients = gradients.filter(g => 
        g.name.toLowerCase().includes(query) || 
        g.tags?.some(t => t.toLowerCase().includes(query))
      );
    }
    
    // Apply tag filter
    if (filterTag() !== "all") {
      gradients = gradients.filter(g => g.tags?.includes(filterTag()));
    }
    
    return gradients;
  };

  const loadGradient = (gradient) => {
    setGradientStops(gradient.stops);
    setInterpolation(gradient.interpolation);
    setControls(gradient.controls);
  };

  const deleteGradient = (index) => {
    const updated = savedGradients().filter((_, i) => i !== index);
    setSavedGradients(updated);
    localStorage.setItem("savedGradients", JSON.stringify(updated));
  };

  const addGradientStop = () => {
    const stops = gradientStops();
    const lastStop = stops[stops.length - 1];
    const newStop = {
      oklch: [...lastStop.oklch],
      position: Math.min(lastStop.position + 10, 100)
    };
    setGradientStops([...stops, newStop]);
  };

  const removeGradientStop = (index) => {
    if (gradientStops().length > 2) {
      setGradientStops(stops => stops.filter((_, i) => i !== index));
    }
  };

  const updateGradientStop = (index, updates) => {
    setGradientStops(stops => 
      stops.map((stop, i) => 
        i === index ? { ...stop, ...updates } : stop
      )
    );
  };

  const generateGradientString = () => {
    const stops = gradientStops()
      .map(stop => `oklch(${stop.oklch[0]} ${stop.oklch[1]} ${stop.oklch[2]}) ${stop.position}%`)
      .join(", ");
    return stops;
  };

  const previewCode = () => {
    const { borderWidth, duration, blur, opacity, spread } = controls();
    const gradientStr = generateGradientString();
    
    return {
      html: `<button class="custom-gradient-border">
  Hover Me
</button>`,
      css: `@theme {
  --radius-field: 0.5rem;
  --duration-normal: ${duration}s;
  --gradient-custom: ${gradientStr};
}

.custom-gradient-border {
  position: relative;
  isolation: isolate;
  overflow: visible;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-field);
}

.custom-gradient-border::before {
  content: "";
  position: absolute;
  inset: -${borderWidth}px;
  border-radius: calc(var(--radius-field) + ${borderWidth}px);
  background: conic-gradient(from var(--angle)/${interpolation()}, var(--gradient-custom));
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

.custom-gradient-border::after {
  content: "";
  position: absolute;
  inset: -${spread}px;
  border-radius: calc(var(--radius-field) + ${spread}px);
  background: conic-gradient(from var(--angle)/${interpolation()}, var(--gradient-custom));
  animation: var(--animate-rotate);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -2;
  filter: blur(${blur}px) opacity(${opacity});
}

.custom-gradient-border:hover::before,
.custom-gradient-border:hover::after {
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
        <h2 class="text-xl font-bold mb-6">Custom Gradient</h2>
        
        <div class="flex flex-col gap-6">
          {/* Custom Tags Section */}
          <div class="form-control">
            <label class="label">
              <span class="label-text">Custom Tags</span>
            </label>
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="New tag name"
                class="input input-bordered flex-1"
                value={newTagInput()}
                onInput={(e) => setNewTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
              />
              <button
                class="btn btn-primary"
                onClick={addCustomTag}
                disabled={!newTagInput() || getAllTags().includes(newTagInput())}
              >
                Add Tag
              </button>
            </div>
            {customTags().length > 0 && (
              <div class="flex flex-wrap gap-2 mt-2">
                {customTags().map(tag => (
                  <div class="badge gap-2">
                    {tag}
                    <button
                      class="btn btn-ghost btn-xs"
                      onClick={() => removeCustomTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Gradient Section */}
          <div class="form-control">
            <label class="label">
              <span class="label-text">Save Current Gradient</span>
            </label>
            <div class="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Gradient name"
                class="input input-bordered w-full"
                value={gradientName()}
                onInput={(e) => setGradientName(e.target.value)}
              />
              <div class="flex flex-wrap gap-2">
                {getAllTags().map(tag => (
                  <label class="label cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      checked={selectedTags().includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags(), tag]);
                        } else {
                          setSelectedTags(selectedTags().filter(t => t !== tag));
                        }
                      }}
                    />
                    <span class="label-text">{tag}</span>
                  </label>
                ))}
              </div>
              <button
                class="btn btn-primary w-full"
                onClick={saveGradient}
                disabled={!gradientName()}
              >
                Save Gradient
              </button>
            </div>
          </div>

          {/* Import/Export Section */}
          <div class="flex gap-2">
            <button
              class="btn btn-outline flex-1"
              onClick={exportGradients}
              disabled={savedGradients().length === 0}
            >
              Export Gradients
            </button>
            <label class="btn btn-outline flex-1">
              Import Gradients
              <input
                type="file"
                accept=".json"
                class="hidden"
                onChange={importGradients}
              />
            </label>
          </div>

          {/* Saved Gradients Section */}
          {savedGradients().length > 0 && (
            <div class="form-control">
              <label class="label">
                <span class="label-text">Saved Gradients</span>
              </label>
              <input
                type="text"
                placeholder="Search gradients..."
                class="input input-bordered w-full mb-2"
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                class="select select-bordered w-full mb-2"
                value={filterTag()}
                onChange={(e) => setFilterTag(e.target.value)}
              >
                <option value="all">All Gradients</option>
                {getAllTags().map(tag => (
                  <option value={tag}>{tag}</option>
                ))}
              </select>
              <div class="flex flex-col gap-2">
                {filteredGradients().map((gradient, index) => (
                  <div class="flex items-center gap-2 bg-base-200 p-2 rounded-lg">
                    <div 
                      class="w-12 h-12 rounded-lg"
                      style={{ background: generatePreviewGradient(gradient.stops) }}
                    />
                    <div class="flex-1">
                      <button
                        class="btn btn-ghost w-full justify-start"
                        onClick={() => loadGradient(gradient)}
                      >
                        <div class="text-left">
                          <div>{gradient.name}</div>
                          <div class="flex gap-1 flex-wrap mt-1">
                            {gradient.tags?.map(tag => (
                              <span 
                                class="badge badge-sm cursor-pointer hover:badge-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingGradient(index);
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {(!gradient.tags || gradient.tags.length === 0) && (
                              <span 
                                class="badge badge-sm badge-outline cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingGradient(index);
                                }}
                              >
                                Add tags
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                    <div class="flex gap-2">
                      <button
                        class="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGradient(index);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        class="btn btn-ghost btn-sm"
                        onClick={() => deleteGradient(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Tags Modal */}
          {editingGradient() !== null && (
            <div class="modal modal-open">
              <div class="modal-box">
                <h3 class="font-bold text-lg">Edit Tags</h3>
                <div class="py-4">
                  <div class="flex flex-wrap gap-2">
                    {getAllTags().map(tag => (
                      <label class="label cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          class="checkbox checkbox-sm"
                          checked={savedGradients()[editingGradient()]?.tags?.includes(tag)}
                          onChange={(e) => {
                            const currentTags = savedGradients()[editingGradient()]?.tags || [];
                            if (e.target.checked) {
                              updateGradientTags(editingGradient(), [...currentTags, tag]);
                            } else {
                              updateGradientTags(editingGradient(), currentTags.filter(t => t !== tag));
                            }
                          }}
                        />
                        <span class="label-text">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div class="modal-action">
                  <button class="btn" onClick={() => setEditingGradient(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

          <div class="divider">Gradient Settings</div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Interpolation Mode</span>
            </label>
            <select 
              class="select select-bordered w-full"
              value={interpolation()}
              onChange={(e) => setInterpolation(e.target.value)}
            >
              {interpolationModes.map(mode => (
                <option value={mode.value}>{mode.label}</option>
              ))}
            </select>
          </div>

          <div class="divider">Gradient Stops</div>

          <div class="flex flex-col gap-4">
            {gradientStops().map((stop, index) => (
              <div class="flex items-end gap-4">
                <ColorPicker
                  value={stop.oklch}
                  onChange={(color) => updateGradientStop(index, { oklch: color })}
                />
                <div class="form-control flex-1">
                  <label class="label">
                    <span class="label-text">Position</span>
                    <span class="label-text-alt">{stop.position}%</span>
                  </label>
                  <input
                    type="range"
                    class="range range-primary"
                    min={0}
                    max={100}
                    step={1}
                    value={stop.position}
                    onChange={(e) => updateGradientStop(index, { position: parseInt(e.target.value) })}
                  />
                </div>
                <button
                  class="btn btn-ghost btn-sm"
                  onClick={() => removeGradientStop(index)}
                  disabled={gradientStops().length <= 2}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            
            <button
              class="btn btn-outline btn-sm"
              onClick={addGradientStop}
            >
              Add Color Stop
            </button>
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

export default CustomGradients; 
