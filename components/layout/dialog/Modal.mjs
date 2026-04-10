import StyleRegister from "../../../StyleRegister.mjs";
import Button from "../../control/Button.mjs";
import FontawesomeIcon from "../../display/icons/FontawesomeIcon.mjs";
import Dialog from "./Dialog.mjs";



export default class Modal extends Dialog {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.shape
     * @param {boolean} props.opened
     * @param {boolean} props.closeBtn
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);

        this._closeBtn = new Button({
            style: Button.styles.empty,
            shape: Button.shapes.circular,
            command: "close",
            commandFor: id
        }, [
            new FontawesomeIcon({
                size: FontawesomeIcon.fa_sizes.xl,
                name: "xmark",
                family: FontawesomeIcon.fa_families.classic,
                style: FontawesomeIcon.fa_styles.solid
            })
        ], StyleRegister.themes.negative);
        this._closeBtn.addListener("click", () => {
            this.close();
        })
    }

    static _defaultProps = {
        ...super._defaultProps,
        closeBtn: true,
    }

    static validateProps(props) {
        return super.validateProps(props) && typeof props.closeBtn === "boolean";
    }

    static _rawStylingRules = [
        ...super._rawStylingRules,
        `.dialog.modal>.close-btn{float:right}`
    ];

    onPropsChange(oldProps) {
        super.onPropsChange(oldProps);

        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.closeBtn !== this.props.closeBtn && this.props.closeBtn) { this._closeBtn.mount(i, true); this._closeBtn.i()?.classList.add("close-btn") } else { this._closeBtn.unmount() }
        };
    }

    render() {
        let el = super.render();

        el.classList.add("modal");
        el.setAttribute("closedby", "none");

        if (this.props.closeBtn) {
            this._closeBtn.mount(el, true);
            this._closeBtn.i()?.classList.add("close-btn");
        }

        return el;
    }
}