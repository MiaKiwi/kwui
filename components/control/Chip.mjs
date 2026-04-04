import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "../core/CSSVariables.mjs";
import FontawesomeIcon from "../display/icons/FontawesomeIcon.mjs";
import Button from "./Button.mjs";



export default class Chip extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.shape
     * @param {boolean} props.dismissable
     * @param {boolean} props.inline
     * @param {object} props.colors
     * @param {string} props.colors.bg
     * @param {string} props.colors.fg
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static shapes = {
        circular: 'circular',
        square: 'square',
        rounded: 'rounded'
    }

    static _defaultProps = {
        shape: this.shapes.circular,
        dismissable: true,
        inline: false,
        colors: {
            bg: null,
            fg: null
        }
    }

    static validateProps(props) {
        return (
            Object.values(this.shapes).includes(props.shape) &&
            (
                typeof props.colors === 'object' &&
                (typeof props.colors.bg === 'string' || props.colors.bg === null) &&
                (typeof props.colors.fg === 'string' || props.colors.fg === null)
            ) &&
            typeof props.inline === 'boolean' &&
            typeof props.dismissable === 'boolean'
        )
    }

    static dependencies = [CSSVariables, FontawesomeIcon];

    static _rawStylingRules = [
        `.chip{--chip-font-size:0.75em;--chip-border-radius:var(--border-roundness);--chip-bg:var(--primary-90);--chip-fg:var(--primary-10);--chip-border:var(--primary);display:grid;grid-auto-flow: column;align-items:center;gap:var(--letter-spacing);padding:var(--padding-xs) var(--padding-md);background-color:var(--chip-bg);color:var(--chip-fg);border:var(--border-thin-width) solid var(--chip-border);border-radius:var(--chip-border-radius);box-shadow:var(--box-shadow);width:max-content;margin:var(--padding-xs);font-size:var(--chip-font-size);}`,
        `.chip:has(.close-btn){grid-template-areas: "content close-btn";}`,
        `.chip .close-btn{grid-area:close-btn}`,
        `.chip.circular{--chip-border-radius:9999em;}`,
        `.chip.square{--chip-border-radius:0;}`,
        `.chip.rounded{--chip-border-radius:0.5em;}`,
        `.chip.inline{display:inline-grid;margin:0;margin-left:var(--inline-block-spacing);}`,
        `.chip.kw-{{theme}}{--chip-bg:var(--{{theme}}-90);--chip-fg:var(--{{theme}}-10);--chip-border:var(--{{theme}});}`
    ]

    render() {
        let chip = document.createElement("div");

        chip.classList.add("chip", this.props.shape, this.themeClass());
        if (this.props.inline) chip.classList.add("inline");
        if (this.props.colors.bg && this.props.colors.fg) {
            chip.style.setProperty("--chip-bg", this.props.colors.bg);
            chip.style.setProperty("--chip-border", this.props.colors.fg);
            chip.style.setProperty("--chip-fg", this.props.colors.fg);
        }

        this.attachChildren(chip);
        this.attachListeners(chip);

        if (this.props.dismissable) {
            let close = new Button({
                style: Button.styles.empty,
                singleUse: true
            }, [
                new FontawesomeIcon({
                    name: "xmark",
                    family: FontawesomeIcon.fa_families.classic,
                    style: FontawesomeIcon.fa_styles.solid,
                    // inline: true
                })
            ], this.theme);

            close.addListener("click", (e) => {
                let event = new CustomEvent('chip-close', {
                    detail: {
                        originalEvent: e
                    }
                });
                chip.dispatchEvent(event);

                this.unmount();
            });

            close.mount(chip);
            close.i().classList.add("close-btn")
        }

        return chip;
    }
}