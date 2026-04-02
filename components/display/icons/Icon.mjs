import AbstractComponent from "../../AbstractComponent.mjs";
import CSSVariables from "../../core/CSSVariables.mjs";
import Typography from "../../core/Typography.mjs";



export default class Icon extends AbstractComponent {
    static _rawStylingRules = [
        `.icon.inline{display:inline;margin-inline-end:0.75ch;}`,
        `.icon.inline.right{margin-inline-end:initial;margin-inline-start:0.75ch;}`,
    ];

    static dependencies = [Typography, CSSVariables];
}