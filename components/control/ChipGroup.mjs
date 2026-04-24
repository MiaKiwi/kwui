import StyleRegister from "../../StyleRegister.mjs";
import AbstractComponent from "../AbstractComponent.mjs"
import CSSVariables from "../core/CSSVariables.mjs";
import Text from "../core/typo/Text.mjs";
import Button from "./Button.mjs";
import Chip from "./Chip.mjs";



export default class ChipGroup extends AbstractComponent {
    /**
     * Creates a new component
     * @param {object} props Component properties
     * @param {string} props.orientation
     * @param {number} props.overflow
     * @param {boolean} props.showOverflow
     * @param {string[]|HTMLElement[]|AbstractElement[]} children Component children
     * @param {string} theme Component color theme
     * @param {string} id Component ID
     * @param {string[]} classes Component classes
     * @param {object} attributes Component attributes
     */
    constructor(props = {}, children = [], theme = null, id = null, classes = [], attributes = {}) {
        super(props, children, theme, id, classes, attributes);

        this.overflowIndicator = new Button({
            style: Button.styles.empty
        }, [`&bull;&bull;&bull;`], StyleRegister.themes.text, null, ["overflow-indicator", "text-muted"]);
        this.overflowIndicator.addListener("click", () => this.setProps({ showOverflow: !this.props.showOverflow }));
    }

    static orientations = {
        vertical: 'vertical',
        horizontal: 'horizontal',
    }

    static _defaultProps = {
        orientation: this.orientations.horizontal,
        overflow: -1,
        showOverflow: false
    }

    static validateProps(props) {
        return (
            typeof props.showOverflow === 'boolean' &&
            typeof props.orientation === 'string' &&
            Object.values(this.orientations).includes(props.orientation) &&
            typeof props.overflow === "number" && Number.isInteger(props.overflow) && (
                props.overflow === -1 || props.overflow > 0
            )
        )
    }

    static dependencies = [CSSVariables];

    static _rawStylingRules = [
        `.chip-group{display:inline-flex;flex-wrap:wrap;padding:var(--letter-spacing)}`,
        `.chip-group.vertical{flex-direction:column}`,
        `.chip-group>.overflow-indicator{align-self:center;padding:var(--letter-spacing);font-size:.75em}`
    ]

    get chips() { return this.children?.filter(c => c instanceof Chip) ?? []; }

    render() {
        let group = document.createElement("div");

        group.classList.add("chip-group", this.props.orientation, this.themeClass());

        this.attachChildren(group);
        this.attachListeners(group);

        this.updateOverflow();

        return group;
    }

    onMount() {
        super.onMount();
        this.updateOverflow();
    }

    onUnmount() {
        super.onUnmount();
        this.overflowIndicator.unmount();
    }

    onChildAdded(child) {
        super.onChildAdded(child);
        this.updateOverflow();
    }

    onChildRemoved(child) {
        super.onChildRemoved(child);
        this.updateOverflow();
    }

    updateOverflow() {
        if (this.props.showOverflow) {
            this.overflowIndicator?.setChildren([`&vellip;`])
        } else {
            this.overflowIndicator?.setChildren([`&bull;&bull;&bull;`])
        }

        if (!this.isMounted()) return;

        let overflowable = this.props.overflow > 0 && this.props.overflow < this.chips.length;
        let overflowShown = !overflowable || this.props.showOverflow;
        let visibleChipsCount = overflowShown ? this.chips.length : this.props.overflow;
        let visibleChips = this.chips?.slice(0, visibleChipsCount);
        let hiddenChips = this.chips?.slice(visibleChipsCount);

        // Make sure visible chips are shown
        visibleChips?.forEach(chip => {
            if (!chip.isMounted()) chip.mount(this.childrenContainer());
        });

        // Make sure hidden chips are hidden
        hiddenChips?.forEach(chip => {
            if (chip.isMounted()) chip.unmount();
        });

        // Show overflow indicator if needed
        this.overflowIndicator.unmount();
        if (overflowable) {
            this.overflowIndicator.mount(this.childrenContainer());
        }
    }

    onPropsChange(oldProps) {
        if (oldProps.overflow !== this.props.overflow || oldProps.showOverflow !== this.props.showOverflow) this.updateOverflow();

        if (this.isMounted() && JSON.stringify(this._props) !== JSON.stringify(oldProps)) {
            let i = this.i();

            if (oldProps.orientation !== this.props.orientation) {
                i.classList.remove(oldProps.orientation);
                if (this.props.orientation) i.classList.add(this.props.orientation);
            }
        }
    }

    onCreation() {
        super.onCreation();

        this.addListener('chip-close', (e) => {
            let dismissedChip = this.chips?.filter(c => c.id === e.target.id)[0];

            if (dismissedChip) {
                this.removeChild(dismissedChip);
                this.updateOverflow();
            }
        });
    }
}