// Cup Loader Script - Can be included in any page
(function() {
    // Create and inject the loader HTML
    const loaderHTML = `
        <div id="cup-loader-overlay">
            <div class="cup-container">
                <div class="cup">
                    <div class="cup-handle"></div>
                    <div class="cup-body">
                        <div class="fluid-container">
                            <div class="fluid-fill">
                                <svg class="fluid-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                    <path class="wave-path" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C67.3,76.58,145.67,58.44,321.39,56.44Z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loading-percentage">0%</div>
            </div>
        </div>
    `;

    // Create and inject the loader CSS
    const loaderCSS = `
        #cup-loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.5s ease-out;
        }

        #cup-loader-overlay.fade-out {
            opacity: 0;
            pointer-events: none;
        }

        .cup-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
        }

        .cup {
            position: relative;
            width: 150px;
            height: 180px;
        }

        .cup-body {
            position: relative;
            width: 150px;
            height: 180px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 0 0 70px 70px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .cup-body::before {
            content: '';
            position: absolute;
            top: -5px;
            left: 0;
            width: 100%;
            height: 20px;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), transparent);
            border-radius: 50%;
        }

        .cup-handle {
            position: absolute;
            right: -35px;
            top: 40px;
            width: 30px;
            height: 80px;
            border: 12px solid rgba(255, 255, 255, 0.9);
            border-left: none;
            border-radius: 0 35px 35px 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .fluid-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0%;
            transition: height 0.3s ease-out;
            overflow: hidden;
        }

        .fluid-fill {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 200%;
            background: linear-gradient(to top, #ff6b35, #ff9558);
            animation: rise 3s ease-in-out infinite;
        }

        .fluid-wave {
            position: absolute;
            top: -10px;
            left: 0;
            width: 200%;
            height: 20px;
            animation: wave 3s linear infinite;
        }

        .wave-path {
            fill: #ff9558;
        }

        @keyframes wave {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }

        @keyframes rise {
            0%, 100% {
                transform: translateY(5px);
            }
            50% {
                transform: translateY(-5px);
            }
        }

        .loading-percentage {
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
    `;

    // Inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = loaderCSS;
    document.head.appendChild(styleElement);

    // Inject HTML
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    // Loading logic
    let loadedResources = 0;
    let totalResources = 0;
    const fluidContainer = document.querySelector('.fluid-container');
    const percentageDisplay = document.querySelector('.loading-percentage');
    const loaderOverlay = document.getElementById('cup-loader-overlay');

    // Track images
    const images = document.querySelectorAll('img');
    totalResources += images.length;

    images.forEach(img => {
        if (img.complete) {
            loadedResources++;
            updateLoader();
        } else {
            img.addEventListener('load', () => {
                loadedResources++;
                updateLoader();
            });
            img.addEventListener('error', () => {
                loadedResources++;
                updateLoader();
            });
        }
    });

    // Track stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    totalResources += stylesheets.length;
    
    stylesheets.forEach(stylesheet => {
        loadedResources++;
        updateLoader();
    });

    // Track scripts
    const scripts = document.querySelectorAll('script[src]');
    totalResources += scripts.length;
    
    scripts.forEach(script => {
        loadedResources++;
        updateLoader();
    });

    // Add window load as final resource
    totalResources += 1;

    function updateLoader() {
        const percentage = totalResources > 0 ? Math.min(100, Math.round((loadedResources / totalResources) * 100)) : 0;
        
        // Update fluid level
        fluidContainer.style.height = percentage + '%';
        
        // Update percentage text
        percentageDisplay.textContent = percentage + '%';
        
        // Check if loading is complete
        if (percentage >= 100) {
            setTimeout(() => {
                loaderOverlay.classList.add('fade-out');
                setTimeout(() => {
                    loaderOverlay.remove();
                }, 500);
            }, 500);
        }
    }

    // Initial update
    updateLoader();

    // Final check on window load
    window.addEventListener('load', () => {
        loadedResources = totalResources;
        updateLoader();
    });

    // Fallback timeout (remove loader after 10 seconds regardless)
    setTimeout(() => {
        if (loaderOverlay && !loaderOverlay.classList.contains('fade-out')) {
            loadedResources = totalResources;
            updateLoader();
        }
    }, 10000);
})();