import Event from "../helpers/Event.mjs";
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
        this.setAttributes(attributes);

        this.constructor.__registerComponent(this);

        this.onCreation();
        this._dispatchEvent(Event.INIT);
    }



    get id() { return this._id; }
    get instance() { return this?._instance; }
    get parent() { return this?._instance?.parentElement; }
    get classes() { return this._classes; }
    get attributes() { return this._attributes; }
    get props() { return this._props; }
    get defaultProps() { return this.constructor._defaultProps; }
    static get defaultProps() { return this._defaultProps; }
    get children() { return this._children; } set children(children) { this.setChildren(children); }
    get listeners() { return this._listeners; }
    get theme() { return this._theme; } set theme(theme) { this.setTheme(theme); }
    get themes() { return this.constructor._themes; }
    static get themes() { return this._themes; }



    /**
     * Style register where processed component styles are registered
     * @type {StyleRegister}
     */
    static styleRegister = new StyleRegister();



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



    /**
     * Cached processed styling rules for this component and its sub-classes
     * @type {WeakMap}
     * @private
     */
    static __cachedStylingRulesMap = new WeakMap();

    /**
     * Cached processed styling rules for this component class only
     * @type {Set}
     * @private
     */
    static get __cachedStylingRules() {
        if (!this.__cachedStylingRulesMap.get(this)) this.__cachedStylingRulesMap.set(this, new Set());

        return this.__cachedStylingRulesMap.get(this);
    }



    /**
     * Registry of all components of this class and its sub-classes
     * @type {Set}
     * @private
     */
    static __componentsRegistry = new Set();

    /**
     * Registers a component to the components registry
     * @param {AbstractComponent} component
     * @static
     * @private
     */
    static __registerComponent(component) {
        if (!this.__componentsRegistry.has(component)) this.__componentsRegistry.add(component);
    }

    /**
     * Gets the registered components of the class, and sub-classes by default
     * @param {boolean} includeSubclasses Whether to include sub-classes in results
     * @returns {AbstractComponent[]}
     * @static
     */
    static getComponents(includeSubclasses = true) {
        return Array.from(this.__componentsRegistry ?? []).filter(c => c instanceof this && (includeSubclasses || c.constructor.name === this.name));
    }

    /**
     * Finds a component by an ID
     * @param {string} id
     * @param {boolean} includeSubclasses Whether to include sub-classes in search
     * @returns {AbstractComponent|null}
     * @static
     */
    static findComponentByID(id, includeSubclasses = true) {
        let components = AbstractComponent.getComponents(includeSubclasses);

        return components.filter(c => c.id === id)[0] ?? null;
    }



    /**
     * Recursive dependencies of the component class
     * @type {AbstractComponent[]}
     * @static
     */
    static get deepDependencies() {
        let deepDependencies = [...this.dependencies];

        this.dependencies.forEach(dependency => deepDependencies.push(...dependency.deepDependencies));

        deepDependencies = Array.from(new Set(deepDependencies));

        return deepDependencies;
    }

    /**
     * Processed styling rules of the component class
     * @type {string[]}
     * @static
     */
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



    /**
     * Checks if the component is mounted and has an instance
     * @returns {boolean}
     */
    isMounted() { return this._isMounted && this._instance; }

    /**
     * Removes old and sets new component classes
     * @param {string[]} classes
     */
    setClasses(classes) {
        this._classes.forEach(c => this.removeClass(c));
        this._classes = [];
        classes.forEach(c => this.addClass(c));
    }

    /**
     * Checks if the component has a given class
     * @param {string} c Class
     * @returns {boolean}
     */
    hasClass(c) { return this.classes.includes(c); }

    /**
     * Adds a class to the component
     * @param {...string} c List of classes
     */
    addClass(...c) {
        c?.forEach(cla => {
            if (!this.hasClass(cla)) {
                this._classes.push(cla);
                this.onClassAdded(cla);
                this._dispatchEvent(Event.CLASSES_CHANGE);
            }
        });
    }

    /**
     * Removes a class from the component
     * @param {...string} c List of classes
     */
    removeClass(...c) {
        c?.forEach(cla => {
            if (this.hasClass(cla)) {
                this._classes = this._classes.filter(cls => cls !== cla);
                this.onClassRemoved(cla);
                this._dispatchEvent(Event.CLASSES_CHANGE);
            }
        });
    }


    /**
     * Removes old and sets new attributes for the component
     * @param {object} attributes
     */
    setAttributes(attributes) {
        for (let k in this._attributes) { this.removeAttribute(k); }
        this._attributes = {};
        for (let k in attributes) { this.addAttribute(k, attributes[k]); }
    }

    /**
     * Checks if the component has an attribute with the given key
     * @param {string} key
     * @returns {boolean}
     */
    hasAttribute(key) { return Object.keys(this.attributes).includes(key); }

    /**
     * Checks if the component has an attribute with the given key and value
     * @param {string} key
     * @param {*} value
     * @returns {boolean}
     */
    hasAttributeValue(key, value) { return Object.keys(this.attributes).includes(key) && this.attributes[key] === value; }

    /**
     * Adds an attribute to the component
     * @param {string} key
     * @param {*} value
     */
    addAttribute(key, value) {
        if (!this.hasAttributeValue(key, value)) {
            this._attributes[key] = value;
            this.onAttributeAdded(key, value);
            this._dispatchEvent(Event.ATTRIBUTES_CHANGE);
        }
    }

    /**
     * Adds an attribute  and returns the component for method chaining
     * @param {string} key
     * @param {*} value
     * @returns {AbstractComponent}
     */
    attr(key, value) {
        this.addAttribute(key, value);

        return this;
    }

    /**
     * Removes an attribute from the component
     * @param {string} key
     */
    removeAttribute(key) {
        if (this.hasAttribute(key)) {
            let value = this._attributes[key];
            delete this._attributes[key];
            this.onAttributeRemoved(key, value);
            this._dispatchEvent(Event.ATTRIBUTES_CHANGE);
        }
    }


    /**
     * Sets the properties of the component
     * @param {object} props
     */
    setProps(props) {
        let oldProps = this._props;
        let p = { ...this.constructor._defaultProps, ...oldProps, ...props };

        if (this.constructor.validateProps(p)) {
            this._props = p;
        } else {
            throw new Error(`${this.constructor.name} (${this.id}): Failed to validate props`);
        }

        this.onPropsChange(oldProps);
        this._dispatchEvent(Event.PROPS_CHANGE);
    }


    /**
     * Removes old and sets new children of the component
     * @param {string[]|HTMLElement[]|AbstractElement[]} children
     */
    setChildren(children) {
        this._children.forEach(c => this.removeChild(c));
        this._children = [];
        children.forEach(c => this.addChild(c));
    }

    /**
     * Checks if the component has a given child
     * @param {string[]|HTMLElement[]|AbstractElement[]} child
     * @returns {boolean}
     */
    hasChild(child) { return this.children.includes(child); }

    /**
     * Adds a child to the component
     * @param {string[]|HTMLElement[]|AbstractElement[]} child
     * @param {number} [index=-1] Where to insert the new child. Leave empty to append it
     */
    addChild(child, index = -1) {
        if (child === this) throw new Error(`${this.constructor.name} (${this.id}): Cannot nest an element inside itself`);
        if (this.hasChild(child)) return;
        if (index < 0) index = this._children.length;

        this._children = this._children.toSpliced(index, 0, child);

        this.onChildAdded(child);
        this._dispatchEvent(Event.CHILDREN_CHANGE);
    }

    /**
     * Removes a child from the component
     * @param {string[]|HTMLElement[]|AbstractElement[]} child
     */
    removeChild(child) {
        if (!this.hasChild(child)) return;

        this._children = this._children.filter(c => c !== child);

        this.onChildRemoved(child);
        this._dispatchEvent(Event.CHILDREN_CHANGE);
    }


    /**
     * Adds a listener to the component
     * @param {string} event Event type
     * @param {Function} fn Callback
     */
    addListener(event, fn) {
        if (!this.hasListener(event, fn)) {
            if (!this._listeners[event]) {
                this._listeners[event] = [];
            }

            this._listeners[event].push(fn);

            this.onListenerAdded(event, fn);
            this._dispatchEvent(Event.LISTENERS_CHANGE);
        }
    }

    /**
     * Adds a listener and returns the component for method chaining
     * @param {string} event Event type
     * @param {Function} fn Callback
     * @returns {AbstractComponent}
     */
    listen(event, fn) {
        this.addListener(event, fn);

        return this;
    }

    /**
     * Removes a listener from the component
     * @param {string} event Event type
     * @param {Function} fn Callback
     */
    removeListener(event, fn) {
        if (this.hasListener(event, fn)) {
            this._listeners[event] = (this._listeners[event] ?? []).filter(l => l !== fn);

            this.onListenerRemoved(event, fn);
            this._dispatchEvent(Event.LISTENERS_CHANGE);
        }
    }

    /**
     * Checks if the component has a given listener
     * @param {string} event Event type
     * @param {Function} fn Callback
     * @returns {boolean}
     */
    hasListener(event, fn) {
        return (
            Object.keys(this._listeners).includes(event) &&
            this._listeners[event].includes(fn)
        );
    }

    /**
     * Dispatches a custom event from the component instance
     * @param {string} type Event type
     * @param {object} options Event options
     */
    _dispatchEvent(type, options = {}) {
        if (!this.isMounted()) return;

        options = {
            bubbles: true,
            cancelable: true,
            detail: { comp: this },
            ...options
        }

        if (!Object.values(Event.list).includes(type)) console.warn(`${this.constructor.name} (${this.id}): Non-standard event type '${type}' used`);

        let event = new CustomEvent(type, options);

        let wrapper = this.eventDispatchWrapper();
        if (wrapper instanceof HTMLElement) wrapper.dispatchEvent(event);
    }

    /**
     * Old method for dispatching custom events. Please do not use
     * @param {string} type Event type
     * @param {object} options Event options
     * @deprecated A new method with the correct name is now available
     */
    _dispathEvent(type, options = { bubbles: true, cancelable: true, detail: { comp: this } }) {
        this._dispatchEvent(type, options);
    }


    /**
     * Sets the theme of the component
     * @param {string} theme 
     */
    setTheme(theme) {
        let oldTheme = this._theme;

        if (this.constructor._themes.includes(theme)) {
            this._theme = theme
        } else {
            throw new Error(`${this.constructor.name} (${this.id}): Failed to set theme`);
        }

        this.onThemeChange(oldTheme);
        this._dispatchEvent(Event.THEME_CHANGE);
    }

    /**
     * Gets the corresponding CSS class for a component style
     * @param {string} [theme=this.theme] Desired theme class. Leave empty for current theme
     * @returns {string}
     */
    themeClass(theme = this.theme) { return `kw-${theme ? theme : 'default'}`; }



    /**
     * Triggered after component properties are changed
     * @param {object} oldProps Previous properties
     */
    onPropsChange(oldProps) {
        if (Object.keys(this.constructor._defaultProps).length < 1) return;

        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) this.remount();
    }

    /**
     * Triggered after a child is added
     * @param {string[]|HTMLElement[]|AbstractElement[]} child Child added
     */
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

    /**
     * Triggered after a child is removed
     * @param {string[]|HTMLElement[]|AbstractElement[]} child Child removed
     */
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

    /**
     * Triggered after a class is added
     * @param {string} c Class added
     */
    onClassAdded(c) {
        if (this.isMounted()) {
            let i = this.classWrapper();

            i.classList.add(c);
        }
    }

    /**
     * Triggered after a class is removed
     * @param {string} c Class removed
     */
    onClassRemoved(c) {
        if (this.isMounted()) {
            let i = this.classWrapper();

            i.classList.remove(c);
        }
    }

    /**
     * Triggered after an attribute is added
     * @param {string} key
     * @param {*} value
     */
    onAttributeAdded(key, value) {
        if (this.isMounted()) {
            let i = this.attributesWrapper();

            i.setAttribute(key, value);
        }
    }

    /**
     * Triggered after an attribute is removed
     * @param {string} key
     * @param {*} value
     */
    onAttributeRemoved(key, value) {
        if (this.isMounted()) {
            let i = this.attributesWrapper();

            if (i.hasAttribute(key)) i.removeAttribute(key);
        }
    }

    /**
     * Triggered after the theme is changed
     * @param {string} oldTheme Previous theme
     */
    onThemeChange(oldTheme) {
        if (this.isMounted() && oldTheme !== this.theme) {
            let i = this.classWrapper();

            i.classList.remove(this.themeClass(oldTheme));
            i.classList.add(this.themeClass());
        };
    }

    /**
     * Triggered after a listener is added
     * @param {string} event Event type
     * @param {Function} fn Callback
     */
    onListenerAdded(event, fn) {
        if (this.isMounted()) {
            let wrapper = this.listenersWrapper();

            wrapper.addEventListener(event, fn);
            this._cleanUpFunctions.push(() => { wrapper.removeEventListener(event, fn); });
        }
    }

    /**
     * Triggered after a listener is removed
     * @param {string} event Event type
     * @param {Function} fn Callback
     */
    onListenerRemoved(event, fn) {
        if (this.isMounted()) {
            let wrapper = this.listenersWrapper();

            wrapper.removeEventListener(event, fn);
        }
    }



    /**
     * Returns the node where events are dispatched from
     * @returns {HTMLElement|null}
     */
    eventDispatchWrapper() { return this.i(); }

    /**
     * Returns the node where event listeners are attached
     * @returns {HTMLElement|null}
     */
    listenersWrapper() { return this.i(); }

    /**
     * Returns the node where attributes are set
     * @returns {HTMLElement|null}
     */
    attributesWrapper() { return this.i(); }

    /**
     * Returns the node where classes are set
     * @returns {HTMLElement|null}
     */
    classWrapper() { return this.i(); }

    /**
     * Returns the node where children are attached
     * @returns {HTMLElement|null}
     */
    childrenContainer() { return this.i(); }

    /**
     * Returns the component instance
     * @returns {HTMLElement|null}
     */
    i() { return this?.instance; }

    /**
     * Runs querySelector on the parent of the component instance
     * @param {string} selector The query selector
     * @returns {Element|null}
     */
    $(selector) { return this?.parent?.querySelector(selector); }

    /**
     * Runs querySelectorAll on the parent of the component instance
     * @returns {NodeList|null}
     */
    $$(selector) { return this?.parent?.querySelectorAll(selector); }



    /**
     * Attaches the children of the component to an element
     * @param {Element} element Container
     * @param {string[]|HTMLElement[]|AbstractElement[]} [children=this.children] List of children, component children by default
     */
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

    /**
     * Detaches children from an element
     * @param {Element} element Container
     */
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

    /**
     * Attaches the listeners of the component to an element
     * @param {Element} element Container
     * @param {object<string, Function>} [listeners=this.listeners] Event listeners, component listeners by default
     */
    attachListeners(element, listeners = this._listeners) {
        for (let event of Object.keys(listeners)) {
            for (let fn of listeners[event]) {
                element.addEventListener(event, fn);
                this._cleanUpFunctions.push(() => { element.removeEventListener(event, fn); });
            }
        }
    }



    /**
     * Creates a copy of the component
     * @returns {AbstractComponent} Clone
     */
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
            this._classes,
            this._attributes
        );
    }

    /**
     * Renders, adds classes, adds attributes, and binds events to the component instance
     * 
     * Ignored if the component is already mounted
     * @private
     */
    _prepare() {
        if (this.isMounted()) return;

        this._instance = this.render();
        this._instance.id = this.id;
        if (this._classes.length > 0) this.classWrapper().classList.add(...this._classes);
        if (Object.keys(this._attributes).length > 0) {
            for (let key in this._attributes) {
                this.attributesWrapper().setAttribute(key, this._attributes[key]);
            }
        }
        this.bindEvents();
    }

    /**
     * Mounts the component to an element
     * 
     * If already mounted, unmounts it from its last parent
     * @param {Element} parent
     * @param {boolean} [prepend=false]
     */
    mount(parent, prepend = false) {
        if (this.isMounted()) this.unmount();

        this._prepare();
        if (prepend) { parent.prepend(this.instance) } else { parent.appendChild(this.instance) }
        this.constructor.styleRegister.register(this.constructor);
        this._isMounted = true;

        this.onMount();
        this._dispatchEvent(Event.MOUNT);
    }

    /**
     * Unmounts and remounts the component to its parent
     */
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
        if (!this.isMounted()) return;

        this.onUnmount();
        this._dispatchEvent(Event.UNMOUNT);

        this._cleanUpFunctions.forEach(fn => fn());
        this._cleanUpFunctions = [];

        this.detachChildren(this.childrenContainer());

        this._instance?.remove();
        this._instance = null;
        this._isMounted = false;
    }



    /**
     * Themes the component is available in
     * @type {string[]}
     * @private
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
     * @private
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

    /**
     * Styling rules for the component.
     * 
     * Use '{{theme}}' to generate rules based on available themes for the component, e.g.:
     * > `.component.kw-{{theme}} { color: var(--{{theme}}) } -> .component.kw-primary { color: var(--primary) }`
     * @type {string[]}
     * @private
     */
    static _rawStylingRules = [];

    /**
     * Component dependencies
     * @type {AbstractComponent[]}
     */
    static dependencies = [];

    /**
     * Creates the component instance and attaches its children
     * @returns {Element}
     * @private
     */
    render() { }

    /**
     * Attaches event listeners to the instance
     * @private
     */
    bindEvents() { }

    /**
     * Triggered when the component is instantiated (created)
     * @private
     */
    onCreation() { }

    /**
     * Triggered after the component is mounted
     * @private
     */
    onMount() { }

    /**
     * Triggered before the component is unmounted
     * @private
     */
    onUnmount() { }
}