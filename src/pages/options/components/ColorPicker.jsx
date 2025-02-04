import { createSignal, createEffect } from "solid-js";

export const ColorPicker = ({ value, onChange }) => {
  const [lightness, setLightness] = createSignal(value[0]);
  const [chroma, setChroma] = createSignal(value[1]);
  const [hue, setHue] = createSignal(value[2]);

  const updateColor = (l, c, h) => {
    const newLightness = l ?? lightness();
    const newChroma = c ?? chroma();
    const newHue = h ?? hue();
    onChange([newLightness, newChroma, newHue]);
  };

  return (
    <div class="flex flex-col gap-2">
      <div class="w-full h-8 rounded-lg" style={{
        "background": `oklch(${lightness()} ${chroma()} ${hue()})`
      }} />
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Lightness</span>
          <span class="label-text-alt">{lightness().toFixed(2)}</span>
        </label>
        <input
          type="range"
          class="range range-xs"
          min={0}
          max={1}
          step={0.01}
          value={lightness()}
          onChange={(e) => {
            setLightness(parseFloat(e.target.value));
            updateColor(parseFloat(e.target.value));
          }}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Chroma</span>
          <span class="label-text-alt">{chroma().toFixed(2)}</span>
        </label>
        <input
          type="range"
          class="range range-xs"
          min={0}
          max={0.4}
          step={0.01}
          value={chroma()}
          onChange={(e) => {
            setChroma(parseFloat(e.target.value));
            updateColor(null, parseFloat(e.target.value));
          }}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Hue</span>
          <span class="label-text-alt">{hue().toFixed(0)}°</span>
        </label>
        <input
          type="range"
          class="range range-xs"
          min={0}
          max={360}
          step={1}
          value={hue()}
          onChange={(e) => {
            setHue(parseFloat(e.target.value));
            updateColor(null, null, parseFloat(e.target.value));
          }}
        />
      </div>
    </div>
  );
}; 
