import Event from "../../../helpers/Event.mjs";
import Loader from "../../feedback/Loader.mjs";
import Table from "./Table.mjs";
import TableData from "./TableData.mjs";
import TableRow from "./TableRow.mjs";



export default class DynamicTable extends Table {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {boolean} props.alternateShade
     * @param {number} props.limit
     * @param {number} props.offset
     * @param {boolean} props.sortable
     * @param {null|Function} props.sortCallback
     * @param {object[]|Function|Promise<object[]>} props.data
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

        this._cachedPageData = null;
        this._isLoading = false;
        this._oldLimit = null;
        this._oldOffset = null;

        this._handleDataInit();
    }

    get isLoading() { return this._isLoading; }
    get columns() { return this.headerRows?.[0]?.headerCells || []; }
    get data() { return this._cachedPageData ?? this.props.data; }

    get visibleDataRows() { return typeof this.props.data === "function" ? this.dataRows : super.visibleDataRows; }

    get hiddenDataRows() { return typeof this.props.data === "function" ? [] : super.hiddenDataRows; }

    static _defaultProps = {
        ...super._defaultProps,
        data: null
    }

    static validateProps(props) {
        return (
            super.validateProps(props) &&
            (
                this.isStaticData(props.data) ||
                this.isPromise(props.data) ||
                typeof props.data === "function"
            )
        );
    }

    static isPromise(data) {
        return typeof data?.then === "function";
    }
    isPromise(data) { return this.constructor.isPromise(data); }

    static isStaticData(data) {
        return Array.isArray(data) && data.every(entry => typeof entry === "object");
    }
    isStaticData(data) { return this.constructor.isStaticData(data); }

    onPropsChange(oldProps) {
        super.onPropsChange(oldProps);

        this._oldLimit = oldProps.limit;
        this._oldOffset = oldProps.offset;

        if (oldProps.data !== this.props.data && this.isPromise(this.props.data)) {
            this._loadFromPromise(this.props.data);
        }

        if (
            typeof this.props.data === "function" && (
                oldProps.offset !== this.props.offset ||
                oldProps.limit !== this.props.limit
            ) && oldProps.offset !== undefined && oldProps.limit !== undefined
        ) {
            this._loadFromFunction(this.props.data);
        }
    }

    _handleDataInit() {
        let data = this.props.data;

        if (this.isStaticData(data)) {
            this._processStaticData(data);
        } else if (this.isPromise(data)) {
            this._loadFromPromise(data);
        } else if (typeof data === "function") {
            this._loadFromFunction(data);
        } else {
            this._clearRows();
        }
    }

    _processStaticData(data) {
        this._setLoading(false);
        this._cachedPageData = data;
        this._renderRows();
    }

    async _loadFromPromise(promise) {
        this._setLoading(true);

        try {
            this._cachedPageData = null;

            let data = await promise;

            this.setProps({ data: data });
            this._renderRows();
        } catch (err) {
            console.error(err);
        } finally {
            this._setLoading(false);
        }
    }

    async _loadFromFunction(fn) {
        if (this._oldLimit === this.limit && this._oldOffset === this.offset) return;

        this._oldLimit = this.limit;
        this._oldOffset = this.offset;

        this._setLoading(true);

        try {
            this._cachedPageData = null;

            let data = await fn(this);

            this._cachedPageData = data;
            this._renderRows();
        } catch (err) {
            console.error(err);
        } finally {
            this._setLoading(false);
        }
    }

    _setLoading(isLoading) {
        if (this._isLoading === isLoading) return;

        this._isLoading = isLoading;

        let loader = this.children.find(c => c instanceof Loader);
        if (isLoading && !loader) {
            this.addChild(new Loader());
        } else if (!isLoading && loader) {
            this.removeChild(loader);
        }
    }

    _renderRows() {
        this._clearRows();

        if (!this.data || !this.isStaticData(this.data)) return;

        let rows = this.data.map(entry => {
            let cells = this.columns?.map(col => {
                let sortKey = col.props?.sortKey;
                let sortValue = entry[sortKey] ?? null;
                let content = Array.isArray(sortValue) ? sortValue : [sortValue];

                return new TableData({
                    data: entry,
                    sortKey,
                    sortValue,
                    renderer: col.props?.renderer
                }, content);
            });

            return new TableRow({}, cells);
        });

        rows.forEach(row => this.addChild(row));
        this._updatePagination();
    }
}