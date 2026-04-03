import AbstractComponent from "../AbstractComponent.mjs";
import CSSVariables from "./CSSVariables.mjs";



export default class Typography extends AbstractComponent {
    static _rawStylingRules = [
        `@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');`,
        `:root{--font-sans:'Noto Sans', sans-serif;--font-serif:'Noto Serif', serif;--font-mono:'Noto Sans Mono', monospace;--font-weight-light:300;--font-weight-regular:400;--font-weight-medium:500;--font-weight-bold:700;--font-family:var(--font-sans), var(--font-serif), var(--font-mono);}`,
        `html,body{font-variant-numeric:slashed-zero;font-family:var(--font-family);font-weight:var(--font-weight-regular);font-size:100%;line-height:1.5;color:var(--text);}`,
        `.text-{{theme}}{color:var(--{{theme}});}`,
        `.text-size-normal{font-size:100%;}`,
        `h1,h2,h3,h4,h5,h6,.text-h1,.text-h2,.text-h3,.text-h4,.text-h5,.text-h6{font-weight:var(--font-weight-bold);}`,
        `h1,.text-h1,.text-huge{font-size:2.489em;}`,
        `h2,.text-h2,.text-xxxl{font-size:2.074em;}`,
        `h3,.text-h3,.text-xxl{font-size:1.728em;}`,
        `h4,.text-h4,.text-xl{font-size:1.44em;}`,
        `h5,.text-h5,.text-l{font-size:1.2em;}`,
        `h6,.text-h6{font-size:1em;}`,
        `small,.text-s{font-size:0.833em;}`,
        `.text-strong,.text-bold,strong{font-weight:var(--font-weight-bold);}`,
        `em,i,.text-italic{font-style:italic;}`,
        `u,.text-underline{text-decoration:underline;}`,
        `code,.text-mono{font-family:var(--font-mono);}`,
        `.text-serif{font-family:var(--font-serif);}`,
        `.text-sans{font-family:var(--font-sans);}`,
        `.text-muted{opacity:var(--muted-transparency);}`,
        `.text-center{text-align:center;}`,
        `.text-right{text-align:right;}`,
        `.text-left{text-align:left;}`,
        `.text-justify{text-align:justify;}`
    ];

    static dependencies = [CSSVariables];
}