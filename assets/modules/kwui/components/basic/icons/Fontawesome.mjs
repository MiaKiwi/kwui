import CssComponent from "../../CssComponent.mjs";



export default class Fontawesome extends CssComponent {
    constructor({
        ...params
    }) {
        super(params);
    }



    static get cssRules() {
        let rules = [
            `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css');`
        ];

        return rules;
    }



    /**
     * Creates an icon element from a FontAwesome class string or i HTML string
     * @param {string|HTMLElement} iconInput The icon class string or HTML string
     * @returns {HTMLElement} The icon element
     */
    static createIcon(iconInput) {
        let icon = null;

        if (iconInput instanceof HTMLElement) {
            icon = iconInput;
        } else if (typeof iconInput === 'string' && iconInput.startsWith('<') && iconInput.endsWith('>')) {
            icon = new DOMParser().parseFromString(iconInput, 'text/html').body.firstChild;
        }
        else {
            icon = document.createElement('i');
            let classes = iconInput.trim().split(' ');
            for (let cls of classes) {
                icon.classList.add(cls);
            }
        }

        icon.classList.add('icon', 'fa-icon');

        return icon;
    }
}