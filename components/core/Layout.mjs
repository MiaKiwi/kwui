import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "./CSSVariables.mjs";



export default class Layout extends AbstractComponent {
    static _rawStylingRules = [
        `body{background-color:var(--bg);}`,
        `body,html{margin:0;padding:0;scroll-behavior:smooth;}`,
        `body{min-height:100vh;display:grid;}`,
        `body:has(.header){grid-template-rows:auto 1fr auto;}`,
        `body:not(:has(.header)){grid-template-rows:1fr auto;}`,
        `.main{max-width:80ch;width:100%;margin:0 auto;padding:var(--padding-md);}`,
        `.hero{background-color:var(--primary);color:var(--primary-fg);text-align:center;padding:var(--padding-md);padding-bottom:var(--padding-lg);}`,
        `.hero-title{font-size:3rem;margin:0;}`,
        `.hero-subtitle{font-size:1.5rem;margin:0;opacity:var(--muted-transparency);}`
    ];

    static dependencies = [CSSVariables];
}