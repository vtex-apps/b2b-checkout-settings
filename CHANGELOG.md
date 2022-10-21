# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- GitHub reusable workflow uptaded to v2

## [1.4.3] - 2022-09-15

### Fixed

- Show all Shipping and Payment sections for non-B2B users

## [1.4.2] - 2022-09-15

### Fixed

- Allow non-B2B users to access checkout when B2B Checkout Settings app is installed

## [1.4.1] - 2022-07-19

### Added

- Added @checkAdminAccess @cacheControl directives.
- Added resolvers/constants file.
- Separate Queries, Mutations, Routes and Directives in it's own folder.
- Separate file for Routes queries.

## [1.4.0] - 2022-07-11

### Added

- Bulgarian, Dutch, French, Italian, Japanese, Korean, Portuguese Romanian, Spanish and Thai translations.

### Fixed

- English translations.

## [1.3.5] - 2022-07-04

### Added

- Initial Crowdin integration

## [1.3.4] - 2022-06-29

### Fixed

- Fixed bug returning `User not authenticated` error for logged in users when getting `b2b-checkout-settings` in production domains

## [1.3.3] - 2022-06-07

### Added

- Added Spanish translations

### Fixed

- Fixed bug preventing PO Number field from displaying in locales without translations. Default to English if translation for locale is not available
- Fixed bug to set `hasPONumber` to `true` if orderForm has already been configured to accept `purchaseOrderNumber` field

## [1.3.2] - 2022-06-03

### Fixed

- Fixed the bug related to the quantity when the order comes from quotes.

## [1.3.1] - 2022-04-21

### Fixed

- Fixed a bug on checking impersonation email expiration

## [1.3.0] - 2022-04-15

### Added

- added an expiration time (5 minutes) for b2b-checkout-settings sessionStorage item

## [1.2.0] - 2022-04-02

### Fixed

- Use different method to show/hide appropriate payment methods to support internationalized payment method labels

## [1.1.2] - 2022-03-28

### Fixed

- If user does not have marketing data (organization and cost center IDs) set in their orderForm at time of checkout, set it

## [1.1.1] - 2022-03-25

### Added

- Adjust checkout JS to support showing the `Credit card` payment method

## [1.1.0] - 2022-03-25

### Added

- Added the clear cart button and set the quoteId to 0

## [1.0.4] - 2022-03-23

### Fixed

- Updated README.md file with correct image links

## [1.0.3] - 2022-03-22

### Changed

- Reviewed the README.md file

### Added

- docs/images folder and its files to illustrate the documentation

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
