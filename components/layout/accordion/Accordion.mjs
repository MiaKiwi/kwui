import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";



export default class Accordion extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {boolean} props.opened
     * @param {boolean} props.borderless
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);
    }

    static _defaultProps = {
        opened: false,
        borderless: false
    }

    static validateProps(props) {
        return (
            typeof props.opened === 'boolean' &&
            typeof props.borderless === "boolean"
        )
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.accordion{--accordion-bg:var(--bg);--accordion-border:var(--border);box-shadow:var(--box-shadow);background-color:var(--accordion-bg);border:var(--border-thin-width) solid var(--accordion-border);border-radius:0;padding:var(--padding-sm);margin:var(--padding-sm)}`,
        `.accordion.borderless{border:none;box-shadow:none}`,
        `.accordion.kw-{{theme}} .accordion-mark{color:var(--{{theme}})}`,
        // `.accordion>:not(.accordion-sum){transition: max-height var(--transition-slow) ease-in-out;max-height:1000px;overflow:hidden}`,
        // `.accordion:not([open])>:not(.accordion-sum){max-height:0;transition:none}`
    ]

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.opened !== this.props.opened) {
                i.removeAttribute("open");

                if (this.props.opened) i.setAttribute("open", "");
            }
            if (oldProps.borderless !== this.props.borderless) {
                i.classList.remove("borderless");

                if (this.props.borderless) i.classList.add("borderless");
            }
        };
    }

    render() {
        let el = document.createElement("details");

        el.classList.add("accordion", this.themeClass());

        if (this.props.opened) el.setAttribute("open", "");
        if (this.props.borderless) el.classList.add("borderless");

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }

    isSummaryElement(element) {
        return (
            (typeof element === 'string' && element.includes("summary")) ||
            (element instanceof HTMLElement && element.tagName === "summary") ||
            (element instanceof AbstractComponent)
        );
    }

    onChildAdded(child) {
        super.onChildAdded(child);

        if (!this.children.some(c => this.isSummaryElement(c))) {
            console.warn(`${this.constructor.name} (${this.id}): Should contain at least one <summary> element`);
        }
    }

    onCreation() {
        this.addListener("toggle", () => {
            this._props.opened = this.i()?.open ? true : false;
        })
    }
}