import Component from "../Component.mjs";
import Typography from "../display/Typography.mjs";
import CssVariables from "../misc/CssVariables.mjs";
import Button from "./Button.mjs";



export default class ButtonGroup extends Component {
    /**
     * Creates a ButtonGroup component
     * @param {Button[]} params.props.buttons The buttons to include in the group
     * @param {string} [params.props.style='solid'] The button style (solid, outline, empty)
     * @param {string} [params.props.orientation='horizontal'] The button group orientation (horizontal, vertical)
     * @param {boolean} [params.props.unique=true] Whether only one button can be active at a time
     * @param {number} [params.props.cooldown=0] The cooldown time (in ms) after clicking a button
     * @param {boolean} [params.props.toggle=false] Whether the buttons are toggle buttons
     */
    constructor({
        props = {
            buttons: [],
            orientation: 'horizontal',
            unique: true,
            style: 'solid',
            cooldown: 0,
            toggle: false
        },
        ...params
    }) {
        super({ props, ...params });

        if (this.props.style && !Button.componentStyles.includes(this.props.style)) {
            this.props.style = 'solid';
            console.warn(`ButtonGroup style "${this.props.style}" does not exist`);
        }

        if (this.props.orientation && !['horizontal', 'vertical'].includes(this.props.orientation)) {
            console.warn(`ButtonGroup orientation "${this.props.orientation}" does not exist`);
            this.props.orientation = 'horizontal';
        }
    }



    static get cssDependencies() {
        return [Button, Typography, CssVariables];
    }



    static get cssRules() {
        return [
            `.btn-group{display:inline-flex;margin-left:var(--inline-block-spacing);margin-right:var(--inline-block-spacing);}`,
            `.btn-group:not(.vertical) .btn:not(:first-child),.btn-group.horizontal .btn:not(:first-child){margin-left:0;border-top-left-radius:0;border-bottom-left-radius:0;}`,
            `.btn-group:not(.vertical) .btn:not(:last-child),.btn-group.horizontal .btn:not(:last-child){margin-right:0;border-top-right-radius:0;border-bottom-right-radius:0;}`,
            `.btn-group.vertical{flex-direction:column;}`,
            `.btn-group.vertical .btn:not(:first-child){margin-top:0;border-top-left-radius:0;border-top-right-radius:0;}`,
            `.btn-group.vertical .btn:not(:last-child){margin-bottom:0;border-bottom-left-radius:0;border-bottom-right-radius:0;}`
        ];
    }



    createElement() {
        let group = document.createElement('div');

        this.addAttributes(group);
        this.addThemeClass(group);

        group.classList.add('btn-group');
        if (this.props.orientation) group.classList.add(this.props.orientation);
        if (this.props.style) group.classList.add(this.props.style);

        for (let button of this.props.buttons) {
            if (this.theme) button.theme = this.theme;
            if (this.props.style) button.props.style = this.props.style;
            if (this.props.cooldown) button.props.cooldown = this.props.cooldown;
            if (this.props.singleUse) button.props.singleUse = this.props.singleUse;
            if (this.props.toggle) button.props.toggle = this.props.toggle;
            group.appendChild(button.render());
        }

        if (this.props.unique && this.props.toggle) {
            group.addEventListener('click', (event) => {
                for (let button of this.props.buttons) {
                    if (button.getElement() !== event.target && button.getElement().classList.contains('active')) {
                        button.getElement().classList.remove('active');
                    }
                }
            });
        }

        this.attachListeners(group);

        return group;
    }
}