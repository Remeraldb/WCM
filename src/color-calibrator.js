class ColorCalibrator {
    constructor() {
        this.isOpen = false;
        this.settings = this.loadSettings();
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        this.createButton();
        this.createSidebar();
        this.applySettings();
        this.setupScrollFollowing();
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'calibrator-btn';
        this.button.innerHTML = '🎨';
        this.button.setAttribute('aria-label', 'Open color calibrator');
        
        this.button.addEventListener('click', () => this.toggleSidebar());
        document.body.appendChild(this.button);
    }

    createSidebar() {
        this.sidebar = document.createElement('div');
        this.sidebar.className = 'calibrator-sidebar';
        this.sidebar.innerHTML = `
            <div class="calibrator-header">
                <h3>Color Calibrator</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="calibrator-content">
                <div class="control-section">
                    <h4>Text & Font</h4>
                    <div class="control-group">
                        <label>Font Size</label>
                        <input type="range" id="fontSize" min="12" max="32" value="${this.settings.fontSize}">
                        <span class="value">${this.settings.fontSize}px</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Line Height</label>
                        <input type="range" id="lineHeight" min="1" max="2.5" step="0.1" value="${this.settings.lineHeight}">
                        <span class="value">${this.settings.lineHeight}</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Letter Spacing</label>
                        <input type="range" id="letterSpacing" min="-2" max="5" step="0.1" value="${this.settings.letterSpacing}">
                        <span class="value">${this.settings.letterSpacing}px</span>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Color Adjustments</h4>
                    <div class="control-group">
                        <label>Brightness</label>
                        <input type="range" id="brightness" min="50" max="200" value="${this.settings.brightness}">
                        <span class="value">${this.settings.brightness}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Contrast</label>
                        <input type="range" id="contrast" min="50" max="200" value="${this.settings.contrast}">
                        <span class="value">${this.settings.contrast}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Saturation</label>
                        <input type="range" id="saturation" min="0" max="200" value="${this.settings.saturation}">
                        <span class="value">${this.settings.saturation}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Hue Rotation</label>
                        <input type="range" id="hueRotate" min="0" max="360" value="${this.settings.hueRotate}">
                        <span class="value">${this.settings.hueRotate}deg</span>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Advanced Color</h4>
                    <div class="control-group">
                        <label>Gamma</label>
                        <input type="range" id="gamma" min="0.5" max="2.5" step="0.1" value="${this.settings.gamma}">
                        <span class="value">${this.settings.gamma}</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Invert</label>
                        <input type="range" id="invert" min="0" max="100" value="${this.settings.invert}">
                        <span class="value">${this.settings.invert}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Sepia</label>
                        <input type="range" id="sepia" min="0" max="100" value="${this.settings.sepia}">
                        <span class="value">${this.settings.sepia}%</span>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Vision Simulation Profiles</h4>
                    <div class="profile-buttons">
                        <button class="vision-profile" data-profile="normal">Normal Vision</button>
                        <button class="vision-profile" data-profile="protanopia">Protanopia</button>
                        <button class="vision-profile" data-profile="deuteranopia">Deuteranopia</button>
                        <button class="vision-profile" data-profile="tritanopia">Tritanopia</button>
                        <button class="vision-profile" data-profile="achromatopsia">Monochrome</button>
                        <button class="vision-profile" data-profile="high-contrast">High Contrast</button>
                        <button class="vision-profile" data-profile="low-vision">Low Vision</button>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Custom Profiles</h4>
                    <div class="profile-controls">
                        <input type="text" id="profileName" placeholder="Profile name" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button id="saveBtn" class="save-btn">Save</button>
                    </div>
                    <div class="profile-controls">
                        <select id="profileSelect">
                            <option value="">Load custom profile...</option>
                        </select>
                        <button id="loadProfileBtn" class="profile-btn">Load</button>
                        <button id="deleteProfileBtn" class="profile-btn delete">Delete</button>
                    </div>
                    <div class="control-actions">
                        <button id="resetBtn" class="reset-btn">Reset All</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.sidebar);
        this.setupEventListeners();
        this.loadProfilesIntoSelect();
    }

    setupScrollFollowing() {
        let ticking = false;
        
        const updatePosition = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Only update if scroll position changed significantly
            if (Math.abs(scrollY - this.lastScrollY) > 1) {
                this.lastScrollY = scrollY;
                
                // Calculate button position - bottom right, 20px from bottom of visible area
                const buttonBottom = 20 + (documentHeight - (scrollY + windowHeight));
                this.button.style.bottom = `${Math.max(20, buttonBottom)}px`;
                this.button.style.top = 'auto';
                
                if (this.isOpen) {
                    this.sidebar.style.top = `${scrollY}px`;
                }
            }
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updatePosition);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        // Initial position update
        updatePosition();
    }

    setupEventListeners() {
        this.sidebar.querySelector('.close-btn').addEventListener('click', () => this.toggleSidebar());
        this.sidebar.querySelector('#resetBtn').addEventListener('click', () => this.resetSettings());
        this.sidebar.querySelector('#saveBtn').addEventListener('click', () => this.saveProfile());
        this.sidebar.querySelector('#loadProfileBtn').addEventListener('click', () => this.loadSelectedProfile());
        this.sidebar.querySelector('#deleteProfileBtn').addEventListener('click', () => this.deleteSelectedProfile());

        // Vision profile buttons
        const visionButtons = this.sidebar.querySelectorAll('.vision-profile');
        visionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.loadVisionProfile(e.target.dataset.profile);
            });
        });

        // Input listeners for real-time updates
        const inputs = this.sidebar.querySelectorAll('input[type="range"]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateValueDisplay(e.target);
                this.updateSetting(e.target.id, e.target.value);
            });
        });
    }

    toggleSidebar() {
        this.isOpen = !this.isOpen;
        this.sidebar.style.display = this.isOpen ? 'block' : 'none';
        this.button.classList.toggle('active', this.isOpen);
        
        // Update sidebar position when opening
        if (this.isOpen) {
            const scrollY = window.scrollY;
            this.sidebar.style.top = `${scrollY}px`;
        }
    }

    updateValueDisplay(input) {
        const valueDisplay = input.nextElementSibling;
        if (valueDisplay && valueDisplay.classList.contains('value')) {
            if (input.id === 'gamma' || input.id === 'lineHeight') {
                valueDisplay.textContent = input.value;
            } else if (input.id === 'letterSpacing') {
                valueDisplay.textContent = input.value + 'px';
            } else if (input.id === 'hueRotate') {
                valueDisplay.textContent = input.value + 'deg';
            } else {
                valueDisplay.textContent = input.value + '%';
            }
        }
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.applySettings();
        this.saveSettings();
    }

    applySettings() {
        const root = document.documentElement;
        
        // Apply CSS custom properties
        root.style.setProperty('--calibrator-font-size', `${this.settings.fontSize}px`);
        root.style.setProperty('--calibrator-line-height', this.settings.lineHeight);
        root.style.setProperty('--calibrator-letter-spacing', `${this.settings.letterSpacing}px`);
        
        // Build filter string
        let filter = `
            brightness(${this.settings.brightness}%)
            contrast(${this.settings.contrast}%)
            saturate(${this.settings.saturation}%)
            hue-rotate(${this.settings.hueRotate}deg)
            invert(${this.settings.invert}%)
            sepia(${this.settings.sepia}%)
        `;
        
        // Apply filter to entire body
        document.body.style.filter = filter;
    }

    loadVisionProfile(profileName) {
        const profiles = {
            'normal': {
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 0,
                brightness: 100,
                contrast: 100,
                saturation: 100,
                hueRotate: 0,
                gamma: 1.0,
                invert: 0,
                sepia: 0
            },
            'protanopia': {
                brightness: 110,
                contrast: 120,
                saturation: 80,
                hueRotate: 0,
                gamma: 1.2,
                invert: 0,
                sepia: 0
            },
            'deuteranopia': {
                brightness: 105,
                contrast: 115,
                saturation: 85,
                hueRotate: 5,
                gamma: 1.1,
                invert: 0,
                sepia: 0
            },
            'tritanopia': {
                brightness: 100,
                contrast: 110,
                saturation: 90,
                hueRotate: 350,
                gamma: 1.0,
                invert: 0,
                sepia: 0
            },
            'achromatopsia': {
                brightness: 90,
                contrast: 130,
                saturation: 0,
                hueRotate: 0,
                gamma: 1.3,
                invert: 0,
                sepia: 0
            },
            'high-contrast': {
                brightness: 100,
                contrast: 200,
                saturation: 100,
                hueRotate: 0,
                gamma: 1.0,
                invert: 100,
                sepia: 0
            },
            'low-vision': {
                fontSize: 20,
                lineHeight: 1.8,
                letterSpacing: 1,
                brightness: 120,
                contrast: 150,
                saturation: 100,
                hueRotate: 0,
                gamma: 1.2,
                invert: 0,
                sepia: 0
            }
        };

        if (profiles[profileName]) {
            // Merge with current settings but prioritize profile values
            this.settings = { ...this.settings, ...profiles[profileName] };
            this.updateUI();
            this.applySettings();
            this.saveSettings();
        }
    }

    resetSettings() {
        this.settings = this.getDefaultSettings();
        this.updateUI();
        this.applySettings();
        this.saveSettings();
    }

    getDefaultSettings() {
        return {
            fontSize: 16,
            lineHeight: 1.5,
            letterSpacing: 0,
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hueRotate: 0,
            gamma: 1.0,
            invert: 0,
            sepia: 0
        };
    }

    updateUI() {
        // Update all sliders to match current settings
        const inputs = this.sidebar.querySelectorAll('input[type="range"]');
        inputs.forEach(input => {
            if (this.settings[input.id] !== undefined) {
                input.value = this.settings[input.id];
                this.updateValueDisplay(input);
            }
        });
    }

    saveSettings() {
        localStorage.setItem('colorCalibratorSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('colorCalibratorSettings');
        return saved ? { ...this.getDefaultSettings(), ...JSON.parse(saved) } : this.getDefaultSettings();
    }

    saveProfile() {
        const profileNameInput = this.sidebar.querySelector('#profileName');
        const profileName = profileNameInput.value.trim();
        
        if (profileName) {
            const profiles = this.getProfiles();
            profiles[profileName] = { ...this.settings };
            localStorage.setItem('colorCalibratorProfiles', JSON.stringify(profiles));
            this.loadProfilesIntoSelect();
            profileNameInput.value = '';
            alert(`Profile "${profileName}" saved!`);
        } else {
            alert('Please enter a profile name');
        }
    }

    loadSelectedProfile() {
        const select = this.sidebar.querySelector('#profileSelect');
        const profileName = select.value;
        
        if (profileName) {
            const profiles = this.getProfiles();
            if (profiles[profileName]) {
                this.settings = { ...this.getDefaultSettings(), ...profiles[profileName] };
                this.updateUI();
                this.applySettings();
                this.saveSettings();
            }
        }
    }

    deleteSelectedProfile() {
        const select = this.sidebar.querySelector('#profileSelect');
        const profileName = select.value;
        
        if (profileName && confirm(`Delete profile "${profileName}"?`)) {
            const profiles = this.getProfiles();
            delete profiles[profileName];
            localStorage.setItem('colorCalibratorProfiles', JSON.stringify(profiles));
            this.loadProfilesIntoSelect();
            select.value = '';
        }
    }

    getProfiles() {
        return JSON.parse(localStorage.getItem('colorCalibratorProfiles') || '{}');
    }

    loadProfilesIntoSelect() {
        const select = this.sidebar.querySelector('#profileSelect');
        const profiles = this.getProfiles();
        
        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add profile options
        Object.keys(profiles).forEach(profileName => {
            const option = document.createElement('option');
            option.value = profileName;
            option.textContent = profileName;
            select.appendChild(option);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.colorCalibrator = new ColorCalibrator();
    });
} else {
    window.colorCalibrator = new ColorCalibrator();
}