import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";



export default class CardGroup extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = []) {
        super(props, children, theme, id, classes);
    }

    static layouts = {
        grid: 'grid',
        flow: 'flex'
    }

    static orientations = {
        vertical: 'vertical',
        horizontal: 'horizontal'
    }

    static alignContent = {
        stretch: "stretch",
        center: "center",
        start: "flex-start",
        end: "flex-end",
        space_between: "space-between",
        space_around: "space-around",
        space_evenly: "space-evenly"
    }

    static justifyContent = {
        center: "center",
        start: "flex-start",
        end: "flex-end",
        space_between: "space-between",
        space_around: "space-around",
        space_evenly: "space-evenly"
    }

    static alignItems = {
        stretch: "stretch",
        fstart: "flex-start",
        fend: "flex-end",
        start: "start",
        end: "end",
        baseline: "baseline"
    }

    static justifyItems = {
        stretch: "stretch",
        start: "start",
        left: "left",
        center: "center",
        end: "end",
        right: "right",
        baseline: "baseline"
    }

    static _defaultProps = {
        layout: this.layouts.flow,
        orientation: this.orientations.horizontal,
        wrap: true,
        alignContent: this.alignContent.center,
        justifyContent: this.justifyContent.center,
        alignItems: this.alignItems.baseline,
        justifyItems: this.justifyItems.center,
    }

    static validateProps(props) {
        return (
            Object.values(this.layouts).includes(props.layout) &&
            Object.values(this.orientations).includes(props.orientation) &&
            Object.values(this.alignContent).includes(props.alignContent) &&
            Object.values(this.justifyContent).includes(props.justifyContent) &&
            Object.values(this.alignItems).includes(props.alignItems) &&
            Object.values(this.justifyItems).includes(props.justifyItems) &&
            typeof props.wrap === 'boolean'
        )
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.card-group{display:flex;gap:var(--inline-block-spacing)}`,
        `.card-group.grid{display:grid}`,
        `.card-group.grid.vertical{grid-auto-flow: row}`,
        `.card-group.flex.vertical{flex-direction: column}`,
        `.card-group.grid.horizontal{grid-auto-flow: column}`,
        `.card-group.flex.horizontal{flex-direction: row}`,
        `.card-group.grid.vertical.wrap{grid-template-columns:repeat(auto-fit,minmax(200px, 1fr))}`,
        `.card-group.grid.horizontal.wrap{grid-template-rows:repeat(auto-fit, minmax(200px, 1fr))}`,
        `.card-group.flex.wrap{flex-wrap:wrap}`,
    ]

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (this.props.alignContent) i.style.alignContent = this.props.alignContent;
            if (this.props.justifyContent) i.style.justifyContent = this.props.justifyContent;
            if (this.props.alignItems) i.style.alignItems = this.props.alignItems;
            if (this.props.justifyItems) i.style.justifyItems = this.props.justifyItems;

            this.props.wrap ? i.classList.add("wrap") : i.classList.remove("wrap");
            
            if (oldProps.layout !== this.props.layout) {
                i.classList.remove(oldProps.layout);
                i.classList.add(this.props.layout);
            }
            if (oldProps.orientation !== this.props.orientation) {
                i.classList.remove(oldProps.orientation);
                i.classList.add(this.props.orientation);
            }
        };
    }

    render() {
        let el = document.createElement("div");

        el.classList.add("card-group", this.props.layout, this.props.orientation, this.themeClass());

        if (this.props.wrap) el.classList.add("wrap");
        if (this.props.alignContent) el.style.alignContent = this.props.alignContent;
        if (this.props.justifyContent) el.style.justifyContent = this.props.justifyContent;
        if (this.props.alignItems) el.style.alignItems = this.props.alignItems;
        if (this.props.justifyItems) el.style.justifyItems = this.props.justifyItems;

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }
}