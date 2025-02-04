import { createSignal } from "solid-js";
import GradientBackground from "/src/components/GradientBackground";
import GradientBorder from "/src/components/GradientBorder";
import GradientButton from "/src/components/GradientButton";
import GradientCard from "/src/components/GradientCard";
import GradientText from "/src/components/GradientText";
import "./preview.css";

const Preview = () => {
  const [selectedComponent, setSelectedComponent] =
    createSignal("GradientBackground");
  const [selectedTab, setSelectedTab] = createSignal("preview");

  const components = {
    GradientBackground,
    GradientBorder,
    GradientButton,
    GradientCard,
    GradientText,
  };

  const renderComponent = () => {
    const Component = components[selectedComponent()];
    return <Component>Preview Content</Component>;
  };

  return (
    <div class="preview-container">
      <aside class="component-sidebar">
        <h2 class="sidebar-title">Components</h2>
        <select
          class="select"
          id="selected-component"
          value={selectedComponent()}
          onChange={(e) => setSelectedComponent(e.target.value)}
        >
          {Object.keys(components).map((name) => (
            <option value={name}>{name}</option>
          ))}
        </select>
      </aside>

      <main class="preview-main">
        <div class="preview-tabs">
          <button
            class={`tab ${selectedTab() === "preview" ? "active" : ""}`}
            onClick={() => setSelectedTab("preview")}
          >
            Preview
          </button>
          <button
            class={`tab ${selectedTab() === "code" ? "active" : ""}`}
            onClick={() => setSelectedTab("code")}
          >
            Code
          </button>
        </div>

        <div class="preview-content">
          {selectedTab() === "preview" ? (
            <div class="component-preview">{renderComponent()}</div>
          ) : (
            <div class="code-preview">
              <pre>
                <code>{`// Example usage of ${selectedComponent()}
<${selectedComponent()}>
  Content
</${selectedComponent()}>`}</code>
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Preview;
