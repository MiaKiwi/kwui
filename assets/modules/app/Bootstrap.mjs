import Avatar from "../kwui/components/basic/Avatar.mjs";
import Chip from "../kwui/components/basic/Chip.mjs";
import Fontawesome from "../kwui/components/basic/icons/Fontawesome.mjs";
import Component from "../kwui/components/Component.mjs";
import Anchor from "../kwui/components/controls/Anchor.mjs";
import Button from "../kwui/components/controls/Button.mjs";
import ButtonGroup from "../kwui/components/controls/ButtonGroup.mjs";
import Accordion from "../kwui/components/layout/accordion/Accordion.mjs";
import AccordionGroup from "../kwui/components/layout/accordion/AccordionGroup.mjs";
import Callout from "../kwui/components/layout/Callout.mjs";
import BreadcrumbItem from "../kwui/components/navigation/breadcrumbs/BreadcrumbItem.mjs";
import Breadcrumbs from "../kwui/components/navigation/breadcrumbs/Breadcrumbs.mjs";

let app = document.getElementById('app');

let world = document.createElement('span');
world.textContent = "World!";

let anchor = new Anchor({
    props: {
        href: 'https://example.com',
        // target: '_blank',
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
        ],
        iconLocation: 'right'
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

let iconBtn = new Button({
    props: {
        icon: '<i class="fa-solid fa-cog"></i>',
        style: 'solid',
        cooldown: 1000
    },
    theme: 'primary'
});

app.appendChild(iconBtn.render());


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

let accordionsContainer = new AccordionGroup({
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

let avatarText = new Avatar({
    props: {
        content: Fontawesome.createIcon('<i class="fa-solid fa-user-astronaut"></i>'),
        shape: 'rounded',
        inline: true
    },
    theme: 'primary'
});

let avatarImg = new Avatar({
    props: {
        content: "SA",
        src: 'https://placehold.co/400',
        alt: 'Placeholder Image',
        shape: 'circle'
    }
});

app.appendChild(avatarImg.render());

let p = document.createElement('p');
p.appendChild(avatarText.render());
p.appendChild(document.createTextNode("This is an avatar with an icon as content."));
app.appendChild(p);

let breadcrumbs = new Breadcrumbs({
    props: {
        separator: '<i class="fa-solid fa-chevron-right"></i>',
        items: [
            new BreadcrumbItem({
                props: {
                    content: ['Home'],
                    href: '/'
                }
            }),
            new BreadcrumbItem({
                props: {
                    content: ['Products'],
                    href: '/products'
                }
            }),
            new BreadcrumbItem({
                props: {
                    content: ['Electronics'],
                    href: '/electronics'
                }
            })
        ]
    }
});

app.appendChild(breadcrumbs.render());

let defaultCallout = new Callout({
    props: {
        style: 'default'
    },
    children: [
        "This is a default callout."
    ]
});

app.appendChild(defaultCallout.render());

let importantCallout = new Callout({
    props: {
        style: 'important'
    },
    children: [
        "This is an important callout!"
    ]
});

app.appendChild(importantCallout.render());

let infoCallout = new Callout({
    props: {
        style: 'info'
    },
    children: [
        "This is an info callout."
    ]
});

app.appendChild(infoCallout.render());

let successCallout = new Callout({
    props: {
        style: 'success'
    },
    children: [
        "This is a success callout!"
    ]
});

app.appendChild(successCallout.render());

let warningCallout = new Callout({
    props: {
        style: 'warning'
    },
    children: [
        "This is a warning callout."
    ]
});

app.appendChild(warningCallout.render());

let dangerCallout = new Callout({
    props: {
        style: 'danger'
    },
    children: [
        "This is a danger callout!",
        "Yep"
    ]
});

app.appendChild(dangerCallout.render());

let defaultChip = new Chip({
    children: [
        "Default Chip"
    ]
});

app.appendChild(defaultChip.render());

let roundedChip = new Chip({
    props: {
        shape: 'rounded',
        icon: Fontawesome.createIcon('fa-solid fa-check'),
        closeable: true
    },
    children: [
        "Rounded Chip"
    ],
    theme: 'positive'
});

roundedChip.addEventListener('chip-close', (e) => {
    alert("Rounded Chip was closed!");
});

app.appendChild(roundedChip.render());

let squareChip = new Chip({
    props: {
        shape: 'square',
        icon: Fontawesome.createIcon('fa-solid fa-info-circle'),
        closeable: false
    },
    children: [
        "Square Chip"
    ],
    theme: 'info'
});

app.appendChild(squareChip.render());

let inlineChip1 = new Chip({
    props: {
        icon: Fontawesome.createIcon('fa-solid fa-user'),
        inline: true
    },
    children: [
        "Inline Chip 1"
    ],
    theme: 'primary'
});

let inlineChip2 = new Chip({
    props: {
        icon: Fontawesome.createIcon('fa-solid fa-cog'),
        inline: true
    },
    children: [
        "Inline Chip 2"
    ],
    theme: 'warning'
});

app.appendChild(inlineChip1.render());
app.appendChild(inlineChip2.render());

let linkChip = new Chip({
    props: {
        icon: Fontawesome.createIcon('fa-solid fa-link')
    },
    children: [
        new Anchor({
            props: {
                href: 'https://example.com',
                target: '_blank',
                shy: true
            },
            children: ["Link Chip"]
        })
    ],
    theme: 'primary'
});

app.appendChild(linkChip.render());