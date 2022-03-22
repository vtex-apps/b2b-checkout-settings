# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]


### Added

- Added the clear cart button and set the quoteId to 0

## [1.0.2] - 2022-02-24

### Fixed

- Apply `!important` to CSS rules to ensure appropriate payment methods are hidden

## [1.0.1] - 2022-02-23

### Fixed

- Update version number of sender app when performing graphQL queries
- Additional null checking in checkout6-custom.js

## [1.0.0] - 2022-02-22

### Added

- Admin panel to manage app settings

### Fixed

- Store app settings in vbase so that app can function as a dependency
- CSS for Create Quote button width

## [0.8.0] - 2022-02-18

### Added

- Created a quote button which goes to /b2b-quote/create flow
- Added a app setting to enable/disable the create a quote button at the checkout page

## [0.7.0] - 2022-02-18

### Added

- Added a new feature to check if the order form has a custom data property ("b2b-quotes-graphql") from quotes and then the items in the cart will be locked by .item-disabled css class which disables the pointer events from mouse/touch.

## [0.6.3] - 2022-02-04

### Fixed

- Correct payment methods will be displayed regardless of whether payment terms are shown as tabs or accordions, and regardless of whether this app's checkout JS runs before or after checkout-ui-custom's

## [0.6.2] - 2022-01-26

### Fixed

- Improve display of allowed payment methods

## [0.6.1] - 2022-01-06

### Added

- SonarCloud PR integration

## [0.6.0] - 2022-01-04

### Removed

- Custom Shipping section

### Added

- `window.b2bCheckoutSettings` to provide context to the checkout customizations

## [0.5.0] - 2021-12-21

### Added

- If a user's organization is "inactive" or "on hold", do not allow user to access checkout

## [0.4.0] - 2021-12-01

### Added

- Filter payment methods to show only allowed ones by the Organization

## [0.3.0] - 2021-11-29

### Added

- Don't allow buyer to checkout

## [0.2.0] - 2021-11-23

### Added

- Loads Cost Center addresses at the checkout page

## [0.1.0] - 2021-11-12

### Added

- PO Number option

## [0.0.1] - 2021-11-10

### Added

- App settings route
- Initial JS
