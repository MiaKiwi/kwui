import Component from "./Component.mjs";



export default class CssComponent extends Component {
    constructor({
        ...params
    }) {
        super(...params);
    }



    createElement() {
        throw new Error("This is a style-only component and cannot be instantiated.");
    }
}