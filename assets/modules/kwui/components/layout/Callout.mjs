import Fontawesome from "../basic/icons/Fontawesome.mjs";
import Component from "../Component.mjs";
import CssVariables from "../misc/CssVariables.mjs";



export default class Callout extends Component {
    /**
     * Creates a Callout component
     * @param {string} params.props.summary The accordion summary content
     */
    constructor({
        props = {
            style: 'default',
            icon: null
        },
        ...params
    }) {
        super({ props, ...params });

        if (this.props.expandIconLocation && !this.constructor.componentStyles.includes(this.props.expandIconLocation)) {
            console.warn(`Callout style "${this.props.expandIconLocation}" does not exist`);
            this.props.expandIconLocation = this.constructor.componentStyles[0];
        }
    }



    static get componentStyles() {
        return [
            'default',
            'info',
            'success',
            'warning',
            'danger',
            'important'
        ];
    }



    static get cssDependencies() {
        return [CssVariables];
    }



    static get cssRules() {
        return [
            `.callout{--callout-border-radius:var(--border-roundness);--callout-fg:var(--text);--callout-bg:var(--bg);--callout-border:var(--callout-fg);color:var(--callout-fg);background-color:var(--callout-bg);border:var(--border-thin-width) solid var(--callout-border);border-radius:var(--callout-border-radius);margin:var(--padding-md) 0;padding:var(--padding-md) var(--padding-sm);display:flex;align-items:center;align-content:flex-start;flex-wrap:wrap;gap:var(--letter-spacing);box-shadow:var(--box-shadow);}`,
            `.callout.kw-{{theme}}{--callout-bg:var(--{{theme}}-90);--callout-fg:var(--{{theme}}-10);border-color:var(--{{theme}});}`,
        ];
    }



    /**
     * Gets the icon corresponding to a style
     * @param {string} style The callout style
     * @returns {HTMLElement} The corresponding icon element
     */
    static getStyleIcon(style) {
        switch (style) {
            case 'info':
                return Fontawesome.createIcon('fa-solid fa-circle-info');
            case 'success':
                return Fontawesome.createIcon('fa-solid fa-circle-check');
            case 'warning':
                return Fontawesome.createIcon('fa-solid fa-triangle-exclamation');
            case 'danger':
                return Fontawesome.createIcon('fa-solid fa-circle-xmark');
            case 'important':
                return Fontawesome.createIcon('fa-solid fa-star');
            case 'default':
            default:
                return Fontawesome.createIcon('fa-solid fa-lightbulb');
        }
    }



    /**
     * Gets the theme corresponding to a style
     * @param {string} style The callout style
     * @returns {string} The corresponding theme
     */
    static getStyleTheme(style) {
        switch (style) {
            case 'info':
                return 'info';
            case 'success':
                return 'positive';
            case 'warning':
                return 'warning';
            case 'danger':
                return 'negative';
            case 'important':
                return 'primary';
            case 'default':
            default:
                return 'fg';
        }
    }



    createElement() {
        let callout = document.createElement('div');

        this.addAttributes(callout);

        if (this.props.style && !this.theme) {
            this.theme = Callout.getStyleTheme(this.props.style);
        }
        this.addThemeClass(callout);

        callout.classList.add('callout');

        if (!this.props.icon) {
            this.props.icon = Callout.getStyleIcon(this.props.style);
        }
        let icon = Component.getInputAsHTMLElement(this.props.icon);
        icon.classList.add('callout-icon');
        callout.appendChild(icon);

        this.attachChildren(callout);
        this.attachListeners(callout);

        return callout;
    }
}