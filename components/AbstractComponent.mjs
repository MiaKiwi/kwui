import IDProvider from "../helpers/IDProvider.mjs";
import StyleRegister from "../StyleRegister.mjs";



export default class AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        this._id = id || IDProvider.random();
        this._props = {};
        this._children = [];
        this._theme = null;
        this._classes = [];
        this._attributes = {};

        this._cleanUpFunctions = [];
        this._listeners = {};
        this._isMounted = false;
        this._instance = null;

        this.setProps(props);
        this.setChildren(children);
        this.setTheme(theme);
        this.setClasses(classes);

        this.constructor.__registerComponent(this);

        this.onCreation();
        this._dispathEvent("init");
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

    /**
     * Checks if an input can be converted to an HTML element
     * 
     * Ignores text nodes
     * 
     * @param {string|HTMLElement|AbstractComponent} element 
     * @returns {boolean}
     */
    static isHTMLCompatible(element) {
        return (
            element instanceof HTMLElement ||
            element instanceof AbstractComponent ||
            (typeof element === "string" && element.startsWith("<") && element.endsWith(">"))
        );
    }

    static __cachedStylingRulesMap = new WeakMap();
    static get __cachedStylingRules() {
        if (!this.__cachedStylingRulesMap.get(this)) this.__cachedStylingRulesMap.set(this, new Set());

        return this.__cachedStylingRulesMap.get(this);
    }

    static styleRegister = new StyleRegister();

    static __componentsRegistry = new Set();
    static __registerComponent(component) {
        if (!this.__componentsRegistry.has(component)) this.__componentsRegistry.add(component);
    }

    static getComponents(includeSubclasses = true) {
        return Array.from(this.__componentsRegistry ?? []).filter(c => c instanceof this && (includeSubclasses || c.constructor.name === this.name));
    }

    static findComponentByID(id, includeSubclasses = true) {
        let components = AbstractComponent.getComponents(includeSubclasses);

        return components.filter(c => c.id === id)[0] ?? null;
    }



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

    isMounted() { return this._isMounted && this._instance; }

    themeClass(theme = this.theme) { return `kw-${theme ? theme : 'default'}`; }

    get instance() { return this?._instance; }
    get parent() { return this?._instance?.parentElement; }

    get classes() { return this._classes; }
    setClasses(classes) {
        this._classes.forEach(c => this.removeClass(c));
        this._classes = [];
        classes.forEach(c => this.addClass(c));
    }
    hasClass(c) { return this.classes.includes(c); }
    addClass(c) {
        if (!this.hasClass(c)) {
            this._classes.push(c);
            this.onClassAdded(c);
            this._dispathEvent("classes-change");
        }
    }
    removeClass(c) {
        if (this.hasClass(c)) {
            this._classes = this._classes.filter(cls => cls !== c);
            this.onClassRemoved(c);
            this._dispathEvent("classes-change");
        }
    }

    get attributes() { return this._attributes; }
    setAttributes(attributes) {
        for (let k in this._attributes) { this.removeAttribute(k); }
        this._attributes = {};
        for (let k in attributes) { this.addAttribute(k, attributes[k]); }
    }
    hasAttribute(key) { return Object.keys(this.attributes).includes(key); }
    hasAttributeValue(key, value) { return Object.keys(this.attributes).includes(key) && this.attributes[key] === value; }
    addAttribute(key, value) {
        if (!this.hasAttributeValue(key, value)) {
            this._attributes[key] = value;
            this.onAttributeAdded(key, value);
            this._dispathEvent("attributes-change");
        }
    }
    removeAttribute(key) {
        if (this.hasAttribute(key)) {
            let value = this._attributes[key];
            delete this._attributes[key];
            this.onAttributeRemoved(key, value);
            this._dispathEvent("attributes-change");
        }
    }

    get props() { return this._props; }
    setProps(props) {
        let oldProps = this._props;
        let p = { ...this.constructor._defaultProps, ...oldProps, ...props };

        if (this.constructor.validateProps(p)) {
            this._props = p;
        } else {
            throw new Error(`${this.constructor.name} (${this.id}): Failed to validate props`);
        }

        this.onPropsChange(oldProps);
        this._dispathEvent("props-change");
    }

    get children() { return this._children; }
    set children(children) { this.setChildren(children); }
    setChildren(children) {
        this._children.forEach(c => this.removeChild(c));
        this._children = [];
        children.forEach(c => this.addChild(c));
    }
    hasChild(child) { return this.children.includes(child); }
    addChild(child, index = -1) {
        if (child === this) throw new Error(`${this.constructor.name} (${this.id}): Cannot nest an element inside itself`);
        if (this.hasChild(child)) return;
        if (index < 0) index = this._children.length;

        this._children = this._children.toSpliced(index, 0, child);

        this.onChildAdded(child);
        this._dispathEvent("children-change");
    }
    removeChild(child) {
        if (!this.hasChild(child)) return;

        this._children = this._children.filter(c => c !== child);

        this.onChildRemoved(child);
        this._dispathEvent("children-change");
    }

    get listeners() { return this._listeners; }
    addListener(event, fn) {
        if (!this.hasListener(event, fn)) {
            if (!this._listeners[event]) {
                this._listeners[event] = [];
            }

            this._listeners[event].push(fn);

            this.onListenerAdded(event, fn);
            this._dispathEvent("listeners-change");
        }
    }
    removeListener(event, fn) {
        if (this.hasListener(event, fn)) {
            this._listeners[event] = (this._listeners[event] ?? []).filter(l => l !== fn);

            this.onListenerRemoved(event, fn);
            this._dispathEvent("listeners-change");
        }
    }
    hasListener(event, fn) {
        return (
            Object.keys(this._listeners).includes(event) &&
            this._listeners[event].includes(fn)
        );
    }

    get theme() { return this._theme; }
    set theme(theme) { this.setTheme(theme); }
    setTheme(theme) {
        let oldTheme = this._theme;

        if (this.constructor._themes.includes(theme)) {
            this._theme = theme
        } else {
            throw new Error(`${this.constructor.name} (${this.id}): Failed to set theme`);
        }

        this.onThemeChange(oldTheme);
        this._dispathEvent("theme-change");
    }

    _dispathEvent(type, options = { bubbles: true, cancelable: true, detail: { comp: this } }) {
        if (!this.isMounted()) return;

        if (!type.startsWith("comp-")) type = `comp-${type}`;

        let event = new CustomEvent(type, options);

        let wrapper = this.eventDispatchWrapper();
        if (wrapper instanceof HTMLElement) wrapper.dispatchEvent(event);
    }

    clone() {
        let clonedChildren = this._children.map(child => {
            if (child instanceof AbstractComponent) {
                return child.clone();
            }
            return child;
        });

        return new this.constructor(
            { ...this._props },
            clonedChildren,
            this._theme,
            null,
            this._classes
        );
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) this.remount();
    }

    onChildAdded(child) {
        if (this.isMounted()) {
            if (child instanceof AbstractComponent) {
                child.unmount();
                child.mount(this.childrenContainer());
            } else if (child instanceof HTMLElement) {
                this.childrenContainer().appendChild(child);
            } else if (typeof child === "string") {
                this.childrenContainer().appendChild(this.constructor.stringToHTML(child));
            }
        };
    }

    onChildRemoved(child) {
        if (this.isMounted()) {
            if (child instanceof AbstractComponent) {
                child.unmount();
            } else if (child instanceof HTMLElement) {
                child.remove();
            } else {
                Array.from(this.childrenContainer()?.childNodes)?.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent === child) {
                        node.remove();
                    }
                });
            }
        }
    }

    onClassAdded(c) {
        if (this.isMounted()) {
            let i = this.classWrapper();

            i.classList.add(c);
        }
    }

    onClassRemoved(c) {
        if (this.isMounted()) {
            let i = this.classWrapper();

            i.classList.remove(c);
        }
    }

    onAttributeAdded(key, value) {
        if (this.isMounted()) {
            let i = this.attributesWrapper();

            i.setAttribute(key, value);
        }
    }

    onAttributeRemoved(key, value) {
        if (this.isMounted()) {
            let i = this.attributesWrapper();

            if (i.hasAttribute(key)) i.removeAttribute(key);
        }
    }

    onThemeChange(oldTheme) {
        if (this.isMounted() && oldTheme !== this.theme) {
            let i = this.i();

            i.classList.remove(this.themeClass(oldTheme));
            i.classList.add(this.themeClass());
        };
    }

    onListenerAdded(event, fn) {
        if (this.isMounted()) {
            let wrapper = this.listenersWrapper();

            wrapper.addEventListener(event, fn);
        }
    }

    onListenerRemoved(event, fn) {
        if (this.isMounted()) {
            let wrapper = this.listenersWrapper();

            wrapper.removeEventListener(event, fn);
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

    detachChildren(element) {
        [
            ...element.children,
            ...element.childNodes
        ].forEach(c => {
            let comp = this.constructor.findComponentByID(c.id);
            if (c.id && comp instanceof AbstractComponent) {
                comp.unmount();
            } else {
                c.remove();
            }
        });

        element.innerHTML = "";
    }

    attachListeners(element, listeners = this._listeners) {
        for (let event of Object.keys(listeners)) {
            for (let fn of listeners[event]) {
                element.addEventListener(event, fn);
                this._cleanUpFunctions.push(() => { element.removeEventListener(event, fn); });
            }
        }
    }

    eventDispatchWrapper() { return this.i(); }
    listenersWrapper() { return this.i(); }
    attributesWrapper() { return this.i(); }
    classWrapper() { return this.i(); }
    childrenContainer() { return this.i(); }
    i() { return this?.instance; }
    $(selector) { return this?.parent?.querySelector(selector); }
    $$(selector) { return this?.parent?.querySelectorAll(selector); }

    prepare() {
        if (this.isMounted()) return;

        this._instance = this.render();
        this._instance.id = this.id;
        if (this._classes.length > 0) this._instance.classList.add(...this._classes);
        if (Object.keys(this._attributes).length > 0) {
            for (let key in this._attributes) {
                this._instance.setAttribute(key, this._attributes[key]);
            }
        }
        this.bindEvents();
    }

    /**
     * Mounts the component to an element
     * @param {HTMLElement} parent
     * @param {boolean} [prepend=false]
     */
    mount(parent, prepend = false) {
        if (this.isMounted()) this.unmount();

        this.prepare();
        if (prepend) { parent.prepend(this.instance) } else { parent.appendChild(this.instance) }
        this.constructor.styleRegister.register(this.constructor);
        this._isMounted = true;

        this.onMount();
        this._dispathEvent("mount");
    }

    remount() {
        if (this.isMounted()) {
            let parent = this.parent;
            this.unmount();
            this.mount(parent);
        }
    }

    /**
     * Unmounts the component
     */
    unmount() {
        if (!this._isMounted) return;

        this.onUnmount();
        this._dispathEvent("unmount");

        this._cleanUpFunctions.forEach(fn => fn());
        this._cleanUpFunctions = [];

        this.detachChildren(this.childrenContainer());

        this._instance?.remove();
        this._instance = null;
        // this.constructor.styleRegister.unregister(this.constructor);
        this._isMounted = false;
    }



    /**
     * Themes the component is available in
     * @type {string[]}
     */
    static _themes = [
        'bg',
        'fg',
        'text',
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

    onCreation() { }

    onMount() { }

    onUnmount() { }
}