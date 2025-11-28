import Fontawesome from "../../basic/icons/Fontawesome.mjs";
import Component from "../../Component.mjs";
import Typography from "../../display/Typography.mjs";
import Animations from "../../misc/Animations.mjs";
import CssVariables from "../../misc/CssVariables.mjs";



export default class Accordion extends Component {
    /**
     * Creates a Button component
     * @param {string} params.props.summary The accordion summary content
     * @param {string} params.props.content The accordion content
     * @param {boolean} [params.props.expanded=false] Whether the accordion is expanded by default
     * @param {boolean} [params.props.locked=false] Whether the accordion is locked (disabled)
     * @param {string} [params.props.expandIconLocation='right'] The location of the expand icon (left or right)
     * @param {string} [params.props.expandIcon='<i class="fa-solid fa-angle-up"></i>'] The expand icon (<i> tag or Fontawesome classes string)
     * @param {string} [params.props.expandedIcon='<i class="fa-solid fa-angle-down"></i>'] The expanded icon (<i> tag or Fontawesome classes string)
     */
    constructor({
        props = {
            summary,
            content,
            expanded: false,
            locked: false,
            expandIconLocation: 'right',
            expandIcon: '<i class="fa-solid fa-angle-up"></i>',
            expandedIcon: '<i class="fa-solid fa-angle-down"></i>'
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
        return [Typography, CssVariables, Fontawesome, Animations];
    }



    static get cssRules() {
        return [
            `.accordion{--accordion-marked:var(--fg);--accordion-border-roundness:0;--accordion-border-width:var(--border-thin-width);--accordion-bg:var(--bg);--accordion-border:var(--border);box-shadow:var(--box-shadow);background-color:var(--accordion-bg);border:var(--accordion-border-width) solid var(--accordion-border);border-radius:var(--accordion-border-roundness);padding:var(--padding-sm);margin:var(--padding-sm);}`,
            `.accordion-content .accordion-content{opacity:0;}`,
            `.accordion-summary{--accordion-summary-padding-v:var(--padding-sm);--accordion-summary-padding-h:0;list-style:none;cursor:pointer;padding:var(--accordion-summary-padding-v) var(--accordion-summary-padding-h);padding:var(--accordion-summary-padding-v) var(--accordion-summary-padding-h);display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:var(--letter-spacing);}`,
            `.accordion-summary.mark-left{flex-direction:row-reverse;}`,
            `.accordion.kw-{{theme}}{--accordion-marked:var(--{{theme}});}`,
            `.accordion-summary-mark{display:inline-flex;align-items:center;justify-content:center;color:var(--accordion-marked);}`,
            `.accordion.locked{cursor:not-allowed;opacity:0.6;pointer-events:none;}`,
        ];
    }



    /**
     * Creates the expand/collapse mark for the accordion summary
     * @param {Accordion} accordion The accordion component
     * @returns {HTMLElement} The expand/collapse mark element
     */
    createElementSummaryExpandMark(accordion) {
        let markWrapper = document.createElement('span');
        markWrapper.classList.add('accordion-summary-mark');

        let expandIcon = Fontawesome.createIcon(this.props.expandIcon || '<i class="fa-solid fa-angle-up"></i>');
        let expandedIcon = Fontawesome.createIcon(this.props.expandedIcon || '<i class="fa-solid fa-angle-down"></i>');

        let startingIcon = accordion.hasAttribute('open') ? expandedIcon : expandIcon;
        markWrapper.appendChild(startingIcon);

        accordion.addEventListener('toggle', async () => {
            // Rotate old icon and fade out
            markWrapper.classList.add('anim-rotate', 'anim-fade-out', 'anim-fast');

            await new Promise(resolve => setTimeout(resolve, 150));

            markWrapper.classList.remove('anim-rotate', 'anim-fade-out', 'anim-fast');

            markWrapper.innerHTML = '';

            let icon = accordion.hasAttribute('open') ? expandedIcon : expandIcon;

            markWrapper.appendChild(icon);
        });

        return markWrapper;
    }



    /**
     * Creates the summary element for the accordion
     * @param {Accordion} accordion The accordion component
     * @returns {HTMLElement} The summary element
     */
    createElementSummary(accordion) {
        let summary = document.createElement('summary');
        summary.classList.add('accordion-summary');

        if (this.props.summary instanceof Component) {
            summary.appendChild(this.props.summary.render());
        } else if (this.props.summary instanceof HTMLElement) {
            summary.appendChild(this.props.summary);
        } else {
            summary.innerHTML = this.props.summary || '';
        }

        summary.appendChild(this.createElementSummaryExpandMark(accordion));

        if (this.props.expandIconLocation) summary.classList.add(`mark-${this.props.expandIconLocation}`);

        return summary;
    }



    /**
     * Creates the content element for the accordion
     * @param {Accordion} accordion The accordion component
     * @returns {HTMLElement} The content element
     */
    createElementContent(accordion) {
        let content = document.createElement('div');
        content.classList.add('accordion-content');

        if (this.props.content instanceof Component) {
            content.appendChild(this.props.content.render());
        } else if (this.props.content instanceof HTMLElement) {
            content.appendChild(this.props.content);
        } else {
            content.innerHTML = this.props.content || '';
        }

        // On expand or collapse, animate the content
        accordion.addEventListener('toggle', async () => {
            if (accordion.hasAttribute('open')) {
                content.classList.add('anim-fast', 'anim-fade-in');

                await new Promise(resolve => setTimeout(resolve, 150));

                content.classList.remove('anim-fast', 'anim-fade-in');
            } else {
                content.classList.add('anim-fast', 'anim-fade-out');

                await new Promise(resolve => setTimeout(resolve, 150));

                content.classList.remove('anim-fast', 'anim-fade-out');
            }
        });

        return content;
    }



    createElement() {
        let accordion = document.createElement('details');

        this.addAttributes(accordion);
        this.addThemeClass(accordion);

        accordion.classList.add('accordion');
        if (this.props.locked) accordion.classList.add('locked');
        if (this.props.style) accordion.classList.add(this.props.style);

        accordion.appendChild(this.createElementSummary(accordion));
        accordion.appendChild(this.createElementContent(accordion));

        this.attachListeners(accordion);

        if (this.props.expanded) accordion.setAttribute('open', '');

        return accordion;
    }



    /**
     * Checks if the accordion is expanded
     * @returns {boolean} True if expanded, false otherwise
     */
    isExpanded() {
        return this.getElement().hasAttribute('open');
    }



    /**
     * Expands the accordion
     */
    expand() {
        this.getElement().setAttribute('open', '');
    }



    /**
     * Collapses the accordion
     */
    collapse() {
        this.getElement().removeAttribute('open');
    }



    /**
     * Toggles the accordion open/closed state
     */
    toggle() {
        this.getElement().toggleAttribute('open');
    }
}