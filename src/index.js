import { ColorCalibrator } from './core/ColorCalibrator.js';
import { Button } from './ui/Button.js';
import { Sidebar } from './ui/Sidebar.js';
import { ScrollManager } from './ui/ScrollManager.js';

class ColorCalibratorApp {
    constructor() {
        this.calibrator = new ColorCalibrator();
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create UI components
        this.button = new Button(() => this.toggleSidebar());
        this.sidebar = new Sidebar(
            this.calibrator,
            () => this.toggleSidebar(),
            (key, value) => this.onSettingChange(key, value),
            (action, data) => this.onProfileAction(action, data)
        );
        
        // Setup scroll following
        this.scrollManager = new ScrollManager(
            this.button.getElement(),
            this.sidebar.getElement()
        );

        // Apply initial settings
        this.calibrator.applySettings();
    }

    toggleSidebar() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.sidebar.show();
            this.scrollManager.updateSidebarPosition();
        } else {
            this.sidebar.hide();
        }
        this.button.setActive(this.isOpen);
    }

    onSettingChange(key, value) {
        const newSettings = this.calibrator.updateSetting(key, value);
        this.sidebar.updateUI(newSettings);
    }

    onProfileAction(action, data) {
        switch (action) {
            case 'reset':
                const resetSettings = this.calibrator.resetSettings();
                this.sidebar.updateUI(resetSettings);
                break;
                
            case 'save':
                this.calibrator.saveCustomProfile(data);
                this.sidebar.updateProfileList(this.calibrator.getCustomProfiles());
                alert(`Profile "${data}" saved!`);
                break;
                
            case 'load':
                const loadedSettings = this.calibrator.loadCustomProfile(data);
                if (loadedSettings) {
                    this.sidebar.updateUI(loadedSettings);
                }
                break;
                
            case 'delete':
                if (confirm(`Delete profile "${data}"?`)) {
                    this.calibrator.deleteCustomProfile(data);
                    this.sidebar.updateProfileList(this.calibrator.getCustomProfiles());
                }
                break;
                
            case 'vision':
                const visionSettings = this.calibrator.loadVisionProfile(data);
                if (visionSettings) {
                    this.sidebar.updateUI(visionSettings);
                }
                break;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.colorCalibrator = new ColorCalibratorApp();
    });
} else {
    window.colorCalibrator = new ColorCalibratorApp();
}