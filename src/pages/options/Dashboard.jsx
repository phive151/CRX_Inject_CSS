import { createSignal } from "solid-js";
import DefaultStyles from "./sections/DefaultStyles";
import CustomGradients from "./sections/CustomGradients";
import DaisyUIPreview from "./sections/DaisyUIPreview";

const tabs = [
  { id: "defaults", label: "Default Styles", component: DefaultStyles },
  { id: "custom", label: "Custom Gradients", component: CustomGradients },
  { id: "daisyui", label: "DaisyUI Preview", component: DaisyUIPreview },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = createSignal("defaults");

  const ActiveComponent = () => {
    const component = tabs.find(tab => tab.id === activeTab())?.component;
    return component ? component() : null;
  };

  return (
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow-lg">
        <div class="flex-1">
          <h1 class="text-2xl font-bold px-4">Border Animation Dashboard</h1>
        </div>
      </div>

      <div class="tabs tabs-boxed bg-base-100 p-4 justify-center">
        {tabs.map(tab => (
          <button
            class={`tab tab-lg ${activeTab() === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div class="p-4">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Dashboard; 
