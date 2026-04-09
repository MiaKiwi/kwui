import Icon from "./Icon.mjs";



export default class FontawesomeIcon extends Icon {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.name
     * @param {boolean} props.inline
     * @param {string} props.style
     * @param {string} props.family
     * @param {number} props.rotate
     * @param {string} props.size
     * @param {string} props.flip
     * @param {string} props.animation
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     */
    constructor(props = {}, children = [], theme = null, id = null) {
        super(props, children, theme, id);
    }

    static fa_styles = {
        solid: 'solid',
        regular: 'regular',
        light: 'light',
        thin: 'thin'
    }

    static fa_families = {
        brands: 'brands',
        classic: 'classic',
        duotone: 'duotone',
        sharp: 'sharp',
        sharp_duotone: 'sharp Duotone',
        chisel: 'chisel',
        etch: 'etch',
        graphite: 'graphite',
        jelly: 'jelly',
        notdog: 'notdog',
        slab: 'slab',
        thumbprint: 'thumbprint',
        utility: 'utility',
        whiteboar: 'whiteboard'
    }

    static fa_sizes = {
        xxs: '2xs',
        xs: 'xs',
        sm: 'sm',
        normal: null,
        lg: 'lg',
        xl: 'xl',
        xxl: '2xl'
    }

    static fa_flips = {
        horizontal: 'horizontal',
        vertical: 'vertical',
        both: 'both',
        none: null
    }

    static fa_animations = {
        beat: 'beat',
        beat_fade: 'beat-fade',
        bounce: 'bounce',
        fade: 'fade',
        flip: 'flip',
        shake: 'shake',
        spin: 'spin',
        spin_reverse: 'spin-reverse',
        spin_pulse: 'spin-pulse',
        none: null
    }

    static _defaultProps = {
        ...super._defaultProps,
        name: null,
        style: this.fa_styles.solid,
        family: this.fa_families.classic,
        rotate: 0,
        size: this.fa_sizes.normal,
        flip: this.fa_flips.none,
        animation: this.fa_animations.none,
        inline: false
    }

    static validateProps(props) {
        return (
            super.validateProps(props) &&
            typeof props.name === 'string' &&
            (
                typeof props.style === 'string' &&
                Object.values(this.fa_styles).includes(props.style)
            ) &&
            (
                typeof props.family === 'string' &&
                Object.values(this.fa_families).includes(props.family)
            ) &&
            (
                typeof props.rotate === 'number' &&
                props.rotate >= 0 && props.rotate < 360
            ) &&
            (
                props.animation === null || (
                    typeof props.animation === 'string' &&
                    Object.values(this.fa_animations).includes(props.animation)
                )
            ) &&
            (
                props.size === null || (
                    typeof props.size === 'string' &&
                    Object.values(this.fa_sizes).includes(props.size)
                )
            ) &&
            (
                props.flip === null || (
                    typeof props.flip === 'string' &&
                    Object.values(this.fa_flips).includes(props.flip)
                )
            )
        )
    }

    static _rawStylingRules = [
        `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css');`,
        `.icon.kw-{{theme}}{color:var(--{{theme}});}`
    ];

    static dependencies = [Icon];

    onPropsChange(oldProps) {
        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.name !== this.props.name) i.classList.remove(`fa-${oldProps.name}`); i.classList.add(`fa-${this.props.name}`);
            oldProps.inline !== this.props.inline && this.props.inline ? i.classList.add(`inline`) : i.classList.remove("inline");
            if (oldProps.style !== this.props.style) i.classList.remove(`fa-${oldProps.style}`); i.classList.add(`fa-${this.props.style}`);
            if (oldProps.family !== this.props.family) i.classList.remove(`fa-${oldProps.family}`); i.classList.add(`fa-${this.props.family}`);
            if (oldProps.size !== this.props.size) i.classList.remove(`fa-${oldProps.size}`); i.classList.add(`fa-${this.props.size}`);
            if (oldProps.animation !== this.props.animation) i.classList.remove(`fa-${oldProps.animation}`); i.classList.add(`fa-${this.props.animation}`);
            if (oldProps.rotate !== this.props.rotate) i.classList.remove(`fa-rotate-${oldProps.rotate}`); i.classList.add(`fa-rotate-${this.props.rotate}`);
            if (oldProps.flip !== this.props.flip) i.classList.remove(`fa-flip-${oldProps.flip}`); i.classList.add(`fa-flip-${this.props.flip}`);
        }
    }

    render() {
        let i = document.createElement("i");

        i.classList.add("icon", `fa-${this.props.name}`, "fa-icon", this.themeClass());
        if (this.props.inline) i.classList.add(`inline`);
        if (this.props.style) i.classList.add(`fa-${this.props.style}`);
        if (this.props.family) i.classList.add(`fa-${this.props.family}`);
        if (this.props.size) i.classList.add(`fa-${this.props.size}`);
        if (this.props.animation) i.classList.add(`fa-${this.props.animation}`);
        if (this.props.rotate) i.classList.add(`fa-rotate-${this.props.rotate}`);
        if (this.props.flip) i.classList.add(`fa-flip-${this.props.flip}`);

        return i;
    }
}