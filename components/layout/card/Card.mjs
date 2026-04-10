import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";



export default class Card extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.shape
     * @param {boolean} props.borderless
     * @param {boolean} props.glass
     * @param {boolean} props.compact
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static shapes = {
        square: 'square',
        rounded: 'rounded'
    }

    static _defaultProps = {
        shape: this.shapes.rounded,
        borderless: false,
        glass: false,
        compact: false
    }

    static validateProps(props) {
        return (
            Object.values(this.shapes).includes(props.shape) &&
            typeof props.borderless === 'boolean' &&
            typeof props.compact === 'boolean' &&
            typeof props.glass === 'boolean'
        )
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.card{--card-bg:var(--bg);--card-fg:var(--text);--card-border:var(--border);--card-border-radius:var(--border-roundness);padding:var(--padding-sm) var(--padding-md);background-color:var(--card-bg);color:var(--card-fg);border:var(--border-thin-width) solid var(--card-border);border-radius:var(--card-border-radius);box-shadow:var(--box-shadow);margin:var(--padding-md) 0}`,
        `.card.rounded{border-radius:var(--border-roundness)}`,
        `.card.square{border-radius:0}`,
        `.card.compact{margin:0}`,
        `.card.kw-{{theme}}{--card-border:var(--{{theme}});--card-bg:var(--{{theme}}-90);--card-fg:var(--{{theme}}-10)}`,
        `.card.borderless{border:none;box-shadow:none}`,
        `.card.glass{backdrop-filter:blur(3px);background-color:transparent;background-color:color-mix(in srgb,var(--card-bg),transparent 90%)}`
    ]

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            this.props.compact ? i.classList.add("compact") : i.classList.remove("compact");
            this.props.glass ? i.classList.add("glass") : i.classList.remove("glass");
            this.props.borderless ? i.classList.add("borderless") : i.classList.remove("borderless");
            if (oldProps.shape !== this.props.shape) {
                i.classList.remove(oldProps.shape);
                i.classList.add(this.props.shape);
            }
        };
    }

    render() {
        let card = document.createElement("div");

        card.classList.add("card", this.props.shape, this.themeClass());
        if (this.props.glass) card.classList.add("glass");
        if (this.props.compact) card.classList.add("compact");

        this.attachChildren(card);
        this.attachListeners(card);

        return card;
    }
}