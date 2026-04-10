import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "../core/CSSVariables.mjs";



export default class Breadcrumbs extends AbstractComponent {
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

    static _defaultProps = {
    }

    static validateProps(props) {
        return super.validateProps(props);
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.breadcrumbs{list-style:none;display:flex;flex-wrap:wrap;gap:var(--letter-spacing);padding:var(--padding-sm);margin:0}`,
        `.breadcrumbs .breadcrumbs-item{position:relative}`,
        `.breadcrumbs .breadcrumbs-item:not(:last-child)::after{content:'/';opacity:var(--muted-transparency);margin-inline-start:var(--letter-spacing)}`,
        `.breadcrumbs .breadcrumbs-item:not(:first-child):not(:last-child):not(:hover):not(:focus){opacity:var(--muted-transparency);text-decoration:none}`
    ]

    attachChildren(element, children = this.children) {
        super.attachChildren(element, children);

        Array.from(element.children)?.forEach(child => {
            child.classList.add("breadcrumbs-item")
        });
    }

    render() {
        let el = document.createElement("ol");

        el.classList.add("breadcrumbs", this.themeClass());

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}