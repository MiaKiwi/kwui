import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";



export default class AvatarGroup extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {boolean} props.inline
     * @param {string} props.orientation
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
        horizontal: 'horizontal'
    }

    static _defaultProps = {
        inline: false,
        orientation: this.orientations.horizontal
    }

    static validateProps(props) {
        return (
            Object.values(this.orientations).includes(props.orientation) &&
            typeof props.inline === "boolean"
        );
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.avatar-group{display:flex}`,
        `.avatar-group.inline{display:inline-flex;margin-inline:var(--letter-spacing)}`,
        `.avatar-group.horizontal>.avatar{margin-left:0;margin-right:0}`,
        `.avatar-group.horizontal>.avatar:not(:first-of-type){margin-left:-1em}`,
        `.avatar-group.vertical{flex-direction:column}`,
        `.avatar-group.vertical>.avatar{margin-top:0;margin-bottom:0}`,
        `.avatar-group.vertical>.avatar:not(:first-of-type){margin-top:-1em}`
    ]

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.orientation !== this.props.orientation) i.classList.remove(oldProps.orientation); i.classList.add(this.props.orientation);
            oldProps.inline !== this.props.inline && this.props.inline ? i.classList.add("inline") : i.classList.remove("inline");
        };
    }

    render() {
        let el = document.createElement("div");

        el.classList.add("avatar-group", this.props.orientation, this.themeClass());

        if (this.props.inline) el.classList.add("inline");

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}