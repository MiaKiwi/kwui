import Event from "../../../helpers/Event.mjs";
import AbstractComponent from "../../AbstractComponent.mjs";



export default class TableCell extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {*} props.sortValue
     * @param {string} props.sortKey
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
        sortValue: null,
        sortKey: null
    }

    static validateProps(props) {
        return (
            props.sortKey === null ||
            typeof props.sortKey === "string"
        );
    }

    onPropsChange(oldProps) {
        if (
            oldProps.sortValue !== this.props.sortValue ||
            oldProps.sortKey !== this.props.sortKey
        ) this._dispathEvent(Event.TABLE_SORT_CHANGE);
    }
}