import Component from "../Component.mjs";
import CssVariables from "../misc/CssVariables.mjs";



export default class Avatar extends Component {
    /**
     * Creates an Avatar component
     * @param {string} params.props.content The avatar content (text or HTML)
     * @param {string} [params.props.src=null] The avatar image source URL
     * @param {string} [params.props.alt=null] The avatar image alt text
     * @param {string} [params.props.shape='circle'] The avatar shape (circle, square, rounded)
     * @param {boolean} [params.props.inline=false] Whether the avatar is displayed inline with text
     */
    constructor({
        props = {
            content: null,
            src: null,
            alt: null,
            shape: 'circle',
            inline: false
        },
        ...params
    }) {
        super({ props, ...params });

        if (this.props.shape && !this.constructor.componentStyles.includes(this.props.shape)) {
            console.warn(`Avatar shape "${this.props.shape}" does not exist`);
            this.props.shape = this.constructor.componentStyles[0];
        }
    }



    static get componentStyles() {
        return [
            'circle',
            'square',
            'rounded'
        ];
    }



    static get cssDependencies() {
        return [CssVariables];
    }



    static get cssRules() {
        return [
            `.avatar{--avatar-size:2em;--avatar-bg:var(--primary-90);--avatar-fg:var(--primary-10);--avatar-font-size:1.25em;--avatar-border-radius:var(--border-roundness);position:relative;display:flex;align-items:center;justify-content:center;line-height:1;overflow:hidden;width:var(--avatar-size);height:var(--avatar-size);background-color:var(--avatar-bg);color:var(--avatar-fg);font-size:var(--avatar-font-size);border-radius:var(--avatar-border-radius);user-select:none;margin:var(--padding-sm);}`,
            `.avatar.circle{--avatar-border-radius:50%;}`,
            `.avatar.square{--avatar-border-radius:0;}`,
            `.avatar.rounded{--avatar-border-radius:var(--border-roundness);}`,
            `.avatar-img{position:absolute;top:0;left:0;width:100%;height:100%;text-align:center;object-fit:cover;color:transparent;}`,
            `.avatar.kw-{{theme}}{--avatar-bg:var(--{{theme}}-90);--avatar-fg:var(--{{theme}}-10);}`,
            `.avatar.inline{display:inline-flex;vertical-align:middle;}`,
        ];
    }



    createElement() {
        let avatar = document.createElement('div');

        this.addAttributes(avatar);
        this.addThemeClass(avatar);

        avatar.classList.add('avatar');
        if (this.props.inline) avatar.classList.add('inline');
        if (this.props.shape) avatar.classList.add(this.props.shape);

        // Attach content
        if (this.props.src) {
            let img = document.createElement('img');
            img.classList.add('avatar-img');
            img.src = this.props.src;
            if (this.props.alt) img.alt = this.props.alt;
            avatar.appendChild(img);
        }
        if (this.props.content) {
            let content = Component.getInputAsHTMLElement(this.props.content);
            content.classList.add('avatar-content');
            avatar.appendChild(content);
        }

        this.attachChildren(avatar);
        this.attachListeners(avatar);

        return avatar;
    }
}