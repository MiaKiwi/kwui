import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import Typography from "../../core/Typography.mjs";



export default class CardFooter extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static dependencies = [CSSVariables, Typography];

    static _rawStylingRules = [
        `.card-footer{margin-top:var(--padding-md);padding-top:var(--padding-sm);border-top:var(--border-thin-width) solid var(--border);}`
    ]

    render() {
        let el = document.createElement("div");

        el.classList.add("card-footer", "text-s", "text-muted", this.themeClass());

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}