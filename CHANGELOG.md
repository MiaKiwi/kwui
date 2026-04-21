# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [STVP](https://mia.kiwi/projects/stvp).

## [26.3.20] - 2026-04-21

### Added

- `findComponentByID()` method to find a component from an ID

### Changed

- Callout styling
- Toast timers are reset when the toast manager is not mounted
- Already mounted components are unmounted first when `mount()` is called, instead of just exiting
- Children are detached when their parent is unmounted

### Fixed

- Toast timer unpaused when a nested element is hovered
- `detachChildren()` not actually unmounting component instances



## [26.3.19] - 2026-04-20

### Added

- Toast
- Toast manager. Please use the toast manager to show toasts, not the toast component directly



## [26.3.18] - 2026-04-17

### Added

- Dynamic button group props change handler
- Chip group
- Borderless accordion style

### Changed

- Enabled bubbling on 'chip-close' event of chip component
- .text-md from 100% to 1rem
- Made avatar image hide text, useful for fallback text if the image fails to load

### Fixed

- Avatar props change handler
- Avatar vertical alignment when empty
- Borderless card style not applying on render



## [26.3.17] - 2026-04-13

### Added

- Components registry



## [26.3.16] - 2026-04-10

### Added

- Loader



## [26.3.15] - 2026-04-10

### Added

- Callout
- Tooltip

### Fixed

- Fontawesome icon props update conditions



## [26.3.14] - 2026-04-10

### Added

- `classes` parameter for components, so classes can be added before the component is mounted, and remain persistent across renderings



## [26.3.13] - 2026-04-10

### Added

- `prepend` parameter to `mount()` method of `AbstractComponent` to mount a component at the start of the parent
- `command` and `commandFor` properties to button
- Spacing between unjoined buttons in button groups
- Dialog
- Modal



## [26.3.12] - 2026-04-10

### Added

- Avatar group
- Card header
- `inline` property to headings

### Changed

- Saved around 170 characters when all styles loaded by removing trailing semicolons



## [26.3.11] - 2026-04-09

### Added

- `themes` static property to `StyleRegister` to easily access themes
- Built-in plus/minus accordion summary. Show a plus sign when closed and a minus sign when opened
- 'Subtle' variant to anchors where text isn't underlined unless hovered, active, or focused
- Avatar

### Changed

- `text-size-normal` to `text-md`
- Added actual props change handling to Fontawesome icons, instead of rerendering the whole thing



## [26.3.10] - 2026-04-06

### Added

- `onCreation` method to `AbstractComponent`, called when new instance is, well..., instantiated
- `clone` method to `AbstractComponent` to make a deep clone of a component
- `isHTMLCompatible` to check if an input is HTML-ish
- Accordion
- Accordion group
- Style dependency to breadcrumbs component

### Removed

- Stray `console.log` in button component



## [26.3.9] - 2026-04-06

### Added

- Breadcrumbs

### Changed

- `Text` properties change handler
- Anchor styling



## [26.3.8] - 2026-04-05

### Added

- Roadmap

### Changed

- Readme



## [26.3.7] - 2026-04-05

### Added

- Button shapes



## [26.3.6] - 2026-04-04

### Added

- Card
- Card footer
- Card group



## [26.3.5] - 2026-04-04

### Added

- Added props to button

### Changed

- `themeClass` to method to get class name for another theme
- Dynamic theme class editing when changing component theme, instead of rerendering



## [26.3.4] - 2026-04-04

### Added

- Anchor
- Default theme 'text'
- Typography components

### Changed

- Renamed `body` component to `layout`



## [26.3.3] - 2026-04-03

### Changed

- Children updates don't rerender the whole component anymore



## [26.3.2] - 2026-04-03

### Added

- Chip
- Icon-only button styling



## [26.3.1] - 2026-04-03

### Added

- Event listening system for components. Automatically added and removed
- Event listeners and rerenders for changes in props, theming, children, and event listeners

### Removed

- `unregister` method of `StyleRegister` to avoid removing styling of components still in use. Will add again later



## [26.3.0] - 2026-04-02

### Added

- Style registry
- Random ID provider
- Fontawesome icons component
- Core components
- Button component
- Buttons group component

### Breaking

- Reworked entire system. Components will come back little by little



## [25.2.4] - 2025-12-11

### Added

- Typography static methods for text components
- JSDoc comment for Chip component constructor
- Option to 'unjoin' buttons in group
- Card component
- Card group component



## [25.2.3] - 2025-12-05

### Added

- Chips component

### Changed

- Made icon-only buttons have smaller padding



## [25.2.2] - 2025-11-29

### Added

- Callout component



## [25.2.1] - 2025-11-28

### Added

- Button icon location parameter (left or right)
- Static method `getInputAsHTMLElement` to `Component`
- Icon buttons
- Breadcrumbs

### Changed

- Renamed `AccordionsContainer` to `AccordionGroup`



## [25.2.0] - 2025-11-28

### Added

- Abstract component
- CSS component
- Fontawsome icons component
- Anchor component
- Button component
- Button group component
- Accordion component
- Accordion group component
- Animations component
- CSS variables component
