# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Feat

- Displays the create quota button according to the value of the create quota permission

## [1.11.3] - 2024-07-15

### Fixed

- Adjust payment terms on cost center

## [1.11.2] - 2024-06-12

### Fixed

- Provide correct tokens to clients

### Fixed

- Add catalog-info.yaml

## [1.11.1] - 2023-12-15

### Fixed

- Adjust sender app name and token to call check user permission

## [1.11.0] - 2023-11-30

### Added

- Add a token to call graphql queries for the client of storefront-permission and b2b-organizations-graphql

## [1.10.1] - 2023-08-17
### Fixed
- Fix conditional chain causing issue when retrieving Cost Center data

## [1.10.0] - 2023-08-04
### Fixed
- Remove instore-custom files

## [1.9.6] - 2023-07-12
### Fixed
- Use payment terms from the cost center when it is configured instead of the organization

## [1.9.5] - 2023-06-30
### Fixed
- Added semicolon to checkout ui custom

## [1.9.4] - 2023-06-28

## [1.9.3] - 2023-06-12

### Fix
- Set settings back in payment step if don't exist

### Fix
- Destroy checkout object if user is not logged in

## [1.9.2] - 2023-06-08

### Added
- Add validation to remove the b2bCheckoutSettings Object if user has permission to change address

## [1.9.1] - 2023-05-22

### Fix
- Remove validation after retrieving cost center information

## [1.9.0] - 2023-05-19

### Added
- Add reference in addresses to the b2bCheckoutSettings object

## [1.8.0] - 2023-05-10
### Added
- Add new configuration to let user create address in checkout

## [1.7.0] - 2023-04-26

### Added

- Added cost center custom field to the settings backend

## [1.6.0] - 2023-04-17
### Added
- Addded customFields to the b2bCheckoutSettings object

## [1.5.1] - 2023-04-17

### Fixed
- Fix issue when quotes-graphql isn't available

### Removed
- [ENGINEERS-1247] - Disable cypress tests in PR level

## [1.5.0] - 2023-04-06

### Fixed
- Marketing data isn't always present, so it sometimes fails when checkout.marking data is being validated

### Changed

- Run schedule job only on saturday

## [1.4.4] - 2023-03-02

### Changed

- Cypress improvements

### Added

- Cypress E2E automations tests.

### Added

- GitHub dispatch workflow

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

### Fixed

- Add a semicolon at end of checkou6-custom.js to not break functionalities from `checkout ui custom` when using webpack together
