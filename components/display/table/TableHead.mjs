import Event from "../../../helpers/Event.mjs";
import AbstractComponent from "../../AbstractComponent.mjs";
import Button from "../../control/Button.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import FontawesomeIcon from "../icons/FontawesomeIcon.mjs";
import TableCell from "./TableCell.mjs";



export default class TableHead extends TableCell {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {*} props.sortValue
     * @param {string} props.sortKey
     * @param {null|Function} props.renderer
     * @param {boolean} props.sortable
     * @param {boolean} props.sortAsc
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this._sortBtn = new Button({
            style: Button.styles.empty,
            shape: Button.shapes.circular
        }, [
            new FontawesomeIcon({
                name: 'sort-down'
            })
        ]);
        this._sortBtn.listen('click', () => {
            this.setProps({ sortAsc: !this.props.sortAsc });
            this._dispathEvent(Event.TABLE_SORT_CHANGE);
        }).addClass("sort-btn");

        this._tagName = "th";
    }

    static _defaultProps = {
        ...super._defaultProps,
        sortable: false,
        sortAsc: true
    }

    static _rawStylingRules = [
        ...super._rawStylingRules,
        `.table th:has(.sort-btn){position:relative}`,
        `.table .sort-btn{position:absolute;bottom:0;right:0;opacity:var(--muted-transparency)}`,
        `.table .sort-btn:hover{opacity:unset}`,
    ]

    static dependencies = [CSSVariables]

    static validateProps(props) {
        return (
            super.validateProps(props) &&
            typeof props.sortable === "boolean" &&
            typeof props.sortAsc === "boolean"
        );
    }

    onPropsChange(oldProps) {
        super.onPropsChange(oldProps);

        if (
            oldProps.sortable !== this.props.sortable ||
            oldProps.sortAsc !== this.props.sortAsc
        ) this._updateSortBtn();
    }

    _updateSortBtn() {
        if (!this.isMounted()) return;

        this._sortBtn.unmount();
        this._sortBtn.children[0].setProps({ name: 'sort-down' });

        if (this.props.sortAsc) this._sortBtn.children[0].setProps({ name: 'sort-up' });
        if (this.props.sortable) this._sortBtn.mount(this.childrenContainer());
    }

    onMount() {
        super.onMount();

        this._updateSortBtn();
    }
}