import { SettingsManager } from './SettingsManager.js';
import { ProfileManager } from './ProfileManager.js';

export class ColorCalibrator {
    constructor() {
        this.settingsManager = new SettingsManager();
        this.profileManager = new ProfileManager();
        this.isOpen = false;
        this.transitionEnabled = false;
        this.initialized = false;
    }

    init() {
        // Apply initial settings without animation
        this.applySettings(null, false);
        this.initialized = true;
    }

    enableTransitions(enable = true) {
        this.transitionEnabled = enable;
        const root = document.documentElement;
        if (enable) {
            root.style.setProperty('--calibrator-transition', 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)');
            document.body.style.transition = 'filter 0.4s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.4s ease, line-height 0.4s ease, letter-spacing 0.4s ease';
        } else {
            root.style.setProperty('--calibrator-transition', 'none');
            document.body.style.transition = 'none';
        }
    }

    applySettings(settings = null, animate = false) {
        // Don't animate on initial load
        if (animate && this.initialized) {
            this.enableTransitions(true);
        }
        
        const currentSettings = settings || this.settingsManager.getSettings();
        const root = document.documentElement;
        
        // Apply CSS custom properties
        root.style.setProperty('--calibrator-font-size', `${currentSettings.fontSize}px`);
        root.style.setProperty('--calibrator-line-height', currentSettings.lineHeight);
        root.style.setProperty('--calibrator-letter-spacing', `${currentSettings.letterSpacing}px`);
        
        // Apply font properties directly
        this.applyFontProperties(currentSettings);
        
        // Build filter string
        let filter = this.buildFilterString(currentSettings);
        
        // Apply filter
        document.documentElement.style.filter = filter;
        document.body.style.filter = filter;

        // Disable transitions after animation completes
        if (animate && this.initialized) {
            setTimeout(() => {
                this.enableTransitions(false);
            }, 400);
        }

        return currentSettings;
    }

    buildFilterString(settings) {
        let gamma = parseFloat(settings.gamma);
        let gammaBrightness = 100;
        let gammaContrast = 100;
        
        if (gamma < 1.0) {
            gammaBrightness = 100 + ((1 - gamma) * 50);
            gammaContrast = 100 - ((1 - gamma) * 30);
        } else if (gamma > 1.0) {
            gammaBrightness = 100 - ((gamma - 1) * 30);
            gammaContrast = 100 + ((gamma - 1) * 50);
        }
        
        const userBrightness = parseFloat(settings.brightness);
        const userContrast = parseFloat(settings.contrast);
        
        const totalBrightness = (userBrightness / 100) * gammaBrightness;
        const totalContrast = (userContrast / 100) * gammaContrast;
        
        return `
            brightness(${totalBrightness}%)
            contrast(${totalContrast}%)
            saturate(${settings.saturation}%)
            hue-rotate(${settings.hueRotate}deg)
            invert(${settings.invert}%)
            sepia(${settings.sepia}%)
        `;
    }

    applyFontProperties(settings) {
        document.body.style.fontSize = `${settings.fontSize}px`;
        document.body.style.lineHeight = settings.lineHeight;
        document.body.style.letterSpacing = `${settings.letterSpacing}px`;
        
        document.documentElement.style.fontSize = `${settings.fontSize}px`;
        document.documentElement.style.lineHeight = settings.lineHeight;
        document.documentElement.style.letterSpacing = `${settings.letterSpacing}px`;
    }

    updateSetting(key, value) {
        const newSettings = this.settingsManager.updateSetting(key, value);
        this.applySettings(newSettings, true); // Animate user changes
        return newSettings;
    }

    resetSettings() {
        const defaultSettings = this.settingsManager.resetSettings();
        this.applySettings(defaultSettings, true); // Animate reset
        return defaultSettings;
    }

    getCurrentSettings() {
        return this.settingsManager.getSettings();
    }

    loadVisionProfile(profileName) {
        const profile = this.profileManager.getVisionProfile(profileName);
        if (profile) {
            const newSettings = this.settingsManager.setSettings(profile);
            this.applySettings(newSettings, true); // Animate profile changes
            return newSettings;
        }
        return null;
    }

    saveCustomProfile(profileName) {
        return this.profileManager.saveCustomProfile(profileName, this.settingsManager.getSettings());
    }

    loadCustomProfile(profileName) {
        const profile = this.profileManager.loadCustomProfile(profileName);
        if (profile) {
            const newSettings = this.settingsManager.setSettings(profile);
            this.applySettings(newSettings, true); // Animate profile changes
            return newSettings;
        }
        return null;
    }

    deleteCustomProfile(profileName) {
        return this.profileManager.deleteCustomProfile(profileName);
    }

    getCustomProfiles() {
        return this.profileManager.getCustomProfiles();
    }

    getVisionProfiles() {
        return this.profileManager.getVisionProfiles();
    }

    getProfileCategories() {
        return this.profileManager.getProfileCategories();
    }
}