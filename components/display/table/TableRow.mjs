import AbstractComponent from "../../AbstractComponent.mjs";
import TableData from "./TableData.mjs";
import TableHead from "./TableHead.mjs";



export default class TableRow extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);
    }

    get headerCells() { return this.children?.filter(c => c instanceof TableHead); }
    get dataCells() { return this.children?.filter(c => c instanceof TableData); }

    render() {
        let el = document.createElement("tr");

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}