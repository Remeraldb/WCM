export class ScrollManager {
    constructor(buttonElement, sidebarElement) {
        this.button = buttonElement;
        this.sidebar = sidebarElement;
        this.lastScrollY = window.scrollY;
        this.animationId = null;
        this.isScrolling = false;
        this.setupScrollFollowing();
        this.updatePosition(); // Immediate positioning on load
    }

    setupScrollFollowing() {
        const updatePosition = () => {
            const scrollY = window.scrollY;
            
            // Smooth following - no jumping
            if (Math.abs(scrollY - this.lastScrollY) > 0) {
                this.lastScrollY = scrollY;
                
                // Update button position smoothly
                this.button.style.top = `${20 + scrollY}px`;
                this.button.style.bottom = 'auto';
                
                if (this.sidebar.style.display === 'block') {
                    this.sidebar.style.top = `${scrollY}px`;
                }
            }
            
            if (this.isScrolling) {
                this.animationId = requestAnimationFrame(updatePosition);
            }
        };
        
        const onScroll = () => {
            if (!this.isScrolling) {
                this.isScrolling = true;
                this.animationId = requestAnimationFrame(updatePosition);
            }
        };
        
        const onScrollEnd = () => {
            this.isScrolling = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Use timeout to detect scroll end
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(onScrollEnd, 100);
        }, { passive: true });
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