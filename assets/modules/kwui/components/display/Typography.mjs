import CssComponent from "../CssComponent.mjs";
import CssVariables from "../misc/CssVariables.mjs";



export default class Typography extends CssComponent {
    constructor({
        ...params
    }) {
        super(params);
    }



    static get cssRules() {
        let fontImports = [
            `@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');`
        ];

        let textRules = [
            `:root{--font-sans: 'Noto Sans', sans-serif;--font-serif: 'Noto Serif', serif;--font-mono: 'Fira Code', monospace;--font-weight-light: 300;--font-weight-regular: 400;--font-weight-medium: 500;--font-weight-bold: 700;--font-family: var(--font-sans), var(--font-serif), var(--font-mono);}`,
            `html,body{font-family: var(--font-family);font-weight: var(--font-weight-regular);font-size: 100%;line-height: 1.5;color: var(--text);background-color: var(--bg);}`,
            `.text-{{theme}}{color:var(--{{theme}});}`,
            `.text-size-normal{font-size:100%;}`,
            `h1,h2,h3,h4,h5,h6,.text-h1,.text-h2,.text-h3,.text-h4,.text-h5,.text-h6{font-weight:var(--font-weight-bold);}`,
            `h1,.text-h1{font-size:2.489em;}`,
            `h2,.text-h2{font-size:2.074em;}`,
            `h3,.text-h3{font-size:1.728em;}`,
            `h4,.text-h4{font-size:1.44em;}`,
            `h5,.text-h5,.text-large{font-size:1.2em;}`,
            `h6,.text-h6{font-size:1em;}`,
            `small,.text-small{font-size:0.833em;}`,
            `text-strong,strong{font-weight:var(--font-weight-bold);}`,
            `em,i,.text-italic{font-style:italic;}`,
            `u,.text-underline{text-decoration:underline;}`,
            `code,.text-mono{font-family:var(--font-mono);}`,
            `.text-serif{font-family:var(--font-serif);}`,
            `.text-sans{font-family:var(--font-sans);}`,
            `.text-muted{opacity:var(--muted-transparency);}`,
            `.text-center{text-align:center;}`,
            `.text-right{text-align:right;}`,
            `.text-left{text-align:left;}`,
            `.text-justify{text-align:justify;}`
        ];

        let rules = [...fontImports, ...textRules];

        return rules;
    }



    static get cssDependencies() {
        return [CssVariables];
    }



    /**
     * Creates a new element with the given tag name and text content
     * @param {string} tagName The tag name of the element to create
     * @param {string} content The text content of the element
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created element
     */
    static new(tagName, content, doc = document) {
        let element = doc.createElement(tagName);
        element.textContent = content;
        return element;
    }



    /**
     * Creates a new span element with the given text
     * @param {string} text The span text content
     * @param {Document} doc The document to create the element in
     * @returns {HTMLSpanElement} The created span element
     */
    static newSpan(text, doc = document) {
        return this.new('span', text, doc);
    }



    /**
     * Creates a new paragraph element with the given text
     * @param {string} text The paragraph text
     * @param {Document} doc The document to create the element in
     * @returns {HTMLParagraphElement} The created paragraph element
     */
    static newParagraph(text, doc = document) {
        return this.new('p', text, doc);
    }



    /**
     * Creates a new large text element with the given text
     * @param {string} text The large text content
     * @param {Document} doc The document to create the element in
     * @returns {HTMLSpanElement} The created large text element
     */
    static newLargeText(text, doc = document) {
        let el = this.new('span', text, doc);

        el.classList.add('text-large');

        return el;
    }



    /**
     * Creates a new small text element with the given text
     * @param {string} text The small text content
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created small text element
     */
    static newSmallText(text, doc = document) {
        return this.new('small', text, doc);
    }



    /**
     * Creates a new code text element with the given text
     * @param {string} text The code text content
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created code text element
     */
    static newCodeText(text, doc = document) {
        return this.new('code', text, doc);
    }



    /**
     * Creates a new italic text element with the given text
     * @param {string} text The italic text content
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created italic text element
     */
    static newItalicText(text, doc = document) {
        let el = this.new('em', text, doc);

        el.classList.add('text-italic');

        return el;
    }



    /**
     * Creates a new bold text element with the given text
     * @param {string} text The bold text content
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created bold text element
     */
    static newBoldText(text, doc = document) {
        let el = this.new('strong', text, doc);

        el.classList.add('text-strong');

        return el;
    }



    /**
     * Creates a new heading element with the given level and text
     * @param {number} level The heading level (1-6)
     * @param {string} text The heading text
     * @param {Document} doc The document to create the element in
     * @returns {HTMLHeadingElement} The created heading element
     */
    static newHeading(level, text, doc = document) {
        let tagName = `h${level}`;
        return this.new(tagName, text, doc);
    }
}