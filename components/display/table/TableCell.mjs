import Event from "../../../helpers/Event.mjs";
import AbstractComponent from "../../AbstractComponent.mjs";



export default class TableCell extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {*} props.sortValue
     * @param {string} props.sortKey
     * @param {null|Function} props.renderer
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this._tagName = "td";
    }

    isDataCell() { return this._tagName === "td"; }
    isHeadCell() { return this._tagName === "th"; }

    static _defaultProps = {
        sortValue: null,
        sortKey: null,
        renderer: null
    }

    get data() { return this.props?.data }

    static validateProps(props) {
        return (
            (
                props.sortKey === null ||
                typeof props.sortKey === "string"
            ) &&
            (
                props.renderer === null ||
                typeof props.renderer === "function"
            )
        );
    }

    onPropsChange(oldProps) {
        if (
            oldProps.sortValue !== this.props.sortValue ||
            oldProps.sortKey !== this.props.sortKey
        ) this._dispathEvent(Event.TABLE_SORT_CHANGE);

        if (this.isMounted() && (oldProps.renderer !== this.props.renderer)) {
            this.detachChildren(this.childrenContainer());
            this.attachChildren(this.childrenContainer(), this.renderedChildren());
        }
    }

    onChildAdded(child) {
        super.onChildAdded(child);

        if (!this.isMounted()) return;

        this.detachChildren(this.childrenContainer());
        this.attachChildren(this.childrenContainer(), this.renderedChildren());
    }

    onChildRemoved(child) {
        super.onChildRemoved(child);

        if (!this.isMounted()) return;

        this.detachChildren(this.childrenContainer());
        this.attachChildren(this.childrenContainer(), this.renderedChildren());
    }

    renderedChildren() {
        if (this.props.renderer === null) return this.children;

        return this.props.renderer(this);
    }

    render() {
        let el = document.createElement(this._tagName);

        this.attachChildren(el, this.renderedChildren());
        this.attachListeners(el);

        return el;
    }
}