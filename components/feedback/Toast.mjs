import StyleRegister from "../../StyleRegister.mjs";
import AbstractComponent from "../AbstractComponent.mjs";
import Button from "../control/Button.mjs";
import Animations from "../core/Animations.mjs";
import CSSVariables from "../core/CSSVariables.mjs";
import Avatar from "../display/avatar/Avatar.mjs";
import FontawesomeIcon from "../display/icons/FontawesomeIcon.mjs";



export default class Toast extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.type
     * @param {boolean} props.dismissable
     * @param {number} props.duration
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = []) {
        super(props, children, theme, id, classes);

        this._icon = new FontawesomeIcon(
            this.constructor._typeIconMap[this.props.type],
            [],
            this.theme ?? this.props.type
        );
        this._avatar = new Avatar({}, [this._icon], this.theme ?? this.props.type, null, ["toast-icon"]);

        this._dismissBtn = new Button({
            style: Button.styles.empty,
            shape: Button.shapes.circular
        }, [
            new FontawesomeIcon({
                name: "xmark",
                family: FontawesomeIcon.fa_families.classic,
                style: FontawesomeIcon.fa_styles.solid
            }, [], StyleRegister.themes.negative)
        ], StyleRegister.themes.negative, null, ["toast-dismiss"]);
        this._dismissBtn.addListener("click", () => this.dismiss());

        this.setTheme(this.theme ?? this.props.type);

        this._timerPaused = false;
        this._timerID = null;
        this._remainingTime = 0;
        this._startTime = 0;
        this._locked = false;
    }

    static _typeIconMap = {
        info: {
            name: "info",
            style: "solid"
        },
        positive: {
            name: "check",
            style: "solid"
        },
        warning: {
            name: "exclamation",
            style: "solid"
        },
        negative: {
            name: "xmark",
            style: "solid"
        }
    }

    static types = {
        info: "info",
        success: "positive",
        warning: "warning",
        danger: "negative"
    }

    static _defaultProps = {
        type: this.types.info,
        dismissable: true,
        duration: -1
    }

    static validateProps(props) {
        return Object.values(this.types).includes(props.type) &&
            typeof props.dismissable === "boolean" && (
                typeof props.duration === "number" && (
                    props.duration === -1 ||
                    props.duration > 0
                )
            )
    }

    childrenContainer() { return this.i().querySelector(".toast-content"); }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.type !== this.props.type) {
                this.setTheme(this.props.type);
                this._icon.setProps({ ...this.constructor._typeIconMap[this.props.type] });
                this._icon.setTheme(this.theme);
                this._avatar.setTheme(this.theme);
            }
            if (oldProps.duration !== this.props.duration) {
                this.resetTimer();
            }
            if (oldProps.dismissable !== this.props.dismissable) {
                if (!this.props.dismissable) {
                    this._dismissBtn.unmount();
                } else {
                    this._dismissBtn.mount(i);
                }
            }
        };
    }

    onThemeChange(oldTheme) {
        super.onThemeChange(oldTheme);

        this._avatar?.setTheme(this.theme);
        this._icon?.setTheme(this.theme);
        this._dismissBtn?.setTheme(this.theme);
    }

    onMount() {
        super.onMount();

        this.resetTimer();
    }

    onUnmount() {
        this._clearTimer();

        super.onUnmount();
    }

    onCreation() {
        super.onCreation();

        this.addListener("mouseenter", () => { this.pauseTimer(); });
        this.addListener("focusin", () => { this.pauseTimer(); });
        this.addListener("mouseleave", () => { this.resumeTimer(); });
        this.addListener("focusout", () => { this.resumeTimer(); });
    }

    static _rawStylingRules = [
        `.toast{--toast-accent:var(--primary);background-color:var(--bg);position:relative;width:70ch;max-width:calc(100vw*.9);border:var(--border-thin-width) solid var(--border);border-radius:var(--border-roundness);margin:var(--padding-sm) 0;padding:var(--padding-sm) var(--padding-sm);box-shadow:var(--box-shadow);gap:var(--letter-spacing);display:grid;grid-template-areas:"icon content dismiss";grid-template-columns:auto 1fr auto;align-items:baseline}`,
        `.toast.kw-{{theme}}{--toast-accent:var(--{{theme}})}`,
        `.toast:before{content:'';position:absolute;bottom:0;left:calc(var(--border-thin-width)*0.75);width:calc(attr(data-progress %, 100%) - var(--border-thin-width));max-width:100%;min-width:0%;height:var(--border-thin-width);border-bottom-left-radius:99em;border-bottom-right-radius:99em;z-index:0;background-color:var(--toast-accent);transition:width var(--transition-fast) linear}`,
    ];

    static dependencies = [CSSVariables, Animations];

    render() {
        let el = document.createElement("div");

        el.classList.add("toast", this.themeClass());

        if (this.props.duration !== -1) {
            el.classList.add("ephemeral");
            el.dataset.progress = 100;
        }

        this._avatar.mount(el);

        let content = document.createElement("div");
        content.classList.add("toast-content");
        el.appendChild(content);

        if (this.props.dismissable) {
            this._dismissBtn.mount(el);
        }

        this.attachChildren(content);
        this.attachListeners(el);

        return el;
    }

    async dismiss() {
        if (!this.isMounted()) return;

        let i = this.i();

        this._clearTimer();

        i.classList.add("anim-fade-out", "anim-slow");
        let limit = 100;
        while (window.getComputedStyle(i).getPropertyValue("opacity") > 0 && --limit > 0) {
            await new Promise(r => setTimeout(r, 100));
        }

        let event = new CustomEvent('toast-dismiss', {
            detail: {
                target: i,
                toast: this
            },
            bubbles: true,
            cancelable: true
        });
        i.dispatchEvent(event);

        this.unmount();
    }

    pauseTimer() { if (!this._locked) {this._timerPaused = true;} }

    resumeTimer() { if (!this._locked) {this._timerPaused = false;} }

    _clearTimer() {
        if (this._timerID) {
            clearInterval(this._timerID);
            this._timerID = null;
        }
    }

    resetTimer() {
        this._clearTimer();

        if (this.props.duration === -1) {
            if (this.isMounted()) {
                let i = this.i();

                i?.classList?.remove("ephemeral");
                i.dataset.progress = 100;
            }
        } else {
            if (this.isMounted()) {
                let i = this.i();

                i?.classList?.add("ephemeral");
            }
            this._remainingTime = this.props.duration;
            this._startTimer();
        }
    }

    _startTimer() {
        this._timerID = setInterval(() => {
            if (!this.isMounted()) {
                this._clearTimer();
                return;
            }

            if (!this._timerPaused) this._remainingTime -= 100;

            let percentage = Math.max(0, (this._remainingTime / this.props.duration) * 100);
            this.i().dataset.progress = percentage;

            if (this._remainingTime <= 0) {
                this._clearTimer();
                this.dismiss();
            }
        }, 100);

        this._cleanUpFunctions.push(() => { if (this._timerID) { clearInterval(this._timerID); } });
    }

    _lock() { this._locked = true; }
    _unlock() { this._locked = false; }
}