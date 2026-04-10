import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import Typography from "../../core/Typography.mjs";



export default class CardHeader extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = []) {
        super(props, children, theme, id, classes);
    }

    static dependencies = [CSSVariables, Typography];

    static _rawStylingRules = [
        `.card-header{margin-bottom:var(--padding-sm)}`
    ]

    render() {
        let el = document.createElement("div");

        el.classList.add("card-header", "text-s", this.themeClass());

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}