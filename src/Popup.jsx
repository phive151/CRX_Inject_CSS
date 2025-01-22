import { createSignal, onMount } from 'solid-js';
import './popup.css';

const borderStyles = [
  {
    id: 1,
    name: 'rainbow',
    class: 'border-animate-1',
    bgColor: 'bg-blue-600',
    gradient: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'],
    duration: '3s',
    css: `
      .border-animate-1:hover::before {
        opacity: 1;
        background-image: conic-gradient(
          from var(--angle),
          #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
        );
        animation: rotate 3s linear infinite;
      }
    `
  },
  {
    id: 2,
    name: 'neon',
    class: 'border-animate-2',
    bgColor: 'bg-purple-600',
    gradient: ['#ff00ff', '#9500ff', '#00ffff', '#ff00ff'],
    duration: '2s',
    css: `
      .border-animate-2:hover::before {
        opacity: 1;
        background-image: conic-gradient(
          from var(--angle),
          #ff00ff, #9500ff, #00ffff, #ff00ff
        );
        animation: rotate 2s linear infinite;
      }
    `
  },
  {
    id: 3,
    name: 'cyber',
    class: 'border-animate-3',
    bgColor: 'bg-green-600',
    gradient: ['#00ff00', '#006600', '#00ff00', '#99ff99'],
    duration: '4s',
    css: `
      .border-animate-3:hover::before {
        opacity: 1;
        background-image: conic-gradient(
          from var(--angle),
          #00ff00, #006600, #00ff00, #99ff99
        );
        animation: rotate 4s linear infinite;
      }
    `
  },
  {
    id: 4,
    name: 'fire',
    class: 'border-animate-4',
    bgColor: 'bg-red-600',
    gradient: ['#ff0000', '#ff6600', '#ffcc00', '#ff0000'],
    duration: '2.5s',
    css: `
      .border-animate-4:hover::before {
        opacity: 1;
        background-image: conic-gradient(
          from var(--angle),
          #ff0000, #ff6600, #ffcc00, #ff0000
        );
        animation: rotate 2.5s linear infinite;
      }
    `
  },
  {
    id: 5,
    name: 'gold',
    class: 'border-animate-5',
    bgColor: 'bg-yellow-600',
    gradient: ['#ffd700', '#ffa500', '#ffdb4d', '#ffd700'],
    duration: '3.5s',
    css: `
      .border-animate-5:hover::before {
        opacity: 1;
        background-image: conic-gradient(
          from var(--angle),
          #ffd700, #ffa500, #ffdb4d, #ffd700
        );
        animation: rotate 3.5s linear infinite;
      }
    `
  },
  {
    id: 6,
    name: 'ocean',
    class: 'border-animate-6',
    bgColor: 'bg-teal-600',
    gradient: ['#00ffff', '#0099ff', '#0000ff', '#00ffff'],
    duration: '3s',
    css: `
      .border-animate-6:hover::before {
        opacity: 1;
        background-image: conic-gradient(
          from var(--angle),
          #00ffff, #0099ff, #0000ff, #00ffff
        );
        animation: rotate 3s linear infinite;
      }
    `
  }
];

const Popup = () => {
  const [activeButton, setActiveButton] = createSignal(null);
  const [message, setMessage] = createSignal('');
  const storage = chrome.storage.local;

  onMount(async () => {
    // Load previously selected style
    const { selectedStyle } = await storage.get('selectedStyle');
    if (selectedStyle) {
      const style = borderStyles.find(s => s.id === selectedStyle);
      if (style) {
        injectStyle(style);
      }
    }
  });

  const injectStyle = async (style) => {
    try {
      console.log('Starting style injection for:', style.name);
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Current tab:', tab);
      
      if (!tab?.id) {
        throw new Error('No valid tab found for injection');
      }

      // Updated Base CSS for the hover border
      const baseCSS = `
        .border-box {
          position: fixed;
          pointer-events: none;
          z-index: 2147483647;
          transition: all 0.15s ease;
          visibility: hidden;
          box-shadow: 0 0 0 3px transparent;
        }

        .border-box.visible {
          visibility: visible;
        }

        .border-box::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: inherit;
          opacity: 1;
          background: conic-gradient(
            from var(--angle),
            ${style.gradient.join(', ')}
          );
          animation: borderRotate ${style.duration} linear infinite;
          z-index: -1;
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
                        linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 3px;
        }

        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes borderRotate {
          from { --angle: 0deg }
          to { --angle: 360deg }
        }
      `;

      console.log('Attempting to inject CSS...');
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          css: baseCSS
        });
        console.log('CSS injection successful');
      } catch (cssError) {
        console.error('CSS injection failed:', cssError);
        throw cssError;
      }

      console.log('Attempting to inject script...');
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (debugMode) => {
            console.log('Script injection started');
            
            try {
              // Remove existing border box if present
              const existingBox = document.querySelector('.border-box');
              if (existingBox) {
                console.log('Removing existing border box');
                existingBox.remove();
              }

              // Create new border box
              console.log('Creating new border box');
              const borderBox = document.createElement('div');
              borderBox.className = 'border-box';
              document.body.appendChild(borderBox);

              let currentElement = null;
              let isHovering = false;

              const updateBorderBox = (element) => {
                if (!element || !isHovering) {
                  debugMode && console.log('Skipping update - invalid element or not hovering');
                  return;
                }
                
                try {
                  const rect = element.getBoundingClientRect();
                  const scrollX = window.scrollX || window.pageXOffset;
                  const scrollY = window.scrollY || window.pageYOffset;

                  borderBox.style.left = `${rect.left + scrollX}px`;
                  borderBox.style.top = `${rect.top + scrollY}px`;
                  borderBox.style.width = `${rect.width}px`;
                  borderBox.style.height = `${rect.height}px`;
                  borderBox.style.borderRadius = getComputedStyle(element).borderRadius;
                  borderBox.classList.add('visible');
                  
                  debugMode && console.log('Border box updated:', {
                    left: borderBox.style.left,
                    top: borderBox.style.top,
                    width: borderBox.style.width,
                    height: borderBox.style.height
                  });
                } catch (updateError) {
                  console.error('Error updating border box:', updateError);
                }
              };

              document.addEventListener('mouseover', (e) => {
                isHovering = true;
                currentElement = e.target;
                debugMode && console.log('Mouseover event:', {
                  target: e.target.tagName,
                  id: e.target.id,
                  class: e.target.className
                });
                
                if (currentElement === document.body || currentElement === document.documentElement) {
                  borderBox.classList.remove('visible');
                  return;
                }
                updateBorderBox(currentElement);
              });

              document.addEventListener('mouseout', () => {
                debugMode && console.log('Mouseout event triggered');
                isHovering = false;
                borderBox.classList.remove('visible');
              });

              window.addEventListener('scroll', () => {
                debugMode && console.log('Scroll event triggered');
                updateBorderBox(currentElement);
              }, { passive: true });

              window.addEventListener('resize', () => {
                debugMode && console.log('Resize event triggered');
                updateBorderBox(currentElement);
              }, { passive: true });

              console.log('Script injection completed successfully');
            } catch (error) {
              console.error('Error in injected script:', error);
            }
          },
          args: [true] // Enable debug mode
        });
        console.log('Script injection successful');
      } catch (scriptError) {
        console.error('Script injection failed:', scriptError);
        throw scriptError;
      }

      // Save to storage
      try {
        await storage.set({
          selectedStyle: style.id,
          currentCSS: baseCSS
        });
        console.log('Style saved to storage');
      } catch (storageError) {
        console.error('Storage operation failed:', storageError);
        throw storageError;
      }

      setMessage('Style injected successfully!');
      console.log('Style injection completed successfully');
      
    } catch (error) {
      console.error('Style injection failed:', error);
      setMessage(`Failed to inject style: ${error.message}`);
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const removeStyle = async () => {
    try {
      console.log('Starting style removal');
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Current tab:', tab);
      
      if (!tab?.id) {
        throw new Error('No valid tab found for removal');
      }

      // Remove the CSS
      try {
        const { currentCSS } = await storage.get('currentCSS');
        if (currentCSS) {
          console.log('Removing injected CSS');
          await chrome.scripting.removeCSS({
            target: { tabId: tab.id },
            css: currentCSS
          });
          console.log('CSS removed successfully');
        } else {
          console.log('No CSS found in storage to remove');
        }
      } catch (cssError) {
        console.error('Failed to remove CSS:', cssError);
        throw cssError;
      }

      // Remove the border box element
      try {
        console.log('Removing border box element');
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const borderBox = document.querySelector('.border-box');
            if (borderBox) {
              console.log('Border box found and removed');
              borderBox.remove();
            } else {
              console.log('No border box found to remove');
            }
          }
        });
      } catch (scriptError) {
        console.error('Failed to remove border box:', scriptError);
        throw scriptError;
      }

      // Clear storage
      try {
        await storage.remove(['selectedStyle', 'currentCSS']);
        console.log('Storage cleared successfully');
      } catch (storageError) {
        console.error('Failed to clear storage:', storageError);
        throw storageError;
      }
      
      setMessage('Style removed successfully!');
      console.log('Style removal completed successfully');
      
    } catch (error) {
      console.error('Style removal failed:', error);
      setMessage(`Failed to remove style: ${error.message}`);
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div class="popup-container">
      <h2 class="text-2xl font-bold px-4 py-2 text-center text-base-content border-b border-base-300">
        Border Animation Styles
      </h2>
      
      {message() && (
        <div class="alert alert-info mx-4">
          <span>{message()}</span>
        </div>
      )}
      
      <div class="button-grid">
        {borderStyles.map(style => (
          <button 
            class={`btn btn-${style.name.toLowerCase().replace(' ', '-')} ${
              activeButton() === style.id ? 'ring-2 ring-primary' : ''
            }`}
            onMouseEnter={() => setActiveButton(style.id)}
            onMouseLeave={() => setActiveButton(null)}
            onClick={() => injectStyle(style)}
          >
            {style.name}
          </button>
        ))}
      </div>
      
      <div class="reset-button-container">
        <button 
          class="btn btn-error btn-block"
          onClick={removeStyle}
        >
          Reset Animation
        </button>
      </div>
    </div>
  );
}

export default Popup;

