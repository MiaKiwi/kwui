import Component from "../Component.mjs";
import Button from "../controls/Button.mjs";
import CssVariables from "../misc/CssVariables.mjs";
import Fontawesome from "./icons/Fontawesome.mjs";



export default class Chip extends Component {
    /**
     * Creates a Chip component
     * @param {string} params.props.closeable Whether the chip has a close button
     * @param {string} params.props.shape The chip shape (circular, square, rounded)
     * @param {string} params.props.inline Whether the chip is displayed inline
     * @param {string|HTMLElement} params.props.icon The chip icon
     * @param {object} params.props.customColors Custom colors for the chip (bg, fg, border)
     * @param {string} params.props.customColors.bg The custom background color
     * @param {string} params.props.customColors.fg The custom foreground color
     * @param {string} params.props.customColors.border The custom border color
     */
    constructor({
        props = {
            closeable: false,
            shape: 'circular',
            inline: false,
            icon: null,
            customColors: {
                bg: null,
                fg: null,
                border: null
            }
        },
        ...params
    }) {
        super({ props, ...params });

        if (this.props.shape && !this.constructor.componentStyles.includes(this.props.shape)) {
            console.warn(`Chip shape "${this.props.shape}" does not exist`);
            this.props.shape = this.constructor.componentStyles[0];
        }
    }



    static get componentStyles() {
        return [
            'circular',
            'square',
            'rounded'
        ];
    }



    static get cssDependencies() {
        return [CssVariables, Button];
    }



    static get cssRules() {
        return [
            `.chip{--chip-font-size:0.75em;--chip-border-radius:var(--border-roundness);--chip-bg:var(--primary-90);--chip-fg:var(--primary-10);--chip-border:var(--primary);display:flex;align-items:center;gap:var(--letter-spacing);padding:var(--padding-xs) var(--padding-sm);background-color:var(--chip-bg);color:var(--chip-fg);border:var(--border-thin-width) solid var(--chip-border);border-radius:var(--chip-border-radius);box-shadow:var(--box-shadow);width:max-content;margin:var(--padding-xs);font-size:var(--chip-font-size);}`,
            `.chip.circular{--chip-border-radius:9999em;}`,
            `.chip.square{--chip-border-radius:0;}`,
            `.chip.rounded{--chip-border-radius:0.5em;}`,
            `.chip.inline{display:inline-flex;margin:0;;margin-left:var(--inline-block-spacing);}`,
            `.chip.kw-{{theme}}{--chip-bg:var(--{{theme}}-90);--chip-fg:var(--{{theme}}-10);--chip-border:var(--{{theme}});}`
        ];
    }



    createElement() {
        let chip = document.createElement('div');

        this.addAttributes(chip);
        this.addThemeClass(chip);

        chip.classList.add('chip');
        if (this.props.inline) chip.classList.add('inline');
        let shape = this.props.shape || 'circular';
        chip.classList.add(shape);

        // Add icon
        if (this.props.icon) {
            let icon = Component.getInputAsHTMLElement(this.props.icon);
            icon.classList.add('chip-icon');
            chip.appendChild(icon);
        }

        this.attachChildren(chip);
        this.attachListeners(chip);

        // Add close button
        if (this.props.closeable) {
            let closeButton = new Button({
                props: {
                    icon: Fontawesome.createIcon('fa-solid fa-xmark'),
                    style: 'empty'
                },
                theme: this.theme
            });

            closeButton.addEventListener('click', (e) => {
                chip.remove();

                // Trigger chip-close event
                let event = new CustomEvent('chip-close', {
                    detail: {
                        originalEvent: e
                    }
                });
                chip.dispatchEvent(event);
            });

            chip.appendChild(closeButton.render());
        }

        return chip;
    }
}