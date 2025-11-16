export class ScrollManager {
    constructor(buttonElement, sidebarElement) {
        this.button = buttonElement;
        this.sidebar = sidebarElement;
        this.lastScrollY = 0;
        this.setupScrollFollowing();
    }

    setupScrollFollowing() {
        let ticking = false;
        
        const updatePosition = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (Math.abs(scrollY - this.lastScrollY) > 1) {
                this.lastScrollY = scrollY;
                
                // Calculate button position - bottom right, 20px from bottom of visible area
                const buttonBottom = 20 + (documentHeight - (scrollY + windowHeight));
                this.button.style.bottom = `${Math.max(20, buttonBottom)}px`;
                this.button.style.top = 'auto';
                
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
        updatePosition();
    }

    updateSidebarPosition() {
        const scrollY = window.scrollY;
        this.sidebar.style.top = `${scrollY}px`;
    }
}