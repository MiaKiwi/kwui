# Kiwi User Interface Components Library

_**kiwi.mia.0035** — KWUI_

Hi!

Welcome to the Kiwi user interface components library (KWUI), a project born out of my usual saying:

> "Why use something someone else made, if I can do it myself and learn how it works along the way?!"

## What is it?

KWUI is a standalone HTML UI components library. It lets you build UIs dynamically with Javascript without having to write raw HTML strings or redefine components over and over again.

You just need a static page? That works too! Build your UI as you like with code, then copy the page HTML and you're done! The style for all the components you use is included in the `head` tag of your page (some dynamic functionalities like event listeners might break though, but it's a good starting point at least).

## How does it work?

Simple! Include the module files in your project (e.g. at `/assets/modules/kwui/...`) and you can now use KWUI!

### Instancing a new component

All components take the same parameters:

```javascript
new WhateverComponentYouWant(
    {},                 // props:    An object with the properties of the component.
                        //           Some components may have required or default
                        //           properties, you can ignore them (use their
                        //           fallback value) or overwrite them; they will be
                        //           validated by the component anyway.
                        //           Of course, you may also include properties of
                        //           your own for custom functionalities.
    [],                 // children: The content of the component, can be other
                        //           components, `HTMLElement`s, or HTML strings
    "primary",          // theme:    The theme of the component. Possible themes
                        //           are stored in the `_themes` static property.
    "component-1234"    // id:       A custom ID for the component's instance.
    []                  // classes:  A list of classes to apply to the component's instance.
);
```

### Creating your own component

To create your own component, you can either extend the `AbstractComponent` class, or another existing component.

New components should at least implement the `render()` method which returns an `HTMLElement` instance. This is where components define how instances (shown in the document) are assembled.

## Examples

Create a button and mount it to the body:

```javascript
import Button from "./assets/modules/kwui/components/control/Button.mjs";

let button = new Button({
    style: Button.styles.solid
}, [
    "I'm a button!"
], "primary");

button.mount(document.body);
```

Want to add dynamic changes to it? Easy!

```javascript
import Button from "./assets/modules/kwui/components/control/Button.mjs";

let button = new Button({
    counter: 0,
    cooldown: 200
}, [
    "Counter: 0"
], "primary");

button.addListener("click", () => {
    button.setProps({ counter: button.props.counter + 1 });
    button.setChildren([`Counter: ${button.props.counter}`]);
});

button.mount(document.body);
```