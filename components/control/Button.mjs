import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "../core/CSSVariables.mjs";
import Typography from "../core/Typography.mjs";



export default class Button extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.style
     * @param {number} props.cooldown
     * @param {boolean} props.singleUse
     * @param {boolean} props.toggle
     * @param {object} props.activeChildren
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static styles = {
        solid: 'solid',
        outline: 'outline',
        empty: 'empty'
    }

    static _defaultProps = {
        style: this.styles.solid,
        cooldown: 0,
        singleUse: false,
        toggle: false,
        activeChildren: null
    }

    static validateProps(props) {
        return (
            Object.values(this.styles).includes(props.style) &&
            typeof props.cooldown === 'number' && props.cooldown >= 0 &&
            typeof props.singleUse === 'boolean' &&
            typeof props.toggle === 'boolean'
        )
    }

    static dependencies = [Typography, CSSVariables];

    static _rawStylingRules = [
        `.btn{--btn-pad-v:var(--padding-sm);--btn-pad-h:var(--padding-md);--btn-interact-translateY:0.1em;--btn-bg:var(--primary);--btn-fg:var(--primary-fg);--btn-active-bg:var(--primary-10);--btn-active-fg:var(--primary-90);background-color:var(--btn-bg);color:var(--btn-fg);display:inline-block;padding:var(--btn-pad-v) var(--btn-pad-h);text-decoration:none;border-radius:var(--border-roundness);transition:all 0.2s ease-in-out;border:none;cursor:pointer;user-select:none;margin-top:0.1em;margin-bottom:0.1em;margin-left:var(--inline-block-spacing);margin-right:var(--inline-block-spacing);}`,
        `.btn:hover,.btn:focus{transform:translateY(calc(-1 * var(--btn-interact-translateY)));}`,
        `.btn:not(.disabled):not(:disabled):active,.btn.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);transform:translateY(var(--btn-interact-translateY));}`,
        `.btn.kw-{{theme}}{--btn-bg:var(--{{theme}});--btn-fg:var(--{{theme}}-fg);--btn-active-bg:var(--{{theme}}-10);--btn-active-fg:var(--{{theme}}-90);}`,
        `.btn.outline{background-color:transparent;color:var(--btn-bg);border:var(--border-thin-width) solid var(--btn-bg);padding:calc(var(--btn-pad-v) - var(--border-thin-width)) calc(var(--btn-pad-h) - var(--border-thin-width));}`,
        `.btn.outline:not(.disabled):not(:disabled):active,.btn.outline.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);border-color:var(--btn-active-bg);}`,
        `.btn.empty{background-color:transparent;color:var(--btn-bg);}`,
        `.btn.empty:not(.disabled):not(:disabled):active,.btn.empty.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);}`,
        `.btn.disabled,.btn:disabled{opacity:var(--disabled-transparency);cursor:not-allowed;transform:none;pointer-events:none;}`
    ]

    render() {
        let btn = document.createElement("button");

        btn.classList.add("btn", this.props.style, this.themeClass);

        if (this.props.singleUse) btn.classList.add("single-use");

        this.attachChildren(btn);

        return btn;
    }



    bindEvents() {
        let btn = this.i();

        if (this.props.cooldown) {
            let cooldownCallback = async () => {
                btn.disabled = true;
                await new Promise(resolve => setTimeout(resolve, this.props.cooldown));
                if (!this.props.singleUse) btn.disabled = false;
            }
            btn.addEventListener("click", cooldownCallback);

            this._cleanUpFunctions.push(() => { btn.removeEventListener("click", cooldownCallback) });
        }

        if (this.props.singleUse) {
            let singleUseCallback = async () => {
                btn.disabled = true;
            }
            btn.addEventListener("click", singleUseCallback);

            this._cleanUpFunctions.push(() => { btn.removeEventListener("click", singleUseCallback) });
        }

        if (this.props.toggle) {
            let toggleCallback = async () => {
                btn.classList.toggle("active");
            }
            btn.addEventListener("click", toggleCallback);

            this._cleanUpFunctions.push(() => { btn.removeEventListener("click", toggleCallback) });
        }

        if (this.props.activeChildren) {
            let showActiveChildrenCallback = async (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.type === 'pointerdown') {
                    btn.innerHTML = null;
                    this.attachChildren(btn, this.props.activeChildren);
                }
            }
            btn.addEventListener("pointerdown", showActiveChildrenCallback);
            btn.addEventListener("keydown", showActiveChildrenCallback);

            let hideActiveChildrenCallback = async (e) => {
                if ((e.key === 'Enter' || e.key === ' ' || e.type === 'pointerup')) {
                    if (this.props.toggle && !btn.classList.contains("active")) {
                        return;
                    }
                    btn.innerHTML = null;
                    this.attachChildren(btn);
                }
            }
            btn.addEventListener("pointerup", hideActiveChildrenCallback);
            btn.addEventListener("keyup", hideActiveChildrenCallback);

            this._cleanUpFunctions.push(() => { btn.removeEventListener("pointerdown", showActiveChildrenCallback) });
            this._cleanUpFunctions.push(() => { btn.removeEventListener("keydown", showActiveChildrenCallback) });
            this._cleanUpFunctions.push(() => { btn.removeEventListener("pointerup", hideActiveChildrenCallback) });
            this._cleanUpFunctions.push(() => { btn.removeEventListener("keyup", hideActiveChildrenCallback) });
        }
    }
}