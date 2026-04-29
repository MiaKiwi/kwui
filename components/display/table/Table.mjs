import Event from "../../../helpers/Event.mjs";
import StyleRegister from "../../../StyleRegister.mjs";
import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import Text from "../../core/typo/Text.mjs";
import Typography from "../../core/Typography.mjs";
import Loader from "../../feedback/Loader.mjs";
import TagComponent from "../../util/TagComponent.mjs";
import Avatar from "../avatar/Avatar.mjs";
import FontawesomeIcon from "../icons/FontawesomeIcon.mjs";
import TableData from "./TableData.mjs";
import TableHead from "./TableHead.mjs";
import TableRow from "./TableRow.mjs";



export default class Table extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {boolean} props.alternateShade
     * @param {number} props.limit
     * @param {number} props.offset
     * @param {boolean} props.sortable
     * @param {null|Function} props.sortCallback
     * @param {string} props.sortKey
     * @param {boolean} props.sortAsc
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this._emptyIndicator = new TagComponent({ tagName: 'div' }, [
            new Avatar({}, [
                new FontawesomeIcon({
                    name: 'eye-slash'
                })
            ], StyleRegister.themes.text)
        ]);
        this._emptyIndicator.addAttribute('style', 'display:flex;justify-content:center')

        this._emptyRow = new TableRow({}, [
            new TableData({}, [
                this._emptyIndicator
            ])
        ]);
        this._emptyRow.addAttribute('style', 'background-color:unset');
        this._emptyRow.children[0].addAttribute('colspan', '100%');

        this.addListener(Event.TABLE_SORT_CHANGE, (e) => {
            let c = e?.detail?.comp;
            let p = { sortKey: c?.props?.sortKey };
            if (typeof c?.props?.sortAsc === "boolean") p.sortAsc = c.props.sortAsc;
            this.setProps(p);

            this._update();
        });

        this.headerCells?.forEach(c => c.setProps({ sortable: this.props.sortable && (typeof c.props?.sortKey === "string") }));

        this._controllers = new Set();
        this._minOffset = null;
        this._previousOffset = null;
        this._nextOffset = null;
        this._maxOffset = null;
        this._total = null;
    }

    static _defaultProps = {
        alternateShade: true,
        limit: -1,
        offset: 0,
        sortable: false,
        sortCallback: null,
        sortKey: null,
        sortAsc: true
    }

    get limit() { return this.props.limit; }
    get total() { return this._total ?? this.dataRows.length; }

    get minOffset() {
        return this._minOffset ?? 0;
    }
    get previousOffset() {
        if (this._previousOffset) return this._previousOffset;
        if (this.limit < 1) return null;

        let previous = this.offset - this.limit;
        return previous >= this.minOffset ? previous : null;
    }

    get offset() { return this.props.offset; }

    get nextOffset() {
        if (this._nextOffset) return this._nextOffset;
        if (this.limit < 1) return null;

        let next = this.offset + this.limit;

        return next <= this.maxOffset ? next : null;
    }
    get maxOffset() {
        if (this._maxOffset) return this._maxOffset;
        if (this.limit < 1) return 0;

        let max = (this.limit * this.pages) - this.limit;

        return max < 0 ? 0 : max;
    }

    get page() { return Math.ceil((this.offset / this.limit) + 1); }
    get pages() {
        return Math.ceil(this.total / this.limit);
    }

    get rows() { return this.children?.filter(c => c instanceof TableRow); }

    /**
     * All rows that contain a head cell
     * @type {TableRow[]}
     */
    get headerRows() { return this.rows?.filter(c => c.children.some(child => child instanceof TableHead)); }
    get headerCells() { return this.headerRows?.map(r => r?.children?.filter(c => c instanceof TableHead)).flat(); }

    /**
     * All rows that contain a data cell
     * @type {TableRow[]}
     */
    get dataRows() { return this.rows?.filter(c => c.children.some(child => child instanceof TableData)); }
    get dataCells() { return this.dataRows?.map(r => r?.children?.filter(c => c instanceof TableData)).flat(); }

    get visibleDataRows() {
        if (
            this.props.limit < 1 ||
            this.props.limit >= this.total
        ) return this.dataRows;

        if (this.offset > this.maxOffset) return [];

        let start = this.props.offset;
        let end = start + this.props.limit;

        return this.dataRows.slice(start, end);
    }

    get hiddenDataRows() {
        if (
            this.props.limit < 1 ||
            this.props.limit >= this.total
        ) return [];

        if (this.offset > this.maxOffset) return this.dataRows;

        let start = this.props.offset;
        let end = start + this.props.limit;

        return [
            ...this.dataRows.slice(0, start),
            ...this.dataRows.slice(end)
        ]
    }

    get sortCallback() {
        let key = this?.props?.sortKey;

        return this?.props?.sortCallback ?? ((rowA, rowB) => {
            if (!key) return 0;

            let rowACell = rowA?.dataCells?.filter(c => c?.props?.sortKey === key)[0] ?? [];
            let rowBCell = rowB?.dataCells?.filter(c => c?.props?.sortKey === key)[0] ?? [];

            let valA = rowACell.props?.sortValue;
            let valB = rowBCell.props?.sortValue;

            if (valA === null && valB === null) return 0;
            if (valA === null) return 1;
            if (valB === null) return -1;

            let comp = 0;
            if (valA < valB) comp = -1;
            if (valA > valB) comp = 1;

            return this.props.sortAsc ? comp : -comp;
        });
    }

    get controllers() { return this._controllers; }

    addController(controller) {
        if (this._controllers.has(controller)) return;

        this._controllers.add(controller);
    }

    removeController(controller) {
        if (!this._controllers.has(controller)) return;

        this._controllers.delete(controller);
    }

    _notifyControllers(details = {}) {
        this.controllers?.forEach(controller => {
            if (typeof controller.receiveUpdateFromTable === "function") controller.receiveUpdateFromTable(details);
        });
    }

    static validateProps(props) {
        return (
            typeof props.alternateShade === "boolean" &&
            typeof props.sortable === "boolean" &&
            (
                props.sortCallback === null ||
                typeof props.sortCallback === "function"
            ) &&
            (
                typeof props.limit === "number" &&
                Number.isInteger(props.limit)
            ) &&
            (
                typeof props.offset === "number" &&
                Number.isInteger(props.offset) &&
                props.offset >= 0
            ) && (
                props.sortKey === null ||
                typeof props.sortKey === "string"
            ) && typeof props.sortAsc === "boolean"
        );
    }

    childrenContainer() { return this.i().querySelector(".table"); }
    classWrapper() { return this.i().querySelector(".table"); }

    onPropsChange(oldProps) {
        if (this.isMounted()) {
            if (oldProps.alternateShade !== this.props.alternateShade) {
                this.classWrapper().removeClass("alternate");
                if (this.props.alternateShade) this.classWrapper().addClass("alternate");
            }
        }

        if (oldProps.sortable !== this.props.sortable) {
            this.headerCells?.forEach(c => c.setProps({ sortable: this.props.sortable && (typeof c.props?.sortKey === "string") }));
        }

        if (
            oldProps.offset !== this.props.offset ||
            oldProps.limit !== this.props.limit
        ) {
            this._update();
        }
    }

    onMount() {
        super.onMount();

        this._update();
    }

    static _rawStylingRules = [
        `.table{--tbl-accent:var(--text);--tbl-shade:var(--text-90);border-collapse:collapse;width:100%;width:stretch}`,
        `.table.kw-{{theme}}{--tbl-accent:var(--{{theme}});--tbl-shade:var(--{{theme}}-90)}`,
        `.table-wrapper{overflow:auto;margin:var(--padding-sm);box-shadow:var(--box-shadow)}`,
        `.table.alternate tr:nth-child(even){background-color:var(--tbl-shade)}`,
        `.table th,.table td{padding:var(--padding-sm);text-align:start}`,
        `.table th{font-weight:var(--font-weight-bold);color:var(--tbl-accent);border-bottom:var(--border-thin-width) solid var(--tbl-accent)}`,
    ];

    static dependencies = [CSSVariables, Typography];

    render() {
        let container = document.createElement("div");
        container.classList.add("table-wrapper");

        let el = document.createElement("table");

        el.classList.add("table", this.themeClass());
        if (this.props.alternateShade) el.classList.add("alternate");

        this.attachChildren(el);
        this.attachListeners(el);

        container.appendChild(el);

        return container;
    }

    _update() {
        let loader = new Loader();
        if (this.isMounted()) loader.mount(this.i(), true);

        try {
            this._updateOrder();
            this._updatePagination();
        } catch (err) {
            console.error(err);
        } finally {
            loader.unmount();
        }
    }

    _updateOrder() {
        let ordered = this._children.slice().sort(this.sortCallback);

        this.setChildren(ordered);

        this._notifyControllers({ type: 'order' });
    }

    _updatePagination() {
        if (!this.isMounted()) return;

        let visible = this.visibleDataRows;
        let hidden = this.hiddenDataRows;

        this._emptyRow.unmount();

        if (visible.length < 1 && hidden.length === this.total) {
            this._emptyRow.mount(this.childrenContainer());
        }

        // Show visible rows
        visible?.forEach(row => {
            row.mount(this.childrenContainer());
        });

        // Hide hidden rows
        hidden?.forEach(row => {
            row.unmount();
        });

        this._dispatchEvent(Event.TABLE_PAGINATION_CHANGE);
        this._notifyControllers({ type: 'pagination' });
    }

    _clearRows() {
        if (this.dataRows) {
            this.dataRows?.forEach(r => this.removeChild(r));
        }
    }
}