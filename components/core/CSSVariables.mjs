import AbstractComponent from "../AbstractComponent.mjs";



export default class CSSVariables extends AbstractComponent {
    static _rawStylingRules = [
        `:root{--letter-spacing:0.5em;--muted-transparency:0.75;--disabled-transparency:0.75;--border-roundness:0.5em;--box-shadow:rgba(0, 0, 0, 0.025) 0 6px 24px 0px, rgba(0, 0, 0, 0.028) 0 0 0 1px;--inline-block-spacing:0.25em;--border-thin-width:0.125em}`,
        `:root{--padding-min:0.1em;--padding-xxs:0.125em;--padding-xs:0.25em;--padding-sm:0.5em;--padding-md:1em;--padding-lg:1.5em;--padding-xl:2em}`,
        `:root{--transition-fast:150ms;--transition-medium:300ms;--transition-slow:500ms}`,
        `@media (prefers-reduce-motion: reduce) {:root{--transition-fast:0ms;--transition-medium:0ms;--transition-slow:0ms;}}`,
        `@media (prefers-color-scheme: dark) {:root{--box-shadow:none;}}`,
    ];
}