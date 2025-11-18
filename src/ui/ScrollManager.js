export class ScrollManager {
    constructor(buttonElement, sidebarElement) {
        this.button = buttonElement;
        this.sidebar = sidebarElement;
        this.lastScrollY = window.scrollY;
        this.setupScrollFollowing();
        this.updatePosition(); // Immediate positioning on load
    }

    setupScrollFollowing() {
        let ticking = false;
        
        const updatePosition = () => {
            const scrollY = window.scrollY;
            
            if (Math.abs(scrollY - this.lastScrollY) > 1) {
                this.lastScrollY = scrollY;
                
                // Update button position to follow scroll
                this.button.style.top = `${20 + scrollY}px`;
                this.button.style.bottom = 'auto';
                
                if (this.sidebar.style.display === 'block') {
                    this.sidebar.style.top = `${scrollY}px`;
                }
            }
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updatePosition);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    updatePosition() {
        const scrollY = window.scrollY;
        this.button.style.top = `${20 + scrollY}px`;
        this.button.style.bottom = 'auto';
        
        if (this.sidebar.style.display === 'block') {
            this.sidebar.style.top = `${scrollY}px`;
        }
    }

    updateSidebarPosition() {
        const scrollY = window.scrollY;
        this.sidebar.style.top = `${scrollY}px`;
    }
}