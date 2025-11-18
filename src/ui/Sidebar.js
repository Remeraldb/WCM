export class Sidebar {
    constructor(calibrator, onClose, onSettingChange, onProfileAction) {
        this.calibrator = calibrator;
        this.onClose = onClose;
        this.onSettingChange = onSettingChange;
        this.onProfileAction = onProfileAction;
        this.element = null;
        this.createSidebar();
    }

    createSidebar() {
        this.element = document.createElement('div');
        this.element.className = 'calibrator-sidebar';
        this.updateContent();
        document.body.appendChild(this.element);
        this.setupEventListeners();
    }

    updateContent() {
        const settings = this.calibrator.getCurrentSettings();
        const customProfiles = this.calibrator.getCustomProfiles();
        const profileCategories = this.calibrator.getProfileCategories();
        const visionProfiles = this.calibrator.getVisionProfiles();
        
        this.element.innerHTML = `
            <div class="calibrator-header">
                <h3>Color Calibrator</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="calibrator-content">
                <div class="control-section">
                    <h4>Text & Font</h4>
                    <div class="control-group">
                        <label>Font Size</label>
                        <input type="range" id="fontSize" min="12" max="32" value="${settings.fontSize}">
                        <span class="value">${settings.fontSize}px</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Line Height</label>
                        <input type="range" id="lineHeight" min="1" max="2.5" step="0.1" value="${settings.lineHeight}">
                        <span class="value">${settings.lineHeight}</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Letter Spacing</label>
                        <input type="range" id="letterSpacing" min="-2" max="5" step="0.1" value="${settings.letterSpacing}">
                        <span class="value">${settings.letterSpacing}px</span>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Color Adjustments</h4>
                    <div class="control-group">
                        <label>Brightness</label>
                        <input type="range" id="brightness" min="50" max="200" value="${settings.brightness}">
                        <span class="value">${settings.brightness}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Contrast</label>
                        <input type="range" id="contrast" min="50" max="200" value="${settings.contrast}">
                        <span class="value">${settings.contrast}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Saturation</label>
                        <input type="range" id="saturation" min="0" max="200" value="${settings.saturation}">
                        <span class="value">${settings.saturation}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Hue Rotation</label>
                        <input type="range" id="hueRotate" min="0" max="360" value="${settings.hueRotate}">
                        <span class="value">${settings.hueRotate}deg</span>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Advanced Color</h4>
                    <div class="control-group">
                        <label>Gamma</label>
                        <input type="range" id="gamma" min="0.5" max="2.5" step="0.1" value="${settings.gamma}">
                        <span class="value">${settings.gamma}</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Invert</label>
                        <input type="range" id="invert" min="0" max="100" value="${settings.invert}">
                        <span class="value">${settings.invert}%</span>
                    </div>
                    
                    <div class="control-group">
                        <label>Sepia</label>
                        <input type="range" id="sepia" min="0" max="100" value="${settings.sepia}">
                        <span class="value">${settings.sepia}%</span>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Accessibility Profiles</h4>
                    
                    <div class="profile-category">
                        <h5>Color Blindness</h5>
                        <div class="profile-buttons">
                            ${this.renderProfileButtons(profileCategories['color-blindness'], visionProfiles)}
                        </div>
                    </div>
                    
                    <div class="profile-category">
                        <h5>Visual Impairment</h5>
                        <div class="profile-buttons">
                            ${this.renderProfileButtons(profileCategories['visual-impairment'], visionProfiles)}
                        </div>
                    </div>
                    
                    <div class="profile-category">
                        <h5>Reading Support</h5>
                        <div class="profile-buttons">
                            ${this.renderProfileButtons(profileCategories['reading-support'], visionProfiles)}
                        </div>
                    </div>
                    
                    <div class="profile-category">
                        <h5>Sensory Support</h5>
                        <div class="profile-buttons">
                            ${this.renderProfileButtons(profileCategories['sensory-support'], visionProfiles)}
                        </div>
                    </div>
                    
                    <div class="profile-category">
                        <h5>Display Optimization</h5>
                        <div class="profile-buttons">
                            ${this.renderProfileButtons(profileCategories['display-optimization'], visionProfiles)}
                        </div>
                    </div>
                </div>

                <div class="control-section">
                    <h4>Custom Profiles</h4>
                    <div class="profile-controls">
                        <input type="text" id="profileName" placeholder="Profile name">
                        <button id="saveBtn" class="save-btn">Save</button>
                    </div>
                    <div class="profile-controls">
                        <select id="profileSelect">
                            <option value="">Load custom profile...</option>
                            ${Object.keys(customProfiles).map(name => 
                                `<option value="${name}">${name}</option>`
                            ).join('')}
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
    }

    renderProfileButtons(profileKeys, visionProfiles) {
        const profileLabels = {
            'normal': 'Normal Vision',
            'protanopia': 'Protanopia',
            'deuteranopia': 'Deuteranopia',
            'tritanopia': 'Tritanopia',
            'achromatopsia': 'Monochrome',
            'high-contrast': 'High Contrast',
            'low-vision': 'Low Vision',
            'dyslexia-friendly': 'Dyslexia',
            'adhd-friendly': 'ADHD',
            'autism-friendly': 'Autism',
            'light-sensitivity': 'Light Sensitive',
            'dark-mode': 'Dark Mode',
            'blue-light-filter': 'Blue Light',
            'high-saturation': 'High Saturation',
            'print-friendly': 'Print Friendly',
            'migraine-friendly': 'Migraine',
            'cataract-friendly': 'Cataract',
            'glaucoma-friendly': 'Glaucoma',
            'macular-friendly': 'Macular'
        };

        return profileKeys.map(key => `
            <button class="vision-profile" data-profile="${key}" title="${this.getProfileDescription(key)}">
                ${profileLabels[key] || key}
            </button>
        `).join('');
    }

    getProfileDescription(profileKey) {
        const descriptions = {
            'normal': 'Standard display settings',
            'protanopia': 'Red-green color blindness (red deficiency)',
            'deuteranopia': 'Red-green color blindness (green deficiency)',
            'tritanopia': 'Blue-yellow color blindness',
            'achromatopsia': 'Complete color blindness (monochrome)',
            'high-contrast': 'Maximum contrast for better visibility',
            'low-vision': 'Enhanced settings for visual impairment',
            'dyslexia-friendly': 'Improved readability for dyslexia',
            'adhd-friendly': 'Reduced distractions and better focus',
            'autism-friendly': 'Reduced sensory overload',
            'light-sensitivity': 'Reduced brightness for light sensitivity',
            'dark-mode': 'Inverted colors for dark theme',
            'blue-light-filter': 'Reduced blue light for eye comfort',
            'high-saturation': 'Vibrant colors for better distinction',
            'print-friendly': 'Optimized for printing and reading',
            'migraine-friendly': 'Reduced triggers for migraine sufferers',
            'cataract-friendly': 'Enhanced settings for cataract vision',
            'glaucoma-friendly': 'Optimized for glaucoma conditions',
            'macular-friendly': 'Enhanced for macular degeneration'
        };
        return descriptions[profileKey] || 'Accessibility profile';
    }

    setupEventListeners() {
        this.element.querySelector('.close-btn').addEventListener('click', this.onClose);
        this.element.querySelector('#resetBtn').addEventListener('click', () => {
            this.onProfileAction('reset');
        });
        this.element.querySelector('#saveBtn').addEventListener('click', () => {
            const profileName = this.element.querySelector('#profileName').value.trim();
            if (profileName) {
                this.onProfileAction('save', profileName);
                this.element.querySelector('#profileName').value = '';
            }
        });
        this.element.querySelector('#loadProfileBtn').addEventListener('click', () => {
            const profileName = this.element.querySelector('#profileSelect').value;
            if (profileName) {
                this.onProfileAction('load', profileName);
            }
        });
        this.element.querySelector('#deleteProfileBtn').addEventListener('click', () => {
            const profileName = this.element.querySelector('#profileSelect').value;
            if (profileName) {
                this.onProfileAction('delete', profileName);
            }
        });

        // Vision profile buttons
        const visionButtons = this.element.querySelectorAll('.vision-profile');
        visionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.onProfileAction('vision', e.target.dataset.profile);
            });
        });

        // Input listeners
        const inputs = this.element.querySelectorAll('input[type="range"]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateValueDisplay(e.target);
                this.onSettingChange(e.target.id, e.target.value);
            });
        });
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

    updateUI(settings) {
        const inputs = this.element.querySelectorAll('input[type="range"]');
        inputs.forEach(input => {
            if (settings[input.id] !== undefined) {
                input.value = settings[input.id];
                this.updateValueDisplay(input);
            }
        });
    }

    updateProfileList(profiles) {
        const select = this.element.querySelector('#profileSelect');
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        Object.keys(profiles).forEach(profileName => {
            const option = document.createElement('option');
            option.value = profileName;
            option.textContent = profileName;
            select.appendChild(option);
        });
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    getElement() {
        return this.element;
    }
}