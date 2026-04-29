import Event from "../../../helpers/Event.mjs";
import Button from "../../control/Button.mjs";
import ButtonGroup from "../../control/ButtonGroup.mjs";
import Text from "../../core/typo/Text.mjs";
import FontawesomeIcon from "../icons/FontawesomeIcon.mjs";
import Table from "./Table.mjs";



export default class TablePagination extends ButtonGroup {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.orientation
     * @param {boolean} props.unique
     * @param {boolean} props.joined
     * @param {Table} props.table
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this.theme = theme ?? this.props.table.theme;

        this._firstPageBtn = this._createFirstPageBtn();
        this._previousPageBtn = this._createPreviousPageBtn();
        this._nextPageBtn = this._createNextPageBtn();
        this._lastPageBtn = this._createLastPageBtn();
        this._pageIndicator = this._createPageIndicator();

        this.props.table.addController(this);
    }

    static _defaultProps = {
        ...super._defaultProps,
        table: null
    }

    static validateProps(props) {
        return (
            super.validateProps(props) &&
            props.table instanceof Table
        );
    }

    onPropsChange(oldProps) {
        super.onPropsChange(oldProps);

        if (oldProps.table !== this.props.table) {
            oldProps.table?.removeController(this);
            this.props.table?.addController(this);
        }
    }

    _updateControllers() {
        let table = this.props.table;

        if (table.previousOffset === null) {
            this._previousPageBtn.addAttribute("disabled", "");
        } else {
            this._previousPageBtn.removeAttribute("disabled");
        }

        if (table.nextOffset === null) {
            this._nextPageBtn.addAttribute("disabled", "");
        } else {
            this._nextPageBtn.removeAttribute("disabled");
        }

        if (table.offset === table.minOffset) {
            this._firstPageBtn.addAttribute("disabled", "");
        } else {
            this._firstPageBtn.removeAttribute("disabled");
        }

        if (table.offset === table.maxOffset) {
            this._lastPageBtn.addAttribute("disabled", "");
        } else {
            this._lastPageBtn.removeAttribute("disabled");
        }

        this._pageIndicator.setChildren([
            String(table.page || "X"),
        ]);
    }

    _createPageIndicator() {
        let table = this.props.table;

        return new Text({}, [
            String(table.page || "X"),
        ]);
    }

    _createFirstPageBtn() {
        let btn = new Button({
            style: Button.styles.empty,
            shape: Button.shapes.circular
        }, [
            new FontawesomeIcon({
                name: 'angles-left'
            })
        ], this.theme);

        btn.addListener('click', () => {
            let table = this.props.table;

            if (table.minOffset !== null) table.setProps({ offset: table.minOffset });

            this._updateControllers();
        });

        return btn;
    }

    _createPreviousPageBtn() {
        let btn = new Button({
            style: Button.styles.empty,
            shape: Button.shapes.circular
        }, [
            new FontawesomeIcon({
                name: 'angle-left'
            })
        ], this.theme);

        btn.addListener('click', () => {
            let table = this.props.table;

            if (table.previousOffset !== null) table.setProps({ offset: table.previousOffset });

            this._updateControllers();
        });

        return btn;
    }

    _createNextPageBtn() {
        let btn = new Button({
            style: Button.styles.empty,
            shape: Button.shapes.circular
        }, [
            new FontawesomeIcon({
                name: 'angle-right'
            })
        ], this.theme);

        btn.addListener('click', () => {
            let table = this.props.table;

            if (table.nextOffset !== null) table.setProps({ offset: table.nextOffset });

            this._updateControllers();
        });

        return btn;
    }

    _createLastPageBtn() {
        let btn = new Button({
            style: Button.styles.empty,
            shape: Button.shapes.circular
        }, [
            new FontawesomeIcon({
                name: 'angles-right'
            })
        ], this.theme);

        btn.addListener('click', () => {
            let table = this.props.table;

            if (table.maxOffset !== null) table.setProps({ offset: table.maxOffset });

            this._updateControllers();
        });

        return btn;
    }

    receiveUpdateFromTable(details = {}) {
        this._updateControllers();
    }

    render() {
        this.setChildren([
            this._firstPageBtn,
            this._previousPageBtn,
            this._pageIndicator,
            this._nextPageBtn,
            this._lastPageBtn
        ]);
        this._updateControllers();

        let group = super.render();

        return group;
    }
}