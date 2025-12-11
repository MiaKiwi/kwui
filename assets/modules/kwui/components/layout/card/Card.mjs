import Component from "../../Component.mjs";
import CssVariables from "../../misc/CssVariables.mjs";



export default class Card extends Component {
    /**
     * Creates a Card component
     * @param {string} params.props.shape The card shape (rounded, square)
     * @param {boolean} params.props.borderless Whether the card is borderless
     */
    constructor({
        props = {
            shape: 'rounded',
            borderless: false
        },
        ...params
    }) {
        super({ props, ...params });

        if (this.props.shape && !this.constructor.componentStyles.includes(this.props.shape)) {
            console.warn(`Card shape "${this.props.shape}" does not exist`);
            this.props.shape = this.constructor.componentStyles[0];
        }
    }



    static get componentStyles() {
        return [
            'rounded',
            'square'
        ];
    }



    static get cssDependencies() {
        return [CssVariables];
    }



    static get cssRules() {
        return [
            `.card{--card-bg:var(--bg);--card-fg:var(--text);--card-border:var(--border);--card-border-radius:var(--border-roundness);padding:var(--padding-sm) var(--padding-md);background-color:var(--card-bg);color:var(--card-fg);border:var(--border-thin-width) solid var(--card-border);border-radius:var(--card-border-radius);box-shadow:var(--box-shadow);margin:var(--padding-md) 0;}`,
            `.card.rounded{border-radius:var(--border-roundness);}`,
            `.card.square{border-radius:0;}`,
            `.card.kw-{{theme}}{--card-border:var(--{{theme}});}`,
            `.card.borderless{border:none;box-shadow:none;}`,
        ];
    }



    createElement() {
        let card = document.createElement('div');

        this.addAttributes(card);
        this.addThemeClass(card);

        card.classList.add('card');
        let shape = this.props.shape || 'rounded';
        card.classList.add(shape);

        if (this.props.borderless) card.classList.add('borderless');

        this.attachChildren(card);
        this.attachListeners(card);

        return card;
    }
}