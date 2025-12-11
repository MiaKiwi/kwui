import Component from "../../Component.mjs";
import Card from "./Card.mjs";



export default class CardGroup extends Component {
    /**
     * Creates a CardGroup component
     * @param {Card[]} params.props.cards The cards to include in the group
     */
    constructor({
        props = {
            cards: [],
            orientation: 'column'
        },
        ...params
    }) {
        super({ props, ...params });

        if (!this.constructor.componentStyles.includes(this.props.orientation)) {
            console.warn(`Card group orientation "${this.props.orientation}" does not exist`);
            this.props.orientation = this.constructor.componentStyles[0];
        }
    }



    static get componentStyles() {
        return [
            'column',
            'row'
        ];
    }



    static get cssDependencies() {
        return [Card];
    }



    static get cssRules() {
        return [
            `.cards-container{display:flex;gap:var(--inline-block-spacing);}`,
            `.cards-container.column{flex-direction:column;}`,
            `.cards-container.row{flex-direction:row;flex-wrap:wrap;}`
        ];
    }



    createElement() {
        let container = document.createElement('div');

        this.addAttributes(container);
        this.addThemeClass(container);

        container.classList.add('cards-container');
        if (this.props.orientation) container.classList.add(this.props.orientation);

        for (let card of this.props.cards) {
            container.appendChild(card.render());
        }

        this.attachListeners(container);

        return container;
    }
}