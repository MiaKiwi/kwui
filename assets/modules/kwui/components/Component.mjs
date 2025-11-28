export default class Component {
    /**
     * Indicates whether the component CSS has been loaded
     * @type {boolean}
     */
    static cssLoaded = false;



    /**
     * Creates a new instance of the component
     * @param {Object} params The component parameters
     * @param {Object} [params.props={}] The component properties
     * @param {Array} [params.children=[]] The component children
     * @param {Object} [params.attributes={}] The component attributes
     * @param {string|null} [params.theme=null] The component theme
     * @param {Object} [params.listeners={}] The component event listeners
     */
    constructor({
        props = {},
        children = [],
        attributes = {},
        theme = null,
        listeners = {}
    }) {
        this.constructor.loadCSS();

        /**
         * The HTML element of the component
         * @type {HTMLElement|null}
         */
        this._element = null;

        this.props = props;
        this.children = children;
        this.attributes = attributes;
        this.listeners = listeners;

        if (theme && !this.constructor.themes.includes(theme)) console.warn(`${this.constructor.name} theme "${theme}" does not exist`);
        this.theme = theme;

        this.init();
    }



    /**
     * List of component styles
     * @returns {string[]} Array of component styles
     */
    static get componentStyles() {
        return [];
    }



    /**
     * List of component CSS dependencies
     * @returns {Class<Component>[]} Array of component dependencies
     */
    static get cssDependencies() {
        return [];
    }



    /**
     * Loads CSS dependencies for the component
     */
    static loadCssDependencies() {
        for (let dependency of this.cssDependencies) {
            if (dependency?.cssLoaded) continue;
            dependency?.loadCSS();
        }
    }



    /**
     * List of themes available
     * @returns {string[]} Array of theme names
     */
    static get themes() {
        return [
            'bg',
            'fg',
            'text',
            'primary',
            'secondary',
            'accent',
            'negative',
            'positive',
            'warning',
            'info'
        ];
    }



    /**
     * CSS rules for the component
     * @returns {string[]} Array of CSS rules
     */
    static get cssRules() {
        return [];
    }



    /**
     * Processed CSS rules for the component
     * @returns {string} CSS rules
     */
    static get css() {
        let rules = this.cssRules;

        // Replace {{theme}} with each theme
        let finalRules = [];

        for (let rule of rules) {
            if (rule.includes('{{theme}}')) {
                for (let theme of this.themes) {
                    finalRules.push(rule.replaceAll('{{theme}}', theme));
                }
            } else {
                finalRules.push(rule);
            }
        }

        // Move @import rules to the top
        finalRules.sort((a, b) => {
            if (a.startsWith('@import') && !b.startsWith('@import')) {
                return -1;
            } else if (!a.startsWith('@import') && b.startsWith('@import')) {
                return 1;
            } else {
                return 0;
            }
        });

        return finalRules.join('');
    }



    /**
     * Loads the component CSS into the document head
     */
    static loadCSS() {
        this.loadCssDependencies();

        if (this.cssLoaded) return;
        this.cssLoaded = true;

        let css = this.css;

        // Check if the components style tag already exists
        let styleTagId = `kw-comp-css`;

        if (!document.getElementById(styleTagId)) {
            let styleTag = document.createElement('style');
            styleTag.id = styleTagId;
            styleTag.innerHTML = css;
            document.head.appendChild(styleTag);
        } else {
            let styleTag = document.getElementById(styleTagId);

            // If style starts with @import, add it to the top
            if (css.startsWith('@import')) {
                styleTag.innerHTML = css + styleTag.innerHTML;
            } else {
                styleTag.innerHTML += css;
            }
        }

        console.debug(`Loaded component CSS ${this.name}`);
    }



    /**
     * Theme class for the component
     * @returns {string} Theme class name
     */
    get themeClass() {
        return this.theme ? `kw-${this.theme}` : '';
    }



    /**
     * Initializes the component
     */
    init() {
        // Can be overridden by subclasses to implement custom initialization logic
    }



    /**
     * Converts children to HTML elements
     * @param {Array} [children=this.children] The children to convert
     * @returns {HTMLElement[]} Array of HTML elements representing the children
     */
    getHtmlChildren(children = this.children) {
        return children.map(child => {
            if (child instanceof Component) {
                return child.render();
            } else if (child instanceof HTMLElement) {
                return child;
            } else {
                return document.createTextNode(String(child));
            }
        });
    }



    /**
     * Attaches children to the given element
     * @param {HTMLElement} element The element to attach children to
     * @param {Array} [children=this.getHtmlChildren()] The children to attach
     */
    attachChildren(element, children = this.getHtmlChildren()) {
        for (let child of children) {
            element.appendChild(child);
        }
    }



    /**
     * Adds attributes to the given element
     * @param {HTMLElement} element The element to add attributes to
     */
    addAttributes(element) {
        for (let [attr, value] of Object.entries(this.attributes)) {
            element.setAttribute(attr, value);
        }
    }



    /**
     * Adds the theme class to the given element
     * @param {HTMLElement} element The element to add the theme class to
     */
    addThemeClass(element) {
        if (this.theme) {
            element.classList.add(this.themeClass);
        }
    }



    /**
     * Creates the component HTML element
     * @returns {HTMLElement} The created HTML element
     */
    createElement() {
        throw new Error('Method "createElement" must be implemented by subclasses');
    }



    /**
     * Renders the component and returns its HTML element
     * @returns {HTMLElement} The rendered HTML element
     */
    render() {
        if (!this._element) {
            this._element = this.createElement();
        }

        return this._element;
    }



    /**
     * Attaches event listeners to the component element
     * @param {HTMLElement} [element=this._element] The element to attach listeners to
     */
    attachListeners(element = this._element) {
        for (let [event, listeners] of Object.entries(this.listeners)) {
            if (!Array.isArray(listeners)) listeners = [listeners];

            for (let listener of listeners) {
                element.addEventListener(event, listener);
            }
        }
    }



    /**
     * Adds an event listener to the component
     * @param {string} event The event name
     * @param {Function} listener The event listener function
     */
    addEventListener(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(listener);
    }



    /**
     * Updates the component element
     */
    update() {
        let oldElement = this._element;

        this._element = this.createElement();

        // Replace old element
        oldElement.replaceWith(this._element);

        // Re-attach listeners
        this.attachListeners();
    }



    /**
     * Gets the component HTML element
     * @returns {HTMLElement|null} The component HTML element
     */
    getElement() {
        return this._element;
    }
}