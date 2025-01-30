/* @refresh reload */
import { render } from "solid-js/web";
import "@popup/popup.css";
import "@options/options.css";
import Popup from "@popup/Popup";
import Options from "@options/Options";

// Get the current HTML file name
const currentPage = window.location.pathname.split("/").pop();
console.log("Current page:", currentPage);

// Get the appropriate root element and component
const getRootAndComponent = () => {
  switch (currentPage) {
    case "popup.html":
      return {
        root: document.getElementById("popup"),
        Component: Popup,
      };
    case "options.html":
      return {
        root: document.getElementById("options"),
        Component: Options,
      };
    default:
      console.error("Unknown page:", currentPage);
      return { root: null, Component: null };
  }
};

const { root, Component } = getRootAndComponent();

// Render if we have both a root element and a component
if (root && Component) {
  console.log(`Rendering ${currentPage}`);
  render(() => <Component />, root);
} else {
  console.error("Failed to render:", {
    currentPage,
    hasRoot: !!root,
    hasComponent: !!Component,
  });
}
