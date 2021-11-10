!(function () {
  console.log('### B2B Checkout Settings =>')
  var fetchSettings = function () {
    var rootPath = window.vtex.renderRuntime.rootPath !== undefined ? window.vtex.renderRuntime.rootPath : ''
    console.log(`URL => ${rootPath}/b2b-checkout-settings/`)
    $.ajax({
      url: `${rootPath}/b2b-checkout-settings/`,
    })
      .then(function (response) {
        console.log('Response settings =>', response)
      })
      .catch(function (error) {
        console.log('Error Response settings =>', error)
      })
  }
  var checkVtex = setInterval(function () {
    if (window.vtex !== undefined && window.vtex.renderRuntime !== undefined) {
      clearInterval(checkVtex)
      fetchSettings()
    }
  }, 500)

  // function buildPOField(lang) {
  //   if ($('.b2b-purchase-order-number-label').length > 0) return false

  //   const wrap = $('.payment-confirmation-wrap')

  //   wrap.prepend(`
  //   <div class="b2b-purchase-order-number">
  //   <p class="b2b-purchase-order-number-label">
  //   <label for="cart-b2b-purchase-order-number">${
  //     lang ? this.lang.cartPurchaseOrderLabel : 'Reference or PO Number'
  //   }</label>
  //   </p>
  //   <input class="input-small b2b-purchase-order-number-input" type="text" id="cart-b2b-purchase-order-number">
  //   </div>
  //   `)

  //   $('body').on('change', '#cart-b2b-purchase-order-number', function (e) {
  //     e.preventDefault()

  //     const orderFormID = vtexjs.checkout.orderFormId
  //     const purchaseOrderNumber = $(this).val()

  //     $.ajax({
  //       url: `${window.location.origin}/api/checkout/pub/orderForm/${orderFormID}/customData/b2b-checkout-ui-custom/purchaseOrderNumber`,
  //       type: purchaseOrderNumber ? 'PUT' : 'DELETE',
  //       data: { value: purchaseOrderNumber },
  //     })
  //   })
  // }
})()
