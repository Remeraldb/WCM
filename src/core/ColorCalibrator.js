import { SettingsManager } from './SettingsManager.js';
import { ProfileManager } from './ProfileManager.js';

export class ColorCalibrator {
    constructor() {
        this.settingsManager = new SettingsManager();
        this.profileManager = new ProfileManager();
        this.isOpen = false;
    }

    applySettings(settings = null) {
        const currentSettings = settings || this.settingsManager.getSettings();
        const root = document.documentElement;
        
        // Apply CSS custom properties to the entire document
        root.style.setProperty('--calibrator-font-size', `${currentSettings.fontSize}px`);
        root.style.setProperty('--calibrator-line-height', currentSettings.lineHeight);
        root.style.setProperty('--calibrator-letter-spacing', `${currentSettings.letterSpacing}px`);
        
        // Apply font properties directly to all elements
        this.applyFontProperties(currentSettings);
        
        // Build filter string with gamma simulation
        let filter = this.buildFilterString(currentSettings);
        
        // Apply filter to the ENTIRE HTML document (including calibrator)
        document.documentElement.style.filter = filter;
        
        // Also apply to body for backward compatibility
        document.body.style.filter = filter;

        return currentSettings;
    }

    buildFilterString(settings) {
        // Gamma correction simulation
        // CSS doesn't have gamma() filter, so we simulate it with brightness/contrast
        let gamma = parseFloat(settings.gamma);
        
        // Calculate gamma-adjusted brightness and contrast
        // Gamma < 1: brighten midtones (increase brightness, reduce contrast)
        // Gamma > 1: darken midtones (reduce brightness, increase contrast)
        let gammaBrightness = 100;
        let gammaContrast = 100;
        
        if (gamma < 1.0) {
            // Brighten: increase brightness, reduce contrast
            gammaBrightness = 100 + ((1 - gamma) * 50); // 100% to 150%
            gammaContrast = 100 - ((1 - gamma) * 30); // 100% to 70%
        } else if (gamma > 1.0) {
            // Darken: reduce brightness, increase contrast
            gammaBrightness = 100 - ((gamma - 1) * 30); // 100% to 70%
            gammaContrast = 100 + ((gamma - 1) * 50); // 100% to 150%
        }
        
        // Combine user brightness/contrast with gamma adjustments
        const userBrightness = parseFloat(settings.brightness);
        const userContrast = parseFloat(settings.contrast);
        
        // Multiply adjustments (percentages are multiplicative)
        const totalBrightness = (userBrightness / 100) * gammaBrightness;
        const totalContrast = (userContrast / 100) * gammaContrast;
        
        // Build the filter string
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
        // Apply font properties to all elements that should be affected
        const allElements = document.querySelectorAll('*');
        
        // Apply to body first (this will affect everything)
        document.body.style.fontSize = `${settings.fontSize}px`;
        document.body.style.lineHeight = settings.lineHeight;
        document.body.style.letterSpacing = `${settings.letterSpacing}px`;
        
        // Also apply to html element for consistency
        document.documentElement.style.fontSize = `${settings.fontSize}px`;
        document.documentElement.style.lineHeight = settings.lineHeight;
        document.documentElement.style.letterSpacing = `${settings.letterSpacing}px`;
    }

    updateSetting(key, value) {
        const newSettings = this.settingsManager.updateSetting(key, value);
        this.applySettings(newSettings);
        return newSettings;
    }

    resetSettings() {
        const defaultSettings = this.settingsManager.resetSettings();
        this.applySettings(defaultSettings);
        return defaultSettings;
    }

    getCurrentSettings() {
        return this.settingsManager.getSettings();
    }

    loadVisionProfile(profileName) {
        const profile = this.profileManager.getVisionProfile(profileName);
        if (profile) {
            const newSettings = this.settingsManager.setSettings(profile);
            this.applySettings(newSettings);
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
            this.applySettings(newSettings);
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