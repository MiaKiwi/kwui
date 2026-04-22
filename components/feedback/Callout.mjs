import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "../core/CSSVariables.mjs";
import FontawesomeIcon from "../display/icons/FontawesomeIcon.mjs";



export default class Callout extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.type
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this._icon = new FontawesomeIcon(
            this.constructor._typeIconMap[this.props.type],
            [],
            this.theme ?? this.props.type
        );

        this.setTheme(this.theme ?? this.props.type);
    }

    static _typeIconMap = {
        info: {
            name: "circle-info",
            style: "solid"
        },
        positive: {
            name: "circle-check",
            style: "solid"
        },
        warning: {
            name: "circle-exclamation",
            style: "solid"
        },
        negative: {
            name: "circle-xmark",
            style: "solid"
        },
        accent: {
            name: "star",
            style: "solid"
        }
    }

    static types = {
        info: "info",
        success: "positive",
        warning: "warning",
        danger: "negative",
        important: "accent"
    }

    static _defaultProps = {
        type: this.types.info
    }

    static validateProps(props) {
        return Object.values(this.types).includes(props.type);
    }

    childrenContainer() { return this.i().querySelector(".callout-content"); }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.type !== this.props.type) {
                this.setTheme(this.props.type);
                this._icon.setProps({ ...this.constructor._typeIconMap[this.props.type] });
                this._icon.setTheme(this.theme);
            }
        };
    }

    static _rawStylingRules = [
        `.callout{--callout-fg:var(--text);--callout-bg:var(--bg);--callout-border:var(--callout-fg);color:var(--callout-fg);background-color:var(--callout-bg);border:var(--border-thin-width) solid var(--callout-border);border-radius:var(--border-roundness);margin:var(--padding-sm) 0;padding:var(--padding-sm) var(--padding-sm);box-shadow:var(--box-shadow);gap:var(--letter-spacing);display:grid;grid-template-areas:"icon content";grid-template-columns:auto 1fr auto;align-items:baseline}`,
        `.callout.kw-{{theme}}{--callout-bg:var(--{{theme}}-90);--callout-fg:var(--{{theme}}-10);--callout-border:var(--{{theme}});}`,
        `.callout .callout-icon{grid-area:icon}`,
        `.callout .callout-content{grid-area:content}`,
    ];

    static dependencies = [CSSVariables];

    render() {
        let el = document.createElement("div");

        el.classList.add("callout", this.themeClass());

        this._icon.mount(el);
        this._icon.i()?.classList.add("callout-icon");

        let content = document.createElement("div");
        content.classList.add("callout-content");
        el.appendChild(content)

        this.attachChildren(content);
        this.attachListeners(el);

        return el;
    }
}