import Anchor from "../../controls/Anchor.mjs";
import CssVariables from "../../misc/CssVariables.mjs";



export default class BreadcrumbItem extends Anchor {
    static cssLoaded = false;



    /**
     * Creates a BreadcrumbItem component
     * @param {string|Component[]} params.props.content The breadcrumb item content
     * @param {string} [params.props.href='#'] The URL the breadcrumb item points to
     * @param {string} [params.props.target='_self'] The target for the breadcrumb item (_blank, _self, etc.)
     * @param {string} [params.props.rel='noopener noreferrer'] The rel attribute for the breadcrumb item
     */
    constructor({
        props = {
            content,
            href: '#',
            target: '_self',
            rel: 'noopener noreferrer'
        },
        ...params
    }) {
        super({ props, ...params });

        this.children = this.props.content;
    }



    static get cssDependencies() {
        return [Anchor, CssVariables];
    }



    static get cssRules() {
        return [
            `.breadcrumb-item:not(:last-child){opacity:var(--muted-transparency);}`,
            `.breadcrumb-item:not(:last-child){&:hover,&:focus{opacity:1;}}`
        ];
    }



    createElement() {
        let li = document.createElement('li');
        li.classList.add('breadcrumb-item');

        let a = super.createElement();

        li.appendChild(a);

        return li;
    }
}