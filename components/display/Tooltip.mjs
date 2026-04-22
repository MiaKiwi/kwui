import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "../core/CSSVariables.mjs";



export default class Tooltip extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string|null} props.content
     * @param {string} props.location
     * @param {boolean} props.inline
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);
    }

    static locations = {
        top: "top",
        left: "left",
        bottom: "bottom",
        right: "right"
    }

    static _defaultProps = {
        content: null,
        inline: true,
        location: this.locations.top
    }

    static validateProps(props) {
        return (
            Object.values(this.locations).includes(props.location) &&
            typeof props.inline === "boolean" &&
            (typeof props.content === "string" || props.content === null)
        );
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.content !== this.props.content) i.dataset.tooltip = this.props.content;
            if (oldProps.location !== this.props.location) i.classList.remove(oldProps.location); i.classList.add(this.props.location);
            if (oldProps.inline !== this.props.inline) {
                if (this.props.inline) { i.classList.add("text-inline") } else { i.classList.remove("text-inline") }
            }
        };
    }

    static _rawStylingRules = [
        `[data-tooltip]{position:relative}`,
        `[data-tooltip]:hover::after,[data-tooltip]:focus::after{font-size:0.8em;display:block;max-width:80ch;position:absolute;content:attr(data-tooltip);backdrop-filter:blur(3px) brightness(0.75);color:var(--text);border:var(--border-thin-width) solid var(--card-border);padding:var(--padding-sm);border-radius:var(--border-roundness)}`,
        `[data-tooltip].top::after,[data-tooltip].bottom::after{left:50%;transform:translateX(-50%)}`,
        `[data-tooltip].right::after,[data-tooltip].left::after{top:50%;transform:translateY(-50%)}`,
        `[data-tooltip].bottom::after{top:calc(100% + var(--padding-sm))}`,
        `[data-tooltip].right::after{left:calc(100% + var(--padding-sm))}`,
        `[data-tooltip].left::after{right:calc(100% + var(--padding-sm))}`,
        `[data-tooltip].top::after{bottom:calc(100% + var(--padding-sm))}`,
    ];

    static dependencies = [CSSVariables];

    render() {
        let el = document.createElement("div");

        el.classList.add("tooltip", this.props.location, this.themeClass());
        el.dataset.tooltip = this.props.content;
        if (this.props.inline) el.classList.add("text-inline");

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}