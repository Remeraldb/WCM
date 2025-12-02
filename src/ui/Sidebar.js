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
                <!-- Text & Font Section -->
                <div class="control-section">
                    <h4>Text & Font</h4>
                    <div class="control-group">
                        <label>Font Size (${settings.fontSize}px)</label>
                        <input type="range" id="fontSize" min="12" max="32" value="${settings.fontSize}">
                        <div class="demo-box text-demo">
                            This text shows current font size
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Line Height (${settings.lineHeight})</label>
                        <input type="range" id="lineHeight" min="1" max="2.5" step="0.1" value="${settings.lineHeight}">
                        <div class="demo-box text-demo">
                            Multiple lines<br>to demonstrate<br>line height
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Letter Spacing (${settings.letterSpacing}px)</label>
                        <input type="range" id="letterSpacing" min="-2" max="5" step="0.1" value="${settings.letterSpacing}">
                        <div class="demo-box text-demo">
                            Spacing between letters
                        </div>
                    </div>
                </div>

                <!-- Color Adjustments Section -->
                <div class="control-section">
                    <h4>Color Adjustments</h4>
                    <div class="control-group">
                        <label>Brightness (${settings.brightness}%)</label>
                        <input type="range" id="brightness" min="50" max="200" value="${settings.brightness}">
                        <div class="demo-box color-demo">
                            <div class="color-swatch primary"></div>
                            <div class="color-swatch secondary"></div>
                            <div class="color-swatch success"></div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Contrast (${settings.contrast}%)</label>
                        <input type="range" id="contrast" min="50" max="200" value="${settings.contrast}">
                        <div class="demo-box">
                            <div style="display: flex; gap: 10px;">
                                <div style="background: #333; color: #fff; padding: 5px; border-radius: 3px; flex: 1;">Dark</div>
                                <div style="background: #fff; color: #333; padding: 5px; border-radius: 3px; border: 1px solid #ccc; flex: 1;">Light</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Saturation (${settings.saturation}%)</label>
                        <input type="range" id="saturation" min="0" max="200" value="${settings.saturation}">
                        <div class="demo-box color-demo">
                            <div style="background: #ff4444; width: 30px; height: 30px; border-radius: 4px;"></div>
                            <div style="background: #44ff44; width: 30px; height: 30px; border-radius: 4px;"></div>
                            <div style="background: #4444ff; width: 30px; height: 30px; border-radius: 4px;"></div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Hue Rotation (${settings.hueRotate}deg)</label>
                        <input type="range" id="hueRotate" min="0" max="360" value="${settings.hueRotate}">
                        <div class="demo-box">
                            <div style="display: flex; gap: 5px; justify-content: center;">
                                <div style="width: 20px; height: 20px; background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff); border-radius: 3px;"></div>
                                <div style="width: 20px; height: 20px; background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff); border-radius: 3px;"></div>
                                <div style="width: 20px; height: 20px; background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff); border-radius: 3px;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Advanced Color Section -->
                <div class="control-section">
                    <h4>Advanced Color</h4>
                    <div class="control-group">
                        <label>Gamma (${settings.gamma})</label>
                        <input type="range" id="gamma" min="0.5" max="2.5" step="0.1" value="${settings.gamma}">
                        <div class="demo-box advanced-demo">
                            <div class="demo-item">Mid Tone</div>
                            <div class="demo-item" style="background: #ccc;">Light</div>
                            <div class="demo-item" style="background: #666; color: white;">Dark</div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Invert (${settings.invert}%)</label>
                        <input type="range" id="invert" min="0" max="100" value="${settings.invert}">
                        <div class="demo-box advanced-demo">
                            <div class="demo-item" style="background: black; color: white;">Black</div>
                            <div class="demo-item" style="background: white; color: black; border: 1px solid #ccc;">White</div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Sepia (${settings.sepia}%)</label>
                        <input type="range" id="sepia" min="0" max="100" value="${settings.sepia}">
                        <div class="demo-box">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                                <div style="width: 40px; height: 40px; background: #8B4513; border-radius: 4px;"></div>
                                <span>Vintage Tone</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vision Simulation Profiles -->
                <div class="control-section">
                    <h4>Vision Simulation Profiles</h4>
                    
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

                <!-- Custom Profiles -->
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

        // Input listeners with live updates
        const inputs = this.element.querySelectorAll('input[type="range"]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.id;
                const value = e.target.value;
                
                // Update label text
                const label = e.target.parentElement.querySelector('label');
                if (label) {
                    const unit = id === 'fontSize' ? 'px' : 
                                 id === 'lineHeight' ? '' : 
                                 id === 'letterSpacing' ? 'px' : 
                                 id === 'hueRotate' ? 'deg' : '%';
                    label.textContent = this.getLabelText(id, value) + ` (${value}${unit})`;
                }
                
                this.onSettingChange(id, value);
            });
        });
    }

    getLabelText(id, value) {
        const labels = {
            'fontSize': 'Font Size',
            'lineHeight': 'Line Height',
            'letterSpacing': 'Letter Spacing',
            'brightness': 'Brightness',
            'contrast': 'Contrast',
            'saturation': 'Saturation',
            'hueRotate': 'Hue Rotation',
            'gamma': 'Gamma',
            'invert': 'Invert',
            'sepia': 'Sepia'
        };
        return labels[id] || id;
    }

    updateUI(settings) {
        // Update all sliders
        const inputs = this.element.querySelectorAll('input[type="range"]');
        inputs.forEach(input => {
            if (settings[input.id] !== undefined) {
                input.value = settings[input.id];
                
                // Update label
                const label = input.parentElement.querySelector('label');
                if (label) {
                    const unit = input.id === 'fontSize' ? 'px' : 
                                 input.id === 'lineHeight' ? '' : 
                                 input.id === 'letterSpacing' ? 'px' : 
                                 input.id === 'hueRotate' ? 'deg' : '%';
                    label.textContent = this.getLabelText(input.id, settings[input.id]) + ` (${settings[input.id]}${unit})`;
                }
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