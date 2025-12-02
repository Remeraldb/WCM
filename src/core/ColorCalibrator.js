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
        
        // Apply CSS custom properties to root for EVERYTHING
        root.style.setProperty('--calibrator-font-size', `${currentSettings.fontSize}px`);
        root.style.setProperty('--calibrator-line-height', currentSettings.lineHeight);
        root.style.setProperty('--calibrator-letter-spacing', `${currentSettings.letterSpacing}px`);
        
        // Create a filter string for EVERYTHING
        let filter = `
            brightness(${currentSettings.brightness}%)
            contrast(${currentSettings.contrast}%)
            saturate(${currentSettings.saturation}%)
            hue-rotate(${currentSettings.hueRotate}deg)
            invert(${currentSettings.invert}%)
            sepia(${currentSettings.sepia}%)
        `;
        
        // Apply to entire page wrapper (creates one if doesn't exist)
        this.applyFiltersToPage(filter);
        
        // Also apply gamma separately if needed
        this.applyGamma(currentSettings.gamma);

        return currentSettings;
    }

    applyFiltersToPage(filter) {
        // Get or create page wrapper
        let wrapper = document.querySelector('.page-content-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'page-content-wrapper';
            
            // Move all existing body children except calibrator elements into wrapper
            const bodyChildren = Array.from(document.body.children);
            bodyChildren.forEach(child => {
                if (!child.classList?.contains('calibrator-btn') && 
                    !child.classList?.contains('calibrator-sidebar') &&
                    child.id !== 'color-calibrator-wrapper') {
                    wrapper.appendChild(child);
                }
            });
            
            document.body.appendChild(wrapper);
        }
        
        // Apply filter to wrapper
        wrapper.style.filter = filter;
        
        // Also apply to body for good measure
        document.body.style.filter = filter;
    }

    applyGamma(gammaValue) {
        // Apply gamma correction using contrast/brightness approximation
        const wrapper = document.querySelector('.page-content-wrapper');
        if (wrapper) {
            // Remove any existing gamma styles
            wrapper.style.filter = wrapper.style.filter.replace(/brightness\([^)]*\)/g, '');
            wrapper.style.filter += ` brightness(${Math.pow(gammaValue, 0.5)})`;
        }
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