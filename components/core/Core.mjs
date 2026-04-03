import AbstractComponent from "../AbstractComponent.mjs";
import Animations from "./Animations.mjs";
import Layout from "./Layout.mjs";
import CSSVariables from "./CSSVariables.mjs";
import Typography from "./Typography.mjs";



export default class Core extends AbstractComponent {
    static _rawStylingRules = [
        `*,*::before,*::after {box-sizing: border-box;}`,
        `.block-center{display:block;margin-left:auto;margin-right:auto;}`,
        `.full-width{width:100%}`
    ];

    static dependencies = [CSSVariables, Animations, Typography, Layout];
}