import AbstractComponent from "../AbstractComponent.mjs";



export default class TagComponent extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.tagName
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
        tagName: "div"
    }

    static validateProps(props) {
        return typeof props.tagName === "string" && props.tagName.length > 0;
    }

    onPropsChange(oldProps) { super.onPropsChange(oldProps); if (this.isMounted() && oldProps.tagName !== this.props.tagName) console.warn(`${this.constructor.name} (${this.id}): Changing tag names live is not recommended. Use at your own risks`); }

    render() {
        let el = document.createElement(this.props.tagName);

        el.classList.add(this.themeClass());

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}