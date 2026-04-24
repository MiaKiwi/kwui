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
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);
    }

    static sizes = {
        huge: 'huge',
        xxxl: 'xxxl',
        xxl: 'xxl',
        xl: 'xl',
        l: 'l',
        md: 'md',
        s: 's'
    }

    static textThemeClass(theme) { if (!Object.values(this._themes).includes(theme)) { console.warn(`${this.constructor.name} (${this.id}): Text theme variant '${theme}' is not recognized`) }; return `text-${theme}`; }
    static sizeClass(size) { if (!Object.values(this.sizes).includes(size)) { console.warn(`${this.constructor.name} (${this.id}): Text size variant '${size}' is not recognized`) }; return `text-${size}`; }
    static fontClass(font) { if (!Object.values(this.fonts).includes(font)) { console.warn(`${this.constructor.name} (${this.id}): Text font variant '${font}' is not recognized`) }; return `text-${font}`; }
    static alignmentClass(alignment) { if (!Object.values(this.alignments).includes(alignment)) { console.warn(`${this.constructor.name} (${this.id}): Text alignment variant '${alignment}' is not recognized`) }; return `text-${alignment}`; }
    static mutedClass() { return `text-muted`; }
    static italicClass() { return `text-italic`; }
    static strongClass() { return `text-strong`; }

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

        if (Object.values(this.constructor._themes).includes(this.theme) && this.theme) text.classList.add(this.constructor.textThemeClass(this.theme));
        if (this.props.size) text.classList.add(this.constructor.sizeClass(this.props.size));
        if (this.props.font) text.classList.add(this.constructor.fontClass(this.props.font));
        if (this.props.align) text.classList.add(this.constructor.alignmentClass(this.props.align));
        if (this.props.muted) text.classList.add(this.constructor.mutedClass());
        if (this.props.italic) text.classList.add(this.constructor.italicClass());
        if (this.props.bold) text.classList.add(this.constructor.strongClass());

        this.attachChildren(text);
        this.attachListeners(text);

        return text;
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let el = this.i();


            if (oldProps.size !== this.props.size) {
                el.classList.remove(this.constructor.sizeClass(oldProps.size));

                if (this.props.size) el.classList.add(this.constructor.sizeClass(this.props.size));
            }
            if (oldProps.font !== this.props.font) {
                el.classList.remove(this.constructor.fontClass(oldProps.font));

                if (this.props.font) el.classList.add(this.constructor.fontClass(this.props.font));
            }
            if (oldProps.align !== this.props.align) {
                el.classList.remove(this.constructor.alignmentClass(oldProps.align));

                if (this.props.align) el.classList.add(this.constructor.alignmentClass(this.props.align));
            }
            if (oldProps.muted !== this.props.muted) {
                el.classList.remove(this.constructor.mutedClass());

                if (this.props.muted) el.classList.add(this.constructor.mutedClass());
            }
            if (oldProps.italic !== this.props.italic) {
                el.classList.remove(this.constructor.italicClass());

                if (this.props.italic) el.classList.add(this.constructor.italicClass());
            }
            if (oldProps.bold !== this.props.bold) {
                el.classList.remove(this.constructor.strongClass());

                if (this.props.bold) el.classList.add(this.constructor.strongClass());
            }
        }
    }

    onThemeChange(oldTheme) {
        super.onThemeChange(oldTheme);

        if (this.isMounted() && oldTheme !== this.theme) {
            let i = this.i();

            i.classList.remove(this.constructor.textThemeClass(oldTheme));

            if (Object.values(this.constructor._themes).includes(this.theme)) i.classList.add(this.constructor.textThemeClass(this.theme));
        }
    }
}