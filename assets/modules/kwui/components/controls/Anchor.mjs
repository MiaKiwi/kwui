import Component from "../Component.mjs";
import Typography from "../display/Typography.mjs";



export default class Anchor extends Component {
    /**
     * Creates an Anchor component
     * @param {string} [params.props.href='#'] The URL the anchor points to
     * @param {string} [params.props.target='_self'] The target for the anchor (_blank, _self, etc.)
     * @param {string} [params.props.rel='noopener noreferrer'] The rel attribute for the anchor
     * @param {boolean} [params.props.shy=false] Whether the anchor should be less visually prominent
     */
    constructor({
        props = {
            href: '#',
            target: '_self',
            rel: 'noopener noreferrer',
            shy: false
        },
        ...params
    }) {
        super({ props, ...params });
    }



    static get cssDependencies() {
        return [Typography];
    }



    static get cssRules() {
        return [
            `.anchor{text-decoration:none;cursor:pointer;}`,
            `.anchor:not(.shy){color:var(--primary);}`,
            `.anchor:hover,.anchor:focus,.anchor.active{text-decoration:underline;}`,
            `.anchor:not(.shy).kw-{{theme}}{color:var(--{{theme}});&:visited,&:active{color:var(--{{theme}}-30);}}`,
            `.anchor.shy{color:inherit;}&:visited,&:active{color:inherit;}`
        ];
    }



    createElement() {
        let a = document.createElement('a');

        this.addAttributes(a);
        this.addThemeClass(a);

        a.classList.add('anchor');
        if (this.props.shy) a.classList.add('shy');

        if (this.props.href) a.href = this.props.href;
        if (this.props.target) a.target = this.props.target;
        if (this.props.rel) a.rel = this.props.rel;

        this.attachChildren(a);
        this.attachListeners(a);

        return a;
    }
}