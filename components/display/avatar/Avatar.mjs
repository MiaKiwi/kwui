import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";



export default class Avatar extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.shape
     * @param {boolean} props.inline
     * @param {string|null} props.bgUri
     * @param {string|null} props.size
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            oldProps.inline !== this.props.inline && this.props.inline ? i.classList.add("inline") : i.classList.remove("inline");
            if (oldProps.shape !== this.props.shape) i.classList.add(this.props.shape); i.classList.remove(oldProps.shape);
            if (oldProps.size !== this.props.size) i.classList.add(`avatar-${this.props.size}`); i.classList.remove(`avatar-${oldProps.size}`);
            oldProps.bgUri !== this.props.bgUri && this.props.bgUri ? i.style.backgroundImage = `url(${this.props.bgUri})` : i.style.removeProperty("background-image");
        }
    }

    static shapes = {
        circular: 'circular',
        square: 'square',
        rounded: 'rounded'
    }

    static sizes = {
        huge: 'huge',
        xxxl: 'xxxl',
        xxl: 'xxl',
        xl: 'xl',
        l: 'l',
        md: 'md',
        s: 's'
    }

    static _defaultProps = {
        shape: this.shapes.circular,
        inline: false,
        bgUri: null,
        size: null
    }

    static validateProps(props) {
        return (
            Object.values(this.shapes).includes(props.shape) &&
            typeof props.inline === "boolean" &&
            (props.bgUri === null || typeof props.bgUri === "string") &&
            (Object.values(this.sizes).includes(props.size) || props.size === null)
        );
    }

    static _rawStylingRules = [
        `.avatar{--avatar-size:2em;--avatar-bg:var(--primary-90);--avatar-fg:var(--primary-10);--avatar-border-radius:var(--border-roundness);display:flex;align-items:center;justify-content:center;line-height:1;overflow:hidden;width:var(--avatar-size);height:var(--avatar-size);background-color:var(--avatar-bg);color:var(--avatar-fg);font-size:1.25em;border-radius:var(--avatar-border-radius);user-select:none;margin:var(--padding-sm);background-size:contain;background-position:center;background-repeat:no-repeat;box-shadow:var(--box-shadow)}`,
        `.avatar.circular{--avatar-border-radius:50%}`,
        `.avatar.square{--avatar-border-radius:0}`,
        `.avatar.rounded{--avatar-border-radius:var(--border-roundness)}`,
        `.avatar.kw-{{theme}}{--avatar-bg:var(--{{theme}}-90);--avatar-fg:var(--{{theme}}-10)}`,
        `.avatar.inline{margin:0;display:inline-flex;vertical-align:baseline;margin-inline:var(--letter-spacing) var(--letter-spacing)}`,
        `.avatar-huge{font-size:3.739em}`,
        `.avatar-xxxl{font-size:3.324em}`,
        `.avatar-xxl{font-size:2.978em}`,
        `.avatar-xl{font-size:2.69em}`,
        `.avatar-l{font-size:2.45em}`,
        `.avatar-md{font-size:1.25em}`,
        `.avatar-s{font-size:1em}`
    ];

    static dependencies = [CSSVariables];

    render() {
        let el = document.createElement("div");

        el.classList.add("avatar", this.themeClass());

        if (this.props.size) el.classList.add(`avatar-${this.props.size}`);
        if (this.props.inline) el.classList.add("inline");
        if (this.props.bgUri) el.style.backgroundImage = `url(${this.props.bgUri})`;
        el.classList.add(this.props.shape);

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}