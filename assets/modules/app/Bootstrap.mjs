import Component from "../kwui/components/Component.mjs";
import Anchor from "../kwui/components/controls/Anchor.mjs";
import Button from "../kwui/components/controls/Button.mjs";
import ButtonGroup from "../kwui/components/controls/ButtonGroup.mjs";
import Accordion from "../kwui/components/layout/accordion/Accordion.mjs";
import AccordionsContainer from "../kwui/components/layout/accordion/AccordionsContainer.mjs";

let app = document.getElementById('app');

let world = document.createElement('span');
world.textContent = "World!";

let anchor = new Anchor({
    props: {
        href: 'https://example.com',
        target: '_blank',
        shy: true
    },
    children: [
        "Hello, ",
        world
    ],
    theme: 'negative'
})

app.appendChild(anchor.render());

let a2 = new Anchor({
    props: {
        href: 'https://example.com',
        target: '_blank',
        shy: false
    },
    children: [
        "KWUI Anchor"
    ],
    theme: 'primary'
});

app.appendChild(a2.render());

let buttonSolid = new Button({
    props: {
        icon: '<i class="fa-solid fa-alarm-clock"></i>',
        style: 'solid'
    },
    children: [
        "Click Me!"
    ],
    theme: 'negative'
});

let buttonOutline = new Button({
    props: {
        icon: '<i class="fa-solid fa-bell"></i>',
        style: 'outline',
        cooldown: 2000,
        toggle: true
    },
    children: [
        "Notify Me!"
    ]
});


let buttonEmpty = new Button({
    props: {
        icon: '<i class="fa-regular fa-thumbs-up"></i>',
        toggledIcon: '<i class="fa-solid fa-thumbs-up"></i>',
        style: 'empty',
        cooldown: 1500,
        singleUse: true,
        toggle: true,
        toggledChildren: [
            "Liked"
        ]
    },
    children: [
        "Like"
    ],
    theme: 'positive'
});

buttonOutline.addEventListener('click', async () => {
    let iconEl = buttonOutline.getElement().querySelector('.icon');
    iconEl.classList.add('fa-shake');
    console.log(iconEl);

    await new Promise(resolve => setTimeout(resolve, 750));

    iconEl.classList.remove('fa-shake');
});


let group = new ButtonGroup({
    props: {
        buttons: [buttonSolid, buttonOutline, buttonEmpty],
        // style: 'solid',
        orientation: 'vertical',
        toggle: true,
        unique: true,
        cooldown: 2000,
        singleUse: false
    }
});

let accordion1 = new Accordion({
    props: {
        summary: a2,
        content: group,
        expandIconLocation: 'left',
        expanded: true
    },
    theme: 'warning'
});

app.appendChild(accordion1.render());

let accordionsContainer = new AccordionsContainer({
    props: {
        accordions: [
            new Accordion({
                props: {
                    summary: "Accordion 1",
                    content: "This is the content of accordion 1."
                }
            }),
            new Accordion({
                props: {
                    summary: "Accordion 2",
                    content: "This is the content of accordion 2.",
                }
            }),
            new Accordion({
                props: {
                    summary: "Accordion 3",
                    content: "This is the content of accordion 3.",
                }
            })
        ],
        alternateMarkLocations: true,
        firstMarkLocation: 'left',
        singleExpansion: true
    },
    theme: 'primary'
})

app.appendChild(accordionsContainer.render());