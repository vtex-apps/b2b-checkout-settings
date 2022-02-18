# B2B Checkout Settings

The B2B Checkout Settings app is responsible for extending your checkout experience with B2B functionalities provided by the B2B Organizations app

This App is part of the [B2B Store Edition](https://github.com/vtex/b2b-store-edition), installing it without the related Apps may not result in a good experience

## Functionalities

- List Cost Center Addresses
- Enable PO Number
- Block checkout based on user's privilegies
- Enable the 'Create a Quote' button at the checkout page

## Configuration

[Install](https://vtex.io/docs/recipes/development/installing-an-app/) this app by running `vtex install vtex.b2b-checkout-settings` in your terminal.

To change app settings, navigate to the `B2B Checkout Settings` admin panel in your VTEX admin (available at the path `/admin/b2b-checkout-settings/`).

The available settings are:

- `Show Purchase Order Number Field`: Enabling this will add a `PO Number` input field to checkout
- `Show 'Create a Quote' Button`: Enabling this will add a `Create a Quote` button to checkout which allows a user to create a quote using the current contents of their cart.
  > ⚠️ Only enable the `Create a Quote` button if your store has the [B2B Quotes](https://github.com/vtex-apps/b2b-quotes) app installed!

## Modus Operandi

Once the app is installed in the account, every scripts contained in it will be automatically linked to your store and used to [build the templates](https://help.vtex.com/tutorial/configure-template-in-smartcheckout-update--ToTE5XB39t0SwtHgpgwSv?locale=en#configuring-templates-from-the-code-menu) to customize your Checkout.
