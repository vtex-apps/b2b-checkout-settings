/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable func-names */
!(function () {
  console.log('B2B Checkout Settings')
  let checkVtex = null
  const translation = {
    'pt-BR': {
      cartPurchaseOrderLabel: 'Número do Pedito',
    },
    en: {
      cartPurchaseOrderLabel: 'Reference or PO Number',
    },
  }

  // Used to remove cache from requests
  const isWorkspace = function () {
    return window.location.href.indexOf('--') !== -1
  }

  let settings =
    JSON.parse(window.sessionStorage.getItem('b2b-checkout-settings')) ||
    undefined

  const buildPOField = function () {
    if ($('.b2b-purchase-order-number-label').length > 0) return false

    const wrap = $('.payment-confirmation-wrap')

    const { customData } = window.vtexjs.checkout.orderForm
    let currValue = ''

    if (customData) {
      const index = customData.customApps.findIndex(function (item) {
        return item.id === 'b2b-checkout-settings'
      })

      if (
        index !== -1 &&
        customData.customApps[index].fields.purchaseOrderNumber
      ) {
        currValue = customData.customApps[index].fields.purchaseOrderNumber
      }
    }

    wrap.prepend(`
    <div class="b2b-purchase-order-number">
    <p class="b2b-purchase-order-number-label">
    <label for="cart-b2b-purchase-order-number">${
      translation[window.vtex.i18n.getLocale()].cartPurchaseOrderLabel ||
      'Reference or PO Number'
    }</label>
    </p>
    <input class="input-small b2b-purchase-order-number-input" type="text" id="cart-b2b-purchase-order-number" value="${currValue}">
    </div>
    `)

    $('body').on('change', '#cart-b2b-purchase-order-number', function (e) {
      e.preventDefault()

      const orderFormID = window.vtexjs.checkout.orderFormId
      const purchaseOrderNumber = $(this).val()

      $.ajax({
        url: `${window.location.origin}/api/checkout/pub/orderForm/${orderFormID}/customData/b2b-checkout-settings/purchaseOrderNumber`,
        type: purchaseOrderNumber ? 'PUT' : 'DELETE',
        data: { value: purchaseOrderNumber },
      })
    })
  }

  const applyPermissions = function (permissions) {
    console.log('applyPermissions =>', permissions.join(' '))
    $('body').addClass(permissions.join(' '))
  }

  const handleSettings = function () {
    console.log('handleSettings =>', settings)
    if (settings.showPONumber === true) {
      buildPOField()
    }

    if (settings.permissions && settings.permissions.length) {
      applyPermissions(settings.permissions)
    }
  }

  const fetchSettings = function () {
    const rootPath =
      window.vtex.renderRuntime.rootPath !== undefined
        ? window.vtex.renderRuntime.rootPath
        : ''

    const ts = new Date().getTime()

    $.ajax({
      url: `${rootPath}/b2b-checkout-settings/${
        isWorkspace() ? `?v=${ts}` : ''
      }`,
    })
      .then(function (response) {
        window.sessionStorage.setItem(
          'b2b-checkout-settings',
          JSON.stringify(response)
        )
        settings = response
        handleSettings()
      })
      .catch(function (error) {
        console.log('Error Response settings =>', error)
      })
  }

  // Wait until it have the vtex runtime to call the functions
  checkVtex = setInterval(function () {
    if (window.vtex !== undefined && window.vtex.renderRuntime !== undefined) {
      clearInterval(checkVtex)
      if (isWorkspace() || !settings) {
        fetchSettings()
      } else {
        handleSettings()
      }
    }
  }, 500)
})()
