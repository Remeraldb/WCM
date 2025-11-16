export class SettingsManager {
    constructor() {
        this.defaultSettings = {
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
        this.settings = this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('colorCalibratorSettings');
        return saved ? { ...this.defaultSettings, ...JSON.parse(saved) } : { ...this.defaultSettings };
    }

    saveSettings() {
        localStorage.setItem('colorCalibratorSettings', JSON.stringify(this.settings));
    }

    updateSetting(key, value) {
        this.settings[key] = parseFloat(value);
        this.saveSettings();
        return this.settings;
    }

    resetSettings() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        return this.settings;
    }

    getSettings() {
        return this.settings;
    }

    setSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        return this.settings;
    }
}