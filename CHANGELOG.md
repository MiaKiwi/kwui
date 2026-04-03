# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [STVP](https://mia.kiwi/projects/stvp).

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
