import AbstractComponent from "../../AbstractComponent.mjs";
import Animations from "../../core/Animations.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import FontawesomeIcon from "../../display/icons/FontawesomeIcon.mjs";
import AccordionSummary from "./AccordionSummary.mjs";



export default class AccordionPlusMinusSummary extends AccordionSummary {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.iconLocation
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this._icon = new FontawesomeIcon({
            name: "plus"
        }, [], theme);
    }

    static _defaultProps = {
        iconLocation: this.iconLocations.right
    }

    static validateProps(props) {
        return Object.values(this.iconLocations).includes(props.iconLocation);
    }

    static dependencies = [CSSVariables, Animations, AccordionSummary];

    render() {
        let el = document.createElement("summary");

        el.classList.add("accordion-sum", `mark-${this.props.iconLocation}`, this.themeClass());

        let childrenContainer = document.createElement("div");
        el.appendChild(childrenContainer);

        this.attachChildren(childrenContainer);
        this.attachListeners(el);

        let iconContainer = document.createElement("span");
        iconContainer.classList.add("accordion-mark");
        if (this.props.markMaxRotation) iconContainer.style.setProperty("--mark-rotation", "360deg");
        let icon = this._icon;
        icon.setTheme(this.theme);
        this.attachChildren(iconContainer, [icon]);
        el.appendChild(iconContainer);

        return el;
    }

    onMount() {
        super.onMount();

        let openCallback = () => {
            let target = this.parent;
            
            if (target.open) {
                this._icon.setProps({ name: 'minus' });
            } else {
                this._icon.setProps({ name: 'plus' });
            }
            this._icon.setTheme(this.theme);
        }

        this.parent.addEventListener("toggle", openCallback);
        this._cleanUpFunctions.push(() => { this.parent.removeEventListener("toggle", openCallback) });
    }
}