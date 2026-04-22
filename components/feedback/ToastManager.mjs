import StyleRegister from "../../StyleRegister.mjs";
import AbstractComponent from "../AbstractComponent.mjs";
import Button from "../control/Button.mjs";
import CSSVariables from "../core/CSSVariables.mjs";
import Avatar from "../display/avatar/Avatar.mjs";
import FontawesomeIcon from "../display/icons/FontawesomeIcon.mjs";
import Toast from "./Toast.mjs";



export default class ToastManager extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.location
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);
    }

    static locations = {
        top_left: 'top-left',
        top_center: 'top-center',
        top_right: 'top-right',
        bottom_left: 'bottom-left',
        bottom_center: 'bottom-center',
        bottom_right: 'bottom-right',
    }

    static _defaultProps = {
        location: this.locations.top_center
    }

    static validateProps(props) {
        return Object.values(this.locations).includes(props.location);
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.location !== this.props.location) {
                i.classList.remove(...oldProps.location?.split("-"));
                i.classList.add(...this.props.location?.split("-"));

                this._updateToasts();
            }
        };
    }

    static _rawStylingRules = [
        `.toast-manager{position:fixed;width:max-content;z-index:9999;display:flex;flex-wrap:wrap;padding:var(--inline-block-spacing);--toast-manager-translate-x:0;--toast-manager-translate-y:0;transform:translateX(var(--toast-manager-translate-x)) translateY(var(--toast-manager-translate-y));transition: transform var(--transition-medium) ease-in-out;}`,
        `.toast-manager.top{bottom:100%;justify-content:flex-start;flex-direction:column-reverse}`,
        `.toast-manager.bottom{top:100%;justify-content:flex-end;flex-direction:column}`,
        `.toast-manager.left{left:0;align-content:flex-start;}`,
        `.toast-manager.center{left:50%;--toast-manager-translate-x:-50%;align-content:center;}`,
        `.toast-manager.right{right:0;align-content:flex-end;}`,
    ];

    static dependencies = [CSSVariables];

    get toasts() { return this.children.filter(c => c instanceof Toast); }

    render() {
        let el = document.createElement("div");

        el.classList.add("toast-manager", this.themeClass(), ...this.props.location?.split("-"));

        this.attachChildren(el);
        this.attachListeners(el);

        return el;
    }

    onChildAdded(child) {
        super.onChildAdded(child);

        this._updateToasts();
    }

    onChildRemoved(child) {
        this._updateToasts();

        super.onChildRemoved(child);
    }

    onCreation() {
        this.addListener("toast-dismiss", (e) => {
            if (e?.detail?.toast) this.removeChild(e.detail.toast);
        });
    }

    onMount() {
        super.onMount();

        this._updateToasts();
    }

    onUnmount() {
        this.toasts?.forEach(t => { t.pauseTimer(); t._lock(); });

        super.onUnmount();
    }

    new(toast) {
        if (!toast) return;

        if (!toast instanceof Toast) console.warn(`${this.constructor.name} (${this.id}): Children should be of type Toast`);

        this.addChild(toast);
    }

    info(children = [], duration = 5000, dismissable = true) {
        let toast = new Toast({
            type: Toast.types.info,
            duration: duration,
            dismissable: dismissable
        }, children);

        this.new(toast);
    }

    success(children = [], duration = 5000, dismissable = true) {
        let toast = new Toast({
            type: Toast.types.success,
            duration: duration,
            dismissable: dismissable
        }, children);

        this.new(toast);
    }

    warning(children = [], duration = 5000, dismissable = true) {
        let toast = new Toast({
            type: Toast.types.warning,
            duration: duration,
            dismissable: dismissable
        }, children);

        this.new(toast);
    }

    danger(children = [], duration = 5000, dismissable = true) {
        let toast = new Toast({
            type: Toast.types.danger,
            duration: duration,
            dismissable: dismissable
        }, children);

        this.new(toast);
    }

    _adjustRenderOffset() {
        if (!this.isMounted() || this.toasts.length <= 0) return;

        let toasts = this.toasts;
        let head = toasts[0];
        let headHeight = head.i()?.getBoundingClientRect()?.height ?? 0;
        if (toasts.length > 1) headHeight *= 1.25;

        let operator = "+";
        if (this.i()?.classList?.contains("bottom")) { headHeight *= -1; operator = "-" }

        let style = `calc(${headHeight}px ${operator} var(--padding-sm)*2)`;
        this.i().style.setProperty("--toast-manager-translate-y", style);
    }

    _updateToasts() {
        let toasts = this.toasts;

        if (toasts.length > 0) {
            let head = toasts[0];
            head._unlock();
            head.resumeTimer();

            this._adjustRenderOffset();

            toasts?.slice(1)?.forEach(t => { t.pauseTimer(); t._lock(); });
        } else {
            if (!this.isMounted()) return;
            this.i().style.setProperty("--toast-manager-translate-y", 0);
        }
    }
}