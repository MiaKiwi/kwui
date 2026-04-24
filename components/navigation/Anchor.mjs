import AbstractComponent from "../AbstractComponent.mjs";



export default class Anchor extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.download
     * @param {boolean} props.subtle
     * @param {string} props.type
     * @param {string} props.href
     * @param {string} props.hreflang
     * @param {string} props.referrerpolicy
     * @param {string} props.rel
     * @param {string} props.target
     * @param {string} props.media
     * @param {string} props.ping
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this.theme ??= 'text';
    }

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let a = this.i();

            [
                "download",
                "type",
                "href",
                "hreflang",
                "referrerpolicy",
                "rel",
                "target",
                "media",
                "ping",
            ].forEach(p => {
                if (oldProps[p] !== this.props[p]) {
                    if (this.props[p] !== null) {
                        a.setAttribute(p, this.props[p]);
                    } else {
                        a.removeAttribute(p);
                    }
                }
            });

            if (oldProps.subtle !== this.props.subtle) {
                a.classList.remove("subtle");

                if (this.props.subtle) a.classList.add("subtle");
            }
        }
    }

    static _defaultProps = {
        download: null,
        type: null,
        subtle: false,

        href: "#",
        hreflang: null,
        referrerpolicy: null,
        rel: "noopener noreferrer",
        target: "_self",

        media: null,
        ping: null,
    }

    static validateProps(props) {
        return (
            props.download === null || typeof props.download === "string" &&
            props.type === null || typeof props.type === "string" &&
            props.href === null || typeof props.href === "string" &&
            props.hreflang === null || typeof props.hreflang === "string" &&
            props.referrerpolicy === null || typeof props.referrerpolicy === "string" &&
            props.rel === null || typeof props.rel === "string" &&
            props.target === null || typeof props.target === "string" &&
            props.media === null || typeof props.media === "string" &&
            props.ping === null || typeof props.ping === "string" &&
            typeof props.subtle === "boolean"
        )
    }

    static _rawStylingRules = [
        `.anchor{cursor:pointer}`,
        `.anchor.subtle{text-decoration:none}`,
        `.anchor:not(.subtle):hover,.anchor:not(.subtle):active,.anchor:not(.subtle):focus{text-decoration:underline}`,
        `.anchor.kw-{{theme}}{color:var(--{{theme}});}.anchor.kw-{{theme}}:visited,.anchor.kw-{{theme}}:active,.anchor.kw-{{theme}}:hover,.anchor.kw-{{theme}}:focus{color:var(--{{theme}}-50)}`
    ]

    render() {
        let anchor = document.createElement("a");

        anchor.classList.add("anchor", this.themeClass());
        if (this.props.subtle) anchor.classList.add("subtle");
        if (this.props.download) anchor.setAttribute("download", this.props.download);
        if (this.props.type) anchor.setAttribute("type", this.props.type);
        if (this.props.href) anchor.setAttribute("href", this.props.href);
        if (this.props.hreflang) anchor.setAttribute("hreflang", this.props.hreflang);
        if (this.props.referrerpolicy) anchor.setAttribute("referrerpolicy", this.props.referrerpolicy);
        if (this.props.rel) anchor.setAttribute("rel", this.props.rel);
        if (this.props.target) anchor.setAttribute("target", this.props.target);
        if (this.props.media) anchor.setAttribute("media", this.props.media);
        if (this.props.ping) anchor.setAttribute("ping", this.props.ping);

        this.attachChildren(anchor);
        this.attachListeners(anchor);

        return anchor;
    }
}