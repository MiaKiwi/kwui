import IDProvider from "../helpers/IDProvider.mjs";
import StyleRegister from "../StyleRegister.mjs";



export default class AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        this._id = id || IDProvider.random();
        this._props = {};
        this._children = [];
        this._theme = null;

        this._cleanUpFunctions = [];
        this._isMounted = false;
        this._instance = null;

        this.setProps(props);
        this.setChildren(children);
        this.setTheme(theme);
    }

    /**
     * Converts an HTML string to an HTML element
     * @param {string} stringHTML
     * @returns {HTMLElement}
     */
    static stringToHTML(stringHTML) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(stringHTML, 'text/html');
        return doc.body.firstChild;
    }

    static __cachedStylingRulesMap = new WeakMap();
    static get __cachedStylingRules() {
        if (!this.__cachedStylingRulesMap.get(this)) this.__cachedStylingRulesMap.set(this, new Set());

        return this.__cachedStylingRulesMap.get(this);
    }

    static styleRegister = new StyleRegister();



    static get deepDependencies() {
        let deepDependencies = [...this.dependencies];

        this.dependencies.forEach(dependency => deepDependencies.push(...dependency.deepDependencies));

        deepDependencies = Array.from(new Set(deepDependencies));

        return deepDependencies;
    }

    static get stylingRules() {
        if (this.__cachedStylingRules.length > 0) return this.__cachedStylingRules;

        let rules = this._rawStylingRules;
        let computedRules = [];

        if (rules.some(r => r.includes('{{theme}}'))) {
            for (let rule of rules) {
                if (rule.includes('{{theme}}')) {
                    this._themes.filter(t => t !== null).forEach(theme => computedRules.push(rule.replaceAll('{{theme}}', theme)));
                } else {
                    computedRules.push(rule);
                }
            }
        } else {
            computedRules = rules;
        }

        this.__cachedStylingRulesMap.set(this, computedRules);

        return computedRules;
    };


    get id() { return this._id; }

    get themeClass() { return `kw-${this.theme ? this.theme : 'default'}`; }

    get instance() { return this?._instance; }
    get parent() { return this?._instance?.parentElement; }

    get props() { return this._props; }
    set props(props) { this.setProps(props); }
    setProps(props) {
        let p = { ...this.constructor._defaultProps, ...props };

        if (this.constructor.validateProps(p)) {
            this._props = p;
        } else {
            throw new Error(`${this.constructor.name} (${this.id}): Failed to validate props`);
        }
    }

    get children() { return this._children; }
    set children(children) { this.setChildren(children); }
    setChildren(children) { this._children = children; }
    addChild(child, index = -1) {
        if (index < 0) index = this._children.length;

        this._children = this._children.toSpliced(index, 0, child);
    }
    removeChild(child) {
        this._children = this._children.filter(c => c !== child);
    }

    get theme() { return this._theme; }
    set theme(theme) { this.setTheme(theme); }
    setTheme(theme) {
        if (this.constructor._themes.includes(theme)) {
            this._theme = theme
        } else {
            throw new Error(`${this.constructor.name} (${this.id}): Failed to set theme`);
        }
    }

    attachChildren(element, children = this.children) {
        for (let child of children) {
            if (child instanceof AbstractComponent) {
                child.unmount();
                child.mount(element);
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            } else if (typeof child === "string") {
                element.appendChild(this.constructor.stringToHTML(child));
            }
        }
    }

    i() { return this?.instance; }
    $(selector) { return this?.parent?.querySelector(selector); }
    $$(selector) { return this?.parent?.querySelectorAll(selector); }

    prepare() {
        if (this._instance) return;

        this._instance = this.render();
        this._instance.id = this.id;
        this.bindEvents();
    }

    /**
     * Mounts the component to an element
     * @param {HTMLElement} parent
     */
    mount(parent) {
        if (this._isMounted) return;

        this.prepare();
        parent.appendChild(this.instance);
        this.constructor.styleRegister.register(this.constructor);
        this._isMounted = true;

        this.onMount();
    }

    /**
     * Unmounts the component
     */
    unmount() {
        if (!this._isMounted) return;

        this.onUnmount();

        this._cleanUpFunctions.forEach(fn => fn());
        this._cleanUpFunctions = [];

        this._instance?.remove();
        this._instance = null;
        this.constructor.styleRegister.unregister(this.constructor);
        this._isMounted = false;
    }



    /**
     * Themes the component is available in
     * @type {string[]}
     */
    static _themes = [
        'bg',
        'fg',
        'primary',
        'secondary',
        'accent',
        'negative',
        'warning',
        'info',
        'positive',
        null
    ];

    /**
     * Default properties of the component
     * @type {object}
     */
    static _defaultProps = {};

    /**
     * Validates the given props
     * @param {object} props
     * @returns {boolean}
     */
    static validateProps(props) {
        return true;
    }

    static _rawStylingRules = [];

    static dependencies = [];

    render() { }

    bindEvents() { }

    onMount() { }

    onUnmount() { }
}