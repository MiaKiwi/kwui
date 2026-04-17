import AbstractComponent from "../AbstractComponent.mjs"
import CSSVariables from "../core/CSSVariables.mjs";
import Button from "./Button.mjs";



export default class ButtonGroup extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.orientation
     * @param {boolean} props.unique
     * @param {boolean} props.joined
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = []) {
        super(props, children, theme, id, classes);
    }

    static orientations = {
        vertical: 'vertical',
        horizontal: 'horizontal',
    }

    static _defaultProps = {
        orientation: this.orientations.horizontal,
        unique: false,
        joined: false
    }

    static validateProps(props) {
        return (
            typeof props.orientation === 'string' &&
            Object.values(this.orientations).includes(props.orientation) &&
            typeof props.unique === 'boolean' &&
            typeof props.joined === 'boolean'
        )
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.btn-group{display:inline-flex;margin-left:var(--inline-block-spacing);margin-right:var(--inline-block-spacing);gap:0.75em}`,
        `.btn-group.joined:not(.vertical) .btn:not(:first-child),.btn-group.joined.horizontal .btn:not(:first-child){margin-left:0;border-top-left-radius:0;border-bottom-left-radius:0}`,
        `.btn-group.joined:not(.vertical) .btn:not(:last-child),.btn-group.joined.horizontal .btn:not(:last-child){margin-right:0;border-top-right-radius:0;border-bottom-right-radius:0}`,
        `.btn-group.joined{gap:0}`,
        `.btn-group.joined.vertical{flex-direction:column}`,
        `.btn-group.joined.vertical .btn:not(:first-child){margin-top:0;border-top-left-radius:0;border-top-right-radius:0}`,
        `.btn-group.joined.vertical .btn:not(:last-child){margin-bottom:0;border-bottom-left-radius:0;border-bottom-right-radius:0}`,
        `.btn-group.vertical{flex-direction:column}`,
        `.btn-group.unique:has(>.btn.single-use.active){pointer-events:none}`,
    ]

    render() {
        let group = document.createElement("div");

        group.classList.add("btn-group", this.props.orientation, this.themeClass());

        if (this.props.joined) group.classList.add("joined")
        if (this.props.unique) group.classList.add("unique")

        this.attachChildren(group);
        this.attachListeners(group);

        return group;
    }



    bindEvents() {
        let group = this.i();

        if (this.props.unique) {
            let buttons = this.children.filter(c => c instanceof Button);
            let uniqueCallback = async (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.type === 'pointerdown') {
                    for (let btn of buttons) {
                        if (btn.i() !== e.target && btn.i().classList.contains("active")) {
                            btn.i().classList.remove("active");
                        }
                    }
                }
            }
            group.addEventListener("pointerdown", uniqueCallback);
            group.addEventListener("keydown", uniqueCallback);

            this._cleanUpFunctions.push(() => { group.removeEventListener("pointerdown", uniqueCallback) });
            this._cleanUpFunctions.push(() => { group.removeEventListener("keydown", uniqueCallback) });
        }
    }


    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.orientation !== this.props.orientation) {
                i.classList.remove(oldProps.orientation);
                if (this.props.orientation) i.classList.add(this.props.orientation);
            }
            if (oldProps.unique !== this.props.unique) {
                i.classList.remove("unique");
                if (this.props.unique) i.classList.add("unique");
            }
            if (oldProps.joined !== this.props.joined) {
                i.classList.remove("joined");
                if (this.props.joined) i.classList.add("joined");
            }
        }
    }
}