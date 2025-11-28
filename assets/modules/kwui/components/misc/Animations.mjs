import CssComponent from "../CssComponent.mjs";
import CssVariables from "./CssVariables.mjs";



export default class Animations extends CssComponent {
    constructor({
        ...params
    }) {
        super(params);
    }



    static get cssDependencies() {
        return [CssVariables];
    }



    static get cssRules() {
        let rules = [
            `.anim-fast{--anim-duration:var(--transition-fast);}`,
            `.anim-medium{--anim-duration:var(--transition-medium);}`,
            `.anim-slow{--anim-duration:var(--transition-slow);}`,
            `.anim-fade-in{animation:fadeIn var(--anim-duration) ease forwards;}`,
            `.anim-fade-out{animation:fadeOut var(--anim-duration) ease forwards;}`,
            `.anim-rotate{animation:rotateAnim var(--anim-duration) ease forwards;}`,
            `.anim-grow-down{animation:growDown var(--anim-duration) ease forwards;}`,
            `.anim-shrink-up{animation:shrinkUp var(--anim-duration) ease forwards;}`,
            `@keyframes growDown{0%{transform:scaleY(0);transform-origin:top;}100%{transform:scaleY(1);transform-origin:top;}}`,
            `@keyframes shrinkUp{0%{transform:scaleY(1);transform-origin:top;}100%{transform:scaleY(0);transform-origin:top;}}`,
            `@keyframes fadeIn{0%{opacity:0;}100%{opacity:1;}}`,
            `@keyframes fadeOut{0%{opacity:1;}100%{opacity:0;}}`,
            `@keyframes rotateAnim{0%{transform:rotate(0deg);}100%{transform:rotate(180deg);}}`
        ];

        return rules;
    }
}