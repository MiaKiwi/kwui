import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "../core/CSSVariables.mjs";
import Typography from "../core/Typography.mjs";
import Icon from "../display/icons/Icon.mjs";



export default class Button extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.style
     * @param {string} props.shape
     * @param {number} props.cooldown
     * @param {boolean} props.singleUse
     * @param {boolean} props.toggle
     * @param {object} props.activeChildren
     * @param {string} props.type
     * @param {boolean} props.autofocus
     * @param {string} props.popovertarget
     * @param {string} props.popovertargetaction
     * @param {string} props.name
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

    static types = {
        button: "button",
        reset: "reset",
        submit: "submit"
    }

    static shapes = {
        circular: 'circular',
        square: 'square',
        rounded: 'rounded'
    }

    static _defaultProps = {
        style: this.styles.solid,
        shape: this.shapes.rounded,
        cooldown: 0,
        singleUse: false,
        toggle: false,
        activeChildren: null,
        autofocus: false,
        popovertarget: null,
        popovertargetaction: null,
        name: null,
        type: this.types.button
    }

    static validateProps(props) {
        return (
            Object.values(this.styles).includes(props.style) &&
            Object.values(this.shapes).includes(props.shape) &&
            typeof props.cooldown === 'number' && props.cooldown >= 0 &&
            typeof props.singleUse === 'boolean' &&
            typeof props.toggle === 'boolean' &&
            typeof props.autofocus === 'boolean' &&
            (props.popovertarget === null || typeof props.popovertarget === 'string') &&
            (props.popovertargetaction === null || typeof props.popovertargetaction === 'string') &&
            (props.name === null || typeof props.name === 'string') &&
            (props.type === null || (typeof props.type === 'string' && Object.values(this.types).includes(props.type)))
        )
    }

    static dependencies = [Typography, CSSVariables];

    static _rawStylingRules = [
        `.btn{--btn-pad-v:var(--padding-sm);--btn-pad-h:var(--padding-md);--border-radius:var(--border-roundness);--btn-interact-translateY:0.1em;--btn-bg:var(--primary);--btn-fg:var(--primary-fg);--btn-active-bg:var(--primary-10);--btn-active-fg:var(--primary-90);background-color:var(--btn-bg);color:var(--btn-fg);display:inline-block;padding:var(--btn-pad-v) var(--btn-pad-h);text-decoration:none;border-radius:var(--border-radius);transition:all 0.2s ease-in-out;border:none;cursor:pointer;user-select:none;margin-top:0.1em;margin-bottom:0.1em;margin-left:var(--inline-block-spacing);margin-right:var(--inline-block-spacing);}`,
        `.btn:hover,.btn:focus{transform:translateY(calc(-1 * var(--btn-interact-translateY)));}`,
        `.btn:not(.disabled):not(:disabled):active,.btn.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);transform:translateY(var(--btn-interact-translateY));}`,
        `.btn.kw-{{theme}}{--btn-bg:var(--{{theme}});--btn-fg:var(--{{theme}}-fg);--btn-active-bg:var(--{{theme}}-10);--btn-active-fg:var(--{{theme}}-90);}`,
        `.btn.outline{background-color:transparent;color:var(--btn-bg);border:var(--border-thin-width) solid var(--btn-bg);padding:calc(var(--btn-pad-v) - var(--border-thin-width)) calc(var(--btn-pad-h) - var(--border-thin-width));}`,
        `.btn.outline:not(.disabled):not(:disabled):active,.btn.outline.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);border-color:var(--btn-active-bg);}`,
        `.btn.empty{background-color:transparent;color:var(--btn-bg);}`,
        `.btn.empty:not(.disabled):not(:disabled):active,.btn.empty.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);}`,
        `.btn.disabled,.btn:disabled{opacity:var(--disabled-transparency);cursor:not-allowed;transform:none;pointer-events:none;}`,
        `.btn.icon-only{--btn-pad-v: var(--padding-xs);--btn-pad-h: var(--padding-xs);}`,
        `.btn.circular{--border-radius:9999em;}`,
        `.btn.square{--border-radius:0;}`,
        `.btn.rounded{--border-radius:0.5em;}`,
    ]

    render() {
        let btn = document.createElement("button");

        btn.classList.add("btn", this.props.shape, this.props.style, this.themeClass());

        if (this.props.autofocus) btn.setAttribute("autofocus", this.props.autofocus);
        if (this.props.popovertarget) btn.setAttribute("popovertarget", this.props.popovertarget);
        if (this.props.popovertargetaction) btn.setAttribute("popovertargetaction", this.props.popovertargetaction);
        if (this.props.name) btn.setAttribute("name", this.props.name);
        if (this.props.type) btn.setAttribute("type", this.props.type);

        if (this.children.every(c => c instanceof Icon)) btn.classList.add("icon-only");

        this.attachChildren(btn);
        this.attachListeners(btn);

        return btn;
    }

    onChildAdded(child) {
        super.onChildAdded(child);

        if (this.isMounted()) {
            let i = this.i();
            i.classList.remove("icon-only");
            if (this.children.every(c => c instanceof Icon)) i.classList.add("icon-only");
        }
    }

    onChildRemoved(child) {
        super.onChildRemoved(child);

        if (this.isMounted()) {
            let i = this.i();
            i.classList.remove("icon-only");
            if (this.children.every(c => c instanceof Icon)) i.classList.add("icon-only");
        }
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let btn = this.i();

            if (oldProps.shape !== this.props.shape) {
                btn.classList.remove(oldProps.shape);
                btn.classList.add(this.props.shape);
            }
            if (oldProps.style !== this.props.style) {
                btn.classList.remove(oldProps.style);
                btn.classList.add(this.props.style);
            }

            [
                "autofocus",
                "popovertarget",
                "popovertargetaction",
                "name",
                "type",
            ].forEach(p => {
                if (oldProps[p] !== this.props[p]) {
                    if (this.props[p] !== null) {
                        btn.setAttribute(p, this.props[p]);
                    } else {
                        btn.removeAttribute(p);
                    }
                }
            });
        };
    }

    bindEvents() {
        let btn = this.i();

        let componentCallback = async (e) => {
            if (e.type === 'click' && this.props.singleUse) {
                btn.disabled = true;
            }

            if (e.type === 'click' && this.props.toggle) {
                btn.classList.toggle("active");
            }

            if (this.props.activeChildren) {
                if (e.key === 'Enter' || e.key === ' ' || e.type === 'pointerdown') {
                    btn.innerHTML = null;
                    this.attachChildren(btn, this.props.activeChildren);
                }
                if ((e.key === 'Enter' || e.key === ' ' || e.type === 'pointerup')) {
                    if (this.props.toggle && !btn.classList.contains("active")) {
                        return;
                    }
                    btn.innerHTML = null;
                    this.attachChildren(btn);
                }
            }

            if (e.type === 'click' && this.props.cooldown) {
                btn.disabled = true;
                await new Promise(resolve => setTimeout(resolve, this.props.cooldown));
                if (!this.props.singleUse) btn.disabled = false;
            }
        }

        btn.addEventListener("pointerdown", componentCallback);
        btn.addEventListener("keydown", componentCallback);
        btn.addEventListener("pointerup", componentCallback);
        btn.addEventListener("keyup", componentCallback);
        btn.addEventListener("click", componentCallback);

        this._cleanUpFunctions.push(() => { btn.removeEventListener("pointerdown", componentCallback) })
        this._cleanUpFunctions.push(() => { btn.removeEventListener("keydown", componentCallback) })
        this._cleanUpFunctions.push(() => { btn.removeEventListener("pointerup", componentCallback) })
        this._cleanUpFunctions.push(() => { btn.removeEventListener("keyup", componentCallback) })
        this._cleanUpFunctions.push(() => { btn.removeEventListener("click", componentCallback) })
    }
}