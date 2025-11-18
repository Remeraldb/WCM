import { SettingsManager } from './SettingsManager.js';
import { ProfileManager } from './ProfileManager.js';

export class ColorCalibrator {
    constructor() {
        this.settingsManager = new SettingsManager();
        this.profileManager = new ProfileManager();
        this.isOpen = false;
        this.pageWrapper = null;
        this.initPageWrapper();
    }

    initPageWrapper() {
        // Create or get a wrapper for all page content
        this.pageWrapper = document.getElementById('color-calibrator-wrapper');
        if (!this.pageWrapper) {
            this.pageWrapper = document.createElement('div');
            this.pageWrapper.id = 'color-calibrator-wrapper';
            this.pageWrapper.className = 'color-calibrator-page-wrapper';
            
            // Move all existing body content into the wrapper (except our calibrator elements)
            const bodyChildren = Array.from(document.body.children);
            bodyChildren.forEach(child => {
                if (!child.classList.contains('calibrator-btn') && 
                    !child.classList.contains('calibrator-sidebar') &&
                    child.id !== 'color-calibrator-wrapper') {
                    this.pageWrapper.appendChild(child);
                }
            });
            
            document.body.appendChild(this.pageWrapper);
        }
    }

    applySettings(settings = null) {
        const currentSettings = settings || this.settingsManager.getSettings();
        const root = document.documentElement;
        
        // Apply CSS custom properties to the wrapper
        if (this.pageWrapper) {
            this.pageWrapper.style.setProperty('--calibrator-font-size', `${currentSettings.fontSize}px`);
            this.pageWrapper.style.setProperty('--calibrator-line-height', currentSettings.lineHeight);
            this.pageWrapper.style.setProperty('--calibrator-letter-spacing', `${currentSettings.letterSpacing}px`);
        }
        
        // Build filter string
        let filter = `
            brightness(${currentSettings.brightness}%)
            contrast(${currentSettings.contrast}%)
            saturate(${currentSettings.saturation}%)
            hue-rotate(${currentSettings.hueRotate}deg)
            invert(${currentSettings.invert}%)
            sepia(${currentSettings.sepia}%)
        `;
        
        // Apply filter to the page wrapper (not body)
        if (this.pageWrapper) {
            this.pageWrapper.style.filter = filter;
        } else {
            // Fallback to body if wrapper doesn't exist
            document.body.style.filter = filter;
        }

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