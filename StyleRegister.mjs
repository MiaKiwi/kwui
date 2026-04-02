export default class StyleRegister {
    constructor(styleTagID = "kw-comp-css") {
        this._styleTagID = styleTagID;
        this._register = new Set();
    }

    getRegister() { return this._register; }

    register(component) {
        if (!this.isRegistered(component)) {
            let dependencies = component.deepDependencies || [];
            dependencies.forEach(dependency => {
                if (!this.isRegistered(dependency)) {
                    this._register.add(dependency);
                }
            });

            this._register.add(component);

            this.apply();
        }
    }

    unregister(component) {
        this._register.delete(component);

        this.apply()
    }

    isRegistered(component) {
        return this._register.has(component);
    }

    apply() {
        let rules = [];

        this._register.forEach(component => {
            rules.push(...component.stylingRules);
        });

        rules = rules.sort((a, b) => {
            if (a.startsWith("@import") && !b.startsWith("@import")) return -1;
            if (!a.startsWith("@import") && b.startsWith("@import")) return 1;
            return 0;
        });

        let styleTagID = this._styleTagID;
        let styleTag = document.getElementById(styleTagID);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleTagID;
            document.head.appendChild(styleTag);
        }

        styleTag.innerHTML = rules.join("");
    }
}