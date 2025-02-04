import { createSignal, createEffect } from "solid-js";

const tabs = [
  { id: "preview", label: "Preview" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" }
];

export const PreviewWindow = ({ code }) => {
  const [activeTab, setActiveTab] = createSignal("preview");
  const [isCopied, setIsCopied] = createSignal(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const renderContent = () => {
    switch (activeTab()) {
      case "preview":
        return (
          <div class="preview-content p-8 min-h-[400px] flex items-center justify-center bg-base-200">
            <style>{code.css}</style>
            <div innerHTML={code.html} />
          </div>
        );
      case "html":
        return (
          <div class="relative">
            <pre class="language-html p-4 bg-base-300 rounded-lg overflow-x-auto">
              <code>{code.html}</code>
            </pre>
            <button
              class="btn btn-sm btn-ghost absolute top-2 right-2"
              onClick={() => copyToClipboard(code.html)}
            >
              {isCopied() ? "Copied!" : "Copy"}
            </button>
          </div>
        );
      case "css":
        return (
          <div class="relative">
            <pre class="language-css p-4 bg-base-300 rounded-lg overflow-x-auto">
              <code>{code.css}</code>
            </pre>
            <button
              class="btn btn-sm btn-ghost absolute top-2 right-2"
              onClick={() => copyToClipboard(code.css)}
            >
              {isCopied() ? "Copied!" : "Copy"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div class="h-full flex flex-col">
      <div class="tabs">
        {tabs.map(tab => (
          <button
            class={`tab tab-lifted ${activeTab() === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div class="flex-1 p-4 bg-base-100 border-x border-b rounded-b-box">
        {renderContent()}
      </div>
    </div>
  );
}; 
