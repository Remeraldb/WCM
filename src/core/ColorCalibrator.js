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
        
        // Apply CSS custom properties to the entire document
        const root = document.documentElement;
        root.style.setProperty('--calibrator-font-size', `${currentSettings.fontSize}px`);
        root.style.setProperty('--calibrator-line-height', currentSettings.lineHeight);
        root.style.setProperty('--calibrator-letter-spacing', `${currentSettings.letterSpacing}px`);
        
        // Build filter string
        let filter = `
            brightness(${currentSettings.brightness}%)
            contrast(${currentSettings.contrast}%)
            saturate(${currentSettings.saturation}%)
            hue-rotate(${currentSettings.hueRotate}deg)
            invert(${currentSettings.invert}%)
            sepia(${currentSettings.sepia}%)
        `;
        
        // Apply filter to the ENTIRE HTML document (including calibrator)
        document.documentElement.style.filter = filter;
        
        // Also apply to body for backward compatibility
        document.body.style.filter = filter;

        return currentSettings;
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