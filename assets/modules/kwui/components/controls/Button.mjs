import Fontawesome from "../basic/icons/Fontawesome.mjs";
import Component from "../Component.mjs";
import Typography from "../display/Typography.mjs";
import CssVariables from "../misc/CssVariables.mjs";



export default class Button extends Component {
    /**
     * Creates a Button component
     * @param {string} params.props.icon The button icon (<i> tag or Fontawesome classes string)
     * @param {string} [params.props.style='solid'] The button style (solid, outline, empty)
     * @param {number} [params.props.cooldown=0] The cooldown time (in ms) after clicking the button
     * @param {boolean} [params.props.singleUse=false] Whether the button can only be used once
     * @param {boolean} [params.props.toggle=false] Whether the button is a toggle button
     * @param {string|Component[]} [params.props.toggledChildren=null] The children to display when toggled (for toggle buttons)
     * @param {string|Component} [params.props.toggledIcon=null] The icon to display when toggled (for toggle buttons)
     * @param {string} [params.props.iconLocation='left'] The location of the icon (left or right)
     */
    constructor({
        props = {
            icon: null,
            style: 'solid',
            cooldown: 0,
            singleUse: false,
            toggle: false,
            toggledChildren: null,
            toggledIcon: null,
            iconLocation: 'left'
        },
        ...params
    }) {
        super({ props, ...params });

        if (this.props.style && !this.constructor.componentStyles.includes(this.props.style)) {
            console.warn(`Button style "${this.props.style}" does not exist`);
            this.props.style = 'solid';
        }

        if (this.props.iconLocation && !this.constructor.iconLocations.includes(this.props.iconLocation)) {
            console.warn(`Button icon location "${this.props.iconLocation}" does not exist`);
            this.props.iconLocation = this.constructor.iconLocations[0];
        }
    }



    static get iconLocations() {
        return [
            'left',
            'right'
        ];
    }



    static get componentStyles() {
        return [
            'solid',
            'outline',
            'empty'
        ];
    }



    static get cssDependencies() {
        return [Typography, Fontawesome, CssVariables];
    }



    static get cssRules() {
        return [
            `.btn{--btn-pad-v:var(--padding-sm);--btn-pad-h:var(--padding-md);--btn-interact-translateY:0.1em;--btn-icon-margin:0.5em;--btn-bg:var(--primary);--btn-fg:var(--primary-fg);--btn-active-bg:var(--primary-10);--btn-active-fg:var(--primary-90);background-color:var(--btn-bg);color:var(--btn-fg);display:inline-block;padding:var(--btn-pad-v) var(--btn-pad-h);text-decoration:none;border-radius:var(--border-roundness);transition:all 0.2s ease-in-out;border:none;cursor:pointer;user-select:none;margin-top:0.1em;margin-bottom:0.1em;margin-left:var(--inline-block-spacing);margin-right:var(--inline-block-spacing);}`,
            `.btn:hover,.btn:focus{transform:translateY(calc(-1 * var(--btn-interact-translateY)));}`,
            `.btn:not(.disabled):not(:disabled):active,.btn.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);transform:translateY(var(--btn-interact-translateY));}`,
            `.btn:not(.icon-right)>.icon{margin-right:var(--btn-icon-margin);}`,
            `.btn.icon-right>.icon{margin-left:var(--btn-icon-margin);}`,
            `.btn.icon-only{padding:min(var(--btn-pad-v), var(--btn-pad-h));}`,
            `.btn.icon-only>.icon{margin:0;}`,
            `.btn.kw-{{theme}}{--btn-bg:var(--{{theme}});--btn-fg:var(--{{theme}}-fg);--btn-active-bg:var(--{{theme}}-10);--btn-active-fg:var(--{{theme}}-90);}`,
            `.btn.outline{background-color:transparent;color:var(--btn-bg);border:var(--border-thin-width) solid var(--btn-bg);padding:calc(var(--btn-pad-v) - var(--border-thin-width)) calc(var(--btn-pad-h) - var(--border-thin-width));}`,
            `.btn.outline:not(.disabled):not(:disabled):active,.btn.outline.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);border-color:var(--btn-active-bg);}`,
            `.btn.empty{background-color:transparent;color:var(--btn-bg);}`,
            `.btn.empty:not(.disabled):not(:disabled):active,.btn.empty.active{background-color:var(--btn-active-bg);color:var(--btn-active-fg);}`,
            `.btn.disabled,.btn:disabled{opacity:var(--disabled-transparency);cursor:not-allowed;transform:none;}`
        ];
    }



    createElement() {
        let btn = document.createElement('button');

        this.addAttributes(btn);
        this.addThemeClass(btn);

        btn.classList.add('btn');
        if (this.props.style) btn.classList.add(this.props.style);

        if (this.props.cooldown > 0) {
            let cooldown = this.props.cooldown;
            this.addEventListener('click', async () => {
                btn.disabled = true;
                await new Promise(resolve => setTimeout(resolve, cooldown));
                if (!this.props.singleUse) btn.disabled = false;
            });
        }

        if (this.props.singleUse) {
            this.addEventListener('click', () => {
                btn.disabled = true;
            });
        }

        if (this.props.toggle) {
            this.addEventListener('click', () => {
                btn.classList.toggle('active');

                if (this.props.toggledChildren) {
                    let isActive = btn.classList.contains('active');
                    let children = isActive ? this.props.toggledChildren : this.children;
                    btn.innerHTML = '';
                    this.attachChildren(btn, this.getHtmlChildren(children));
                }
                if (this.props.toggledIcon) {
                    let isActive = btn.classList.contains('active');
                    let iconHtml = isActive ? this.props.toggledIcon : this.props.icon;
                    let icon = Fontawesome.createIcon(iconHtml);
                    let existingIcon = btn.querySelector('.icon');
                    if (existingIcon) {
                        btn.replaceChild(icon, existingIcon);
                    } else {
                        if (this.props.iconLocation === 'right') {
                            btn.appendChild(icon);
                        } else {
                            btn.prepend(icon);
                        }
                    }
                }
            });
        }

        this.attachChildren(btn);
        this.attachListeners(btn);

        if (this.props.icon) {
            let icon = Fontawesome.createIcon(this.props.icon);
            btn.classList.add(`icon-${this.props.iconLocation || 'left'}`);

            if (this.props.iconLocation === 'right') {
                btn.appendChild(icon);
            } else {
                btn.prepend(icon);
            }

            if (this.children.length === 0) btn.classList.add('icon-only');
        }

        return btn;
    }
}