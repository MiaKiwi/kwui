import Text from "./Text.mjs";



export default class Heading extends Text {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {number} props.level
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

    static _defaultProps = {
        ...super._defaultProps,
        level: 1
    }

    static validateProps(props) {
        return (
            super.validateProps(props) &&
            props.level > 0 && props.level < 7
        )
    }

    get _elementTagName() { return `h${String(this.props.level)}`; }
}