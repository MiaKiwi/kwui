import AbstractComponent from "../../AbstractComponent.mjs";



export default class Text extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.size
     * @param {string} props.font
     * @param {string} props.align
     * @param {boolean} props.muted
     * @param {boolean} props.italic
     * @param {boolean} props.bold
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static sizes = {
        huge: 'huge',
        xxxl: 'xxxl',
        xxl: 'xxl',
        xl: 'xl',
        l: 'l',
        normal: 'size-normal',
        s: 's'
    }

    static fonts = {
        sans: 'sans',
        serif: 'serif',
        mono: 'mono'
    }

    static alignments = {
        left: 'left',
        center: 'center',
        right: 'right',
        justify: 'justify'
    }

    static _defaultProps = {
        size: null,
        font: null,
        align: null,
        muted: false,
        italic: false,
        bold: false,
    }

    static validateProps(props) {
        return (
            props.size === null || Object.values(this.sizes).includes(props.size) &&
            props.font === null || Object.values(this.fonts).includes(props.font) &&
            props.align === null || Object.values(this.alignments).includes(props.align) &&
            typeof props.muted === "boolean" &&
            typeof props.italic === "boolean" &&
            typeof props.bold === "boolean"
        )
    }

    get _elementTagName() { return "span"; }

    render() {
        let text = document.createElement(this._elementTagName ?? "span");

        if (this.theme) text.classList.add(`text-${this.theme}`);
        if (this.props.size) text.classList.add(`text-${this.props.size}`);
        if (this.props.font) text.classList.add(`text-${this.props.font}`);
        if (this.props.align) text.classList.add(`text-${this.props.align}`);
        if (this.props.muted) text.classList.add(`text-muted`);
        if (this.props.italic) text.classList.add(`text-italic`);
        if (this.props.bold) text.classList.add(`text-strong`);

        this.attachChildren(text);
        this.attachListeners(text);

        return text;
    }
}