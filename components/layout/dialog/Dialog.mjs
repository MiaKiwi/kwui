import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";



export default class Dialog extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.shape
     * @param {boolean} props.opened
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.shape !== this.props.shape) i.classList.remove(oldProps.shape); i.classList.add(this.props.shape);
            if (oldProps.opened !== this.props.opened) {
                if (this.props.opened) { this.show() } else { this.close() }
            }
        };
    }

    static shapes = {
        square: 'square',
        rounded: 'rounded'
    }

    static _defaultProps = {
        opened: false,
        shape: this.shapes.rounded
    }

    static validateProps(props) {
        return typeof props.opened === "boolean" && Object.values(this.shapes).includes(props.shape);
    }

    static _rawStylingRules = [
        `.dialog{--dialog-bg:var(--bg);--dialog-fg:var(--text);--dialog-border:var(--border);--dialog-border-radius:var(--border-roundness);padding:var(--padding-sm) var(--padding-md);background-color:var(--dialog-bg);color:var(--dialog-fg);border:var(--border-thin-width) solid var(--dialog-border);border-radius:var(--dialog-border-radius);box-shadow:var(--box-shadow);max-height:90%;width:calc(80ch + (var(--padding-md)*2))}`,
        `.dialog::backdrop{backdrop-filter:blur(3px) brightness(0.75)}`,
        `.dialog.rounded{border-radius:var(--border-roundness)}`,
        `.dialog.square{border-radius:0}`,
        `.dialog.kw-{{theme}}{--dialog-border:var(--{{theme}});--dialog-bg:var(--{{theme}}-90);--dialog-fg:var(--{{theme}}-10)}`,
    ];

    static dependencies = [CSSVariables];

    render() {
        let el = document.createElement("dialog");

        el.classList.add("dialog", this.props.shape, this.themeClass());
        el.setAttribute("closedby", "any");

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }

    onCreation() {
        this.addListener("toggle", () => {
            this._props.opened = this.i()?.open ? true : false;
        })
    }

    onMount() {
        super.onMount();

        if (this.props.opened) this.show();
    }

    show() {
        if (this.isMounted()) {
            this.i().showModal();
        }
    }

    close() {
        if (this.isMounted()) {
            this.i().close();
        }
    }
}