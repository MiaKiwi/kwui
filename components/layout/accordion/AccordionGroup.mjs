import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import Accordion from "./Accordion.mjs";



export default class AccordionGroup extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {boolean} props.unique
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static _defaultProps = {
        unique: false
    }

    static validateProps(props) {
        return typeof props.unique === 'boolean';
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.accordion-group{display:flex;flex-direction:column;}`,
        `.accordion-group>.accordion:not(:first-of-type){margin-top:0;border-top-width:0;}`,
        `.accordion-group>.accordion:not(:last-child){margin-bottom:0;}`
    ]

    render() {
        let el = document.createElement("div");

        el.classList.add("accordion-group", this.themeClass());

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }

    onCreation() {
        let group = this;
        let accordions = this.children.filter(c => c instanceof Accordion);
        accordions.forEach(acc => {
            acc.addListener("toggle", (e) => {
                if (group.props.unique && acc.i().open) {
                    accordions.filter(a => a !== acc).forEach(a => a.setProps({ opened: false }));
                }
            });
        });
    }
}