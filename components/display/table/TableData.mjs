import AbstractComponent from "../../AbstractComponent.mjs";
import TableCell from "./TableCell.mjs";



export default class TableData extends TableCell {
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

    render() {
        let el = document.createElement("td");

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}