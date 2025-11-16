export class ProfileManager {
    constructor() {
        this.visionProfiles = {
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
    }

    getVisionProfiles() {
        return this.visionProfiles;
    }

    getVisionProfile(name) {
        return this.visionProfiles[name] || null;
    }

    saveCustomProfile(name, settings) {
        const profiles = this.getCustomProfiles();
        profiles[name] = { ...settings };
        localStorage.setItem('colorCalibratorProfiles', JSON.stringify(profiles));
        return profiles;
    }

    getCustomProfiles() {
        return JSON.parse(localStorage.getItem('colorCalibratorProfiles') || '{}');
    }

    loadCustomProfile(name) {
        const profiles = this.getCustomProfiles();
        return profiles[name] || null;
    }

    deleteCustomProfile(name) {
        const profiles = this.getCustomProfiles();
        delete profiles[name];
        localStorage.setItem('colorCalibratorProfiles', JSON.stringify(profiles));
        return profiles;
    }
}