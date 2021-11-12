!(function () {
  console.log('B2B Checkout Settings')
  var translation = {
    'BRA': {
      cartPurchaseOrderLabel: 'Número do Pedito'
    },
    'USA': {
      cartPurchaseOrderLabel: 'Reference or PO Number'
    }
  }
  var settings = JSON.parse(window.sessionStorage.getItem('b2b-checkout-settings')) || undefined
  var buildPOField = function () {
    if ($('.b2b-purchase-order-number-label').length > 0) return false

    const wrap = $('.payment-confirmation-wrap')

    var customData = window.vtexjs.checkout.orderForm.customData
    var currValue = ''
    if (customData) {
      var index = customData.customApps.findIndex(function(item) {
        return item.id === 'b2b-checkout-settings'
      })
      if (index !== -1 && customData.customApps[index].fields.purchaseOrderNumber) {
        currValue = customData.customApps[index].fields.purchaseOrderNumber
      }
    }

    wrap.prepend(`
    <div class="b2b-purchase-order-number">
    <p class="b2b-purchase-order-number-label">
    <label for="cart-b2b-purchase-order-number">${
      translation[window.vtex.i18n.countryCode].cartPurchaseOrderLabel || 'Reference or PO Number'
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
  var fetchSettings = function () {
    var rootPath = window.vtex.renderRuntime.rootPath !== undefined ? window.vtex.renderRuntime.rootPath : ''
    $.ajax({
      url: `${rootPath}/b2b-checkout-settings/`,
    })
      .then(function (response) {
        window.sessionStorage.setItem('b2b-checkout-settings', JSON.stringify(response))
        settings = response
        buildPOField()
      })
      .catch(function (error) {
        console.log('Error Response settings =>', error)
      })
  }


  // Wait until it have the vtex runtime to call the functions
  var checkVtex = setInterval(function () {
    if (window.vtex !== undefined && window.vtex.renderRuntime !== undefined) {
      clearInterval(checkVtex)
      if (!settings) {
        fetchSettings()
      } else {
        if (settings.showPONumber === true) {
          buildPOField()
        }
      }
    }
  }, 500)
})()
