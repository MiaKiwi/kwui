import Component from "../../Component.mjs";
import CssVariables from "../../misc/CssVariables.mjs";
import BreadcrumbItem from "./BreadcrumbItem.mjs";



export default class Breadcrumbs extends Component {
    /**
     * Creates a Breadcrumbs component
     * @param {string[]} params.props.items The breadcrumb items
     * @param {string} [params.props.separator='/'] The separator between breadcrumb items
     */
    constructor({
        props = {
            items: [],
            separator: '/'
        },
        ...params
    }) {
        super({ props, ...params });

        this.children = [];
    }



    static get cssDependencies() {
        return [BreadcrumbItem, CssVariables];
    }



    static get cssRules() {
        return [
            `.breadcrumbs{list-style:none;display:flex;flex-wrap:wrap;gap:var(--letter-spacing);padding:var(--padding-sm);margin:0;}`,
            `.breadcrumb-separator{user-select:none;opacity:var(--disabled-transparency);}`
        ];
    }



    /**
     * Creates a separator element for the breadcrumb
     * @returns {HTMLElement} The separator element
     */
    createSeparatorElement() {
        let separator = document.createElement('li');
        separator.classList.add('breadcrumb-separator');

        separator.appendChild(Component.getInputAsHTMLElement(this.props.separator || '/'));

        return separator;
    }



    createElement() {
        let wrapper = document.createElement('nav');

        let breadcrumbs = document.createElement('ol');
        breadcrumbs.classList.add('breadcrumbs');

        this.addAttributes(breadcrumbs);
        this.addThemeClass(breadcrumbs);

        let items = this.props.items || [];

        items.forEach((item, index) => {
            let isLastItem = index === items.length - 1;

            if (this.theme) item.theme = this.theme;

            let breadcrumbItem = item.createElement();
            breadcrumbs.appendChild(breadcrumbItem);

            if (!isLastItem) breadcrumbs.appendChild(this.createSeparatorElement());
        });

        this.attachListeners(breadcrumbs);

        wrapper.appendChild(breadcrumbs);

        return wrapper;
    }
}