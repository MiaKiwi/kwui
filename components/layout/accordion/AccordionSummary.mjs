import AbstractComponent from "../../AbstractComponent.mjs";
import Animations from "../../core/Animations.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import FontawesomeIcon from "../../display/icons/FontawesomeIcon.mjs";



export default class AccordionSummary extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.iconLocation
     * @param {string|HTMLElement|AbstractComponent} props.icon
     * @param {number} props.markMaxRotation
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static iconLocations = {
        left: "left",
        right: "right"
    }

    static _defaultProps = {
        icon: new FontawesomeIcon({
            name: "angle-down"
        }),
        iconLocation: this.iconLocations.right,
        markMaxRotation: 180
    }

    static validateProps(props) {
        return (
            this.isHTMLCompatible(props.icon) &&
            Object.values(this.iconLocations).includes(props.iconLocation) &&
            typeof props.markMaxRotation === 'number' && props.markMaxRotation >= 0 && props.markMaxRotation <= 360
        )
    }

    static dependencies = [CSSVariables, Animations];

    static _rawStylingRules = [
        `.accordion-sum{position:relative;list-style:none;cursor:pointer;padding:var(--padding-sm) 0;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:var(--letter-spacing)}`,
        `.accordion-sum.mark-left{flex-direction:row-reverse}`,
        `.accordion[open] .accordion-sum{padding-bottom:calc(var(--padding-sm)*2);margin-bottom:var(--padding-sm)}`,
        `.accordion[open] .accordion-sum::after{content:"";position:absolute;bottom:0;left:var(--padding-sm);width:calc(100% - var(--padding-sm) * 2);background-color:var(--border);height:calc(var(--border-thin-width)/2)}`,
        `.accordion-mark{transition:rotate var(--transition-medium);--mark-rotation:180deg}`,
        `.accordion[open] .accordion-sum .accordion-mark{rotate:var(--mark-rotation)}`
    ]

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            let iconContainer = i.querySelector("span:first-of-type");
            if (oldProps.markMaxRotation !== this.props.markMaxRotation) iconContainer.style.setProperty("--mark-rotation", `${this.props.markMaxRotation}deg`);
            if (oldProps.iconLocation !== this.props.iconLocation) i.classList.remove(`mark-${oldProps.iconLocation}`); i.classList.add(`mark-${this.props.iconLocation}`);
            if (oldProps.icon !== this.props.icon) {
                this.detachChildren(iconContainer);

                let icon = this.props.icon;
                if (icon instanceof AbstractComponent) {
                    icon = icon.clone();
                    icon.setTheme(this.theme);
                    this._props.icon = icon;
                }

                this.attachChildren(iconContainer, [icon]);
            }
        };
    }

    childrenContainer() { return this.i().querySelector("div:first-of-type"); }

    render() {
        let el = document.createElement("summary");

        el.classList.add("accordion-sum", `mark-${this.props.iconLocation}`, this.themeClass());

        let childrenContainer = document.createElement("div");
        el.appendChild(childrenContainer);

        this.attachChildren(childrenContainer);
        this.attachListeners(el);

        let iconContainer = document.createElement("span");
        iconContainer.classList.add("accordion-mark");
        if (this.props.markMaxRotation) iconContainer.style.setProperty("--mark-rotation", `${this.props.markMaxRotation}deg`);
        let icon = this.props.icon;
        if (icon instanceof AbstractComponent) {
            icon = icon.clone();
            icon.setTheme(this.theme);
            this._props.icon = icon;
        }
        this.attachChildren(iconContainer, [icon]);
        el.appendChild(iconContainer);

        return el;
    }
}