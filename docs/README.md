# B2B Checkout Settings

The B2B Checkout Settings app is responsible for extending your checkout experience with B2B functionalities provided by the B2B Organizations app

This App is part of the [B2B Store Edition](https://github.com/vtex/b2b-store-edition), installing it without the related Apps may not result in a good experience
## Functionalities

- List Cost Center Addresses
- Enable PO Number
- Block checkout based on user's privilegies
- Enable the 'Create a Quote' button at the checkout page

## Configuration

[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `vtex.b2b-checkout-settings` app by running `vtex install vtex.b2b-checkout-settings` in your terminal.

If you want to enable PO Number at the checkout, turn this feature ON through the App Settings page `/admin/apps/vtex.b2b-checkout-settings@0.x/setup/`

## Modus Operandi 

Once the app is installed in the account, every scripts contained in it will be automatically linked to your store and used to [build the templates](https://help.vtex.com/tutorial/configure-template-in-smartcheckout-update--ToTE5XB39t0SwtHgpgwSv?locale=en#configuring-templates-from-the-code-menu) to customize your Checkout.

