export class Button {
    constructor(onClick) {
        this.onClick = onClick;
        this.element = null;
        this.createButton();
    }

    createButton() {
        this.element = document.createElement('button');
        this.element.className = 'calibrator-btn';
        this.element.innerHTML = '🎨';
        this.element.setAttribute('aria-label', 'Open color calibrator');
        
        this.element.addEventListener('click', this.onClick);
        document.body.appendChild(this.element);
    }

    setActive(active) {
        this.element.classList.toggle('active', active);
    }

    getElement() {
        return this.element;
    }
}