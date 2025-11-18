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
            },
            'dyslexia-friendly': {
                fontSize: 18,
                lineHeight: 2.0,
                letterSpacing: 2,
                brightness: 100,
                contrast: 120,
                saturation: 100,
                hueRotate: 0,
                gamma: 1.0,
                invert: 0,
                sepia: 0
            },
            'adhd-friendly': {
                fontSize: 16,
                lineHeight: 1.6,
                letterSpacing: 0.5,
                brightness: 90,
                contrast: 110,
                saturation: 80,
                hueRotate: 0,
                gamma: 1.1,
                invert: 0,
                sepia: 10
            },
            'autism-friendly': {
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 0,
                brightness: 85,
                contrast: 105,
                saturation: 70,
                hueRotate: 0,
                gamma: 1.0,
                invert: 0,
                sepia: 0
            },
            'light-sensitivity': {
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 0,
                brightness: 70,
                contrast: 130,
                saturation: 90,
                hueRotate: 0,
                gamma: 0.8,
                invert: 0,
                sepia: 30
            },
            'dark-mode': {
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 0,
                brightness: 80,
                contrast: 120,
                saturation: 100,
                hueRotate: 0,
                gamma: 0.9,
                invert: 100,
                sepia: 0
            },
            'blue-light-filter': {
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 0,
                brightness: 100,
                contrast: 100,
                saturation: 100,
                hueRotate: 200,
                gamma: 1.0,
                invert: 0,
                sepia: 20
            },
            'high-saturation': {
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 0,
                brightness: 100,
                contrast: 110,
                saturation: 180,
                hueRotate: 0,
                gamma: 1.0,
                invert: 0,
                sepia: 0
            },
            'print-friendly': {
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 0,
                brightness: 100,
                contrast: 150,
                saturation: 0,
                hueRotate: 0,
                gamma: 1.0,
                invert: 0,
                sepia: 100
            },
            'migraine-friendly': {
                fontSize: 16,
                lineHeight: 1.8,
                letterSpacing: 0,
                brightness: 80,
                contrast: 100,
                saturation: 50,
                hueRotate: 0,
                gamma: 0.9,
                invert: 0,
                sepia: 40
            },
            'cataract-friendly': {
                fontSize: 20,
                lineHeight: 1.8,
                letterSpacing: 1,
                brightness: 130,
                contrast: 140,
                saturation: 110,
                hueRotate: 0,
                gamma: 1.3,
                invert: 0,
                sepia: 0
            },
            'glaucoma-friendly': {
                fontSize: 18,
                lineHeight: 1.7,
                letterSpacing: 0.5,
                brightness: 110,
                contrast: 160,
                saturation: 90,
                hueRotate: 0,
                gamma: 1.2,
                invert: 0,
                sepia: 0
            },
            'macular-friendly': {
                fontSize: 22,
                lineHeight: 2.0,
                letterSpacing: 1.5,
                brightness: 120,
                contrast: 170,
                saturation: 100,
                hueRotate: 0,
                gamma: 1.4,
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

    getProfileCategories() {
        return {
            'color-blindness': ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'],
            'visual-impairment': ['low-vision', 'cataract-friendly', 'glaucoma-friendly', 'macular-friendly'],
            'reading-support': ['dyslexia-friendly', 'adhd-friendly', 'print-friendly'],
            'sensory-support': ['autism-friendly', 'light-sensitivity', 'migraine-friendly'],
            'display-optimization': ['high-contrast', 'dark-mode', 'blue-light-filter', 'high-saturation']
        };
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