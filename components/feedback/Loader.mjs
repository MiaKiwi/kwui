import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "../core/CSSVariables.mjs";
import FontawesomeIcon from "../display/icons/FontawesomeIcon.mjs";



export default class Loader extends AbstractComponent {
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
        super(props, children, theme, id, classes, attributes);

        this._icon = new FontawesomeIcon({
            name: "spinner",
            animation: FontawesomeIcon.fa_animations.spin_pulse
        })
    }

    childrenContainer() { return this.i().querySelector(".loader-content"); }

    static _rawStylingRules = [
        `:has(>.loader){position:relative}`,
        `.loader{z-index:99999;position:absolute;top:0;left:0;backdrop-filter:blur(3px) brightness(0.75);width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1em;flex-wrap:wrap;align-content:center}`
    ];

    render() {
        let el = document.createElement("div");

        el.classList.add("loader", this.themeClass());

        this._icon.mount(el);
        this._icon.i()?.classList.add("loader-icon");

        let content = document.createElement("div");
        content.classList.add("loader-content");
        el.appendChild(content)

        this.attachChildren(content);
        this.attachListeners(el);

        return el;
    }

    stop() {
        this.unmount();
    }

    onUnmount() {
        this._icon.unmount();
    }
}