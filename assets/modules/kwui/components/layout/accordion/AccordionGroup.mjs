import Component from "../../Component.mjs";
import Accordion from "./Accordion.mjs";



export default class AccordionGroup extends Component {
    /**
     * Creates a AccordionsGroup component
     * @param {string} params.props.accordions The accordions to include in the group
     * @param {boolean} [params.props.singleExpansion=false] Whether only one accordion can be expanded at a time
     * @param {boolean} [params.props.alternateMarkLocations=false] Whether to alternate the expand/collapse icon locations between accordions
     */
    constructor({
        props = {
            accordions: [],
            singleExpansion: false,
            alternateMarkLocations: false,
            firstMarkLocation: 'left'
        },
        ...params
    }) {
        super({ props, ...params });

        if (this.props.expandIconLocation && !this.constructor.componentStyles.includes(this.props.expandIconLocation)) {
            console.warn(`Accordion icon location "${this.props.expandIconLocation}" does not exist`);
            this.props.expandIconLocation = this.constructor.componentStyles[0];
        }
    }



    static get componentStyles() {
        return [
            'left',
            'right'
        ];
    }



    static get cssDependencies() {
        return [Accordion];
    }



    static get cssRules() {
        return [
            `.accordions-container{display:flex;flex-direction:column;}`,
            `.accordions-container > .accordion:not(:first-child){margin-top:0;border-top-width:calc(var(--accordion-border-width) / 2);}`,
            `.accordions-container > .accordion:not(:last-child){margin-bottom:0;border-bottom-width:calc(var(--accordion-border-width) / 2);}`
        ];
    }



    createElement() {
        let container = document.createElement('div');

        this.addAttributes(container);
        this.addThemeClass(container);

        container.classList.add('accordions-container');

        let markLocation = this.props.firstMarkLocation === 'left' ? 'right' : 'left';
        for (let accordion of this.props.accordions) {
            if (this.theme) accordion.theme = this.theme;

            if (this.props.alternateMarkLocations) {
                markLocation = markLocation === 'left' ? 'right' : 'left';
                accordion.props.expandIconLocation = markLocation;
            }

            if (this.props.singleExpansion) {
                accordion.addEventListener('toggle', (e) => {
                    let otherAccordions = this.props.accordions.filter(a => a !== accordion);

                    let isExpanding = accordion.isExpanded();
                    if (isExpanding) {
                        for (let otherAccordion of otherAccordions) {
                            otherAccordion.collapse();
                        }
                    }
                });
            }

            container.appendChild(accordion.render());
        }

        this.attachListeners(container);

        return container;
    }
}