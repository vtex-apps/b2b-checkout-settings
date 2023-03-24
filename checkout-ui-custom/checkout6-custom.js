/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable */
const CREDIT_CARDS = [
  'visa',
  'mastercard',
  'diners',
  'american express',
  'hipercard',
  'discover',
  'aura',
  'elo',
  'banricompras',
  'jcb',
  'cabal',
  'nativa',
  'naranja',
  'nevada',
  'shopping',
  'credz',
]

const MAX_TIME_EXPIRATION = 1000 * 60 * 5 // 5 minutes

!(function () {
  console.log('B2B Checkout Settings')
  let checkVtex = null

  const getTranslation = function () {
    const locale = window.vtex.i18n.getLocale()
    const translation = {
      'pt-BR': {
        cartPurchaseOrderLabel: 'Número do Pedido',
        createQuoteButtonLabel: 'Criar uma Cotação',
        messages: {
          'b2b-access-denied': {
            title: 'Acesso',
            detail: 'Você não tem acesso ao checkout',
          },
        },
        clearCartLabel: 'Limpar carrinho',
      },
      en: {
        cartPurchaseOrderLabel: 'Reference or PO Number',
        createQuoteButtonLabel: 'Create a Quote',
        messages: {
          'b2b-access-denied': {
            title: 'ACCESS',
            detail: "You don't have access to the checkout",
          },
        },
        clearCartLabel: 'Clear Cart',
      },
      es: {
        cartPurchaseOrderLabel: 'Número de referencia o número del pedido',
        createQuoteButtonLabel: 'Crear un presupuesto',
        messages: {
          'b2b-access-denied': {
            title: 'ACCESO',
            detail: 'No tienes acceso al checkout',
          },
        },
        clearCartLabel: 'Limpiar carrito',
      },
    }

    // default to EN if language not supported
    return translation[locale] || translation.en
  }

  // Used to remove cache from requests
  const isWorkspace = function () {
    return window.__RUNTIME__.workspace !== 'master'
  }

  let settings
  const storedSettings = JSON.parse(
    window.sessionStorage.getItem('b2b-checkout-settings')
  )

  const emailRequested =
    window.vtexjs && window.vtexjs.checkout && window.vtexjs.checkout.orderForm
      ? window.vtexjs.checkout.orderForm.clientProfileData.email
      : null

  if (storedSettings && storedSettings.time) {
    const now = new Date().getTime()
    const sessionStorageCheckoutTime = new Date(storedSettings.time).getTime()

    if (
      now - sessionStorageCheckoutTime < MAX_TIME_EXPIRATION &&
      emailRequested &&
      emailRequested === storedSettings.email
    ) {
      settings = storedSettings
    }
  }

  window.b2bCheckoutSettings = window.b2bCheckoutSettings || settings

  const buildClearCartButton = function () {
    if ($('#clear-cart').length > 0) {
      return
    }

    const label = getTranslation().clearCartLabel

    const btn = $(
      `<button id='clear-cart' class='btn btn-large btn-primary btn-b2b-primary'>${label}</button>`
    )

    btn.click(removeCartItemsAndQuote)

    $('div.cart').append(btn)
  }

  const buildCreateQuoteButton = function () {
    const label = getTranslation().createQuoteButtonLabel

    const targets = [
      '.cart-links.cart-links-bottom',
      '.payment-confirmation-wrap',
    ]

    targets.forEach(function (target) {
      const btn = $(
        `<button class='btn btn-large btn-primary btn-b2b-primary'>${label}</button>`
      ).click(function () {
        window.location.replace('/b2b-quotes/create')
      })

      $(target).append(btn)
    })
  }

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
      getTranslation().cartPurchaseOrderLabel
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

  const removeCartItemsAndQuote = function () {
    if (window.vtexjs && window.vtexjs.checkout) {
      window.vtexjs.checkout.removeAllItems().then(function () {
        window.vtexjs.checkout
          .setCustomData({
            value: 0,
            app: 'b2b-quotes-graphql',
            field: 'quoteId',
          })
          .then(function () {})
      })
    }
  }

  const showPaymentOptions = function (permissions) {
    const allOptions = document.querySelectorAll(
      '.orderform-template-holder #payment-data .payment-group-item'
    )

    const [activeOption] = document.querySelectorAll(
      '.orderform-template-holder #payment-data .payment-group-item.active'
    )

    const activeOptionText = activeOption
      ? activeOption.dataset.name.toLowerCase()
      : ''

    const isCreditCardActive = CREDIT_CARDS.includes(activeOptionText)
    let firstOption = null

    if (
      permissions &&
      permissions.paymentTerms &&
      permissions.paymentTerms.length
    ) {
      allOptions.forEach(function (obj) {
        const currOption = obj.dataset.name.toLowerCase()

        const isCreditCard = CREDIT_CARDS.includes(currOption)

        if (
          permissions.paymentTerms.findIndex(function (pmt) {
            if (isCreditCard) {
              return pmt.name.toLowerCase() === 'credit card'
            }

            return pmt.name.toLowerCase() === currOption
          }) === -1
        ) {
          return
        }

        if (firstOption === null) {
          firstOption = obj
        }

        obj.setAttribute('data-b2b-allowed', 'true')
      })

      if (
        permissions.paymentTerms.findIndex(function (pmt) {
          if (isCreditCardActive) {
            return pmt.name.toLowerCase() === 'credit card'
          }

          return pmt.name.toLowerCase() === activeOptionText
        }) === -1
      ) {
        $(firstOption).click()
      }
    }
  }

  const applyPermissions = function (permissions) {
    // Add permission keys to the body class for layout changes
    $('body').addClass(permissions.join(' '))

    const [, step] = window.location.hash.split('/')

    // Check if use can navigate the checkout
    if (
      permissions.indexOf('can-checkout') === -1 &&
      step.indexOf('cart') === -1
    ) {
      window.sessionStorage.setItem('message', 'b2b-access-denied')
      window.location.replace('/checkout/#/cart')
    }

    // Show payment options available
    if (step.includes('payment')) {
      const checkPayment = setInterval(function () {
        if (
          document.querySelectorAll(
            '.orderform-template-holder #payment-data .payment-group-item'
          ).length > 0
        ) {
          clearInterval(checkPayment)
          showPaymentOptions(settings)
        }
      }, 500)
    }
  }

  const applyMarketingData = function (organizationId, costCenterId) {
    if (!organizationId || !costCenterId) return false

    const marketingData = {
      utmCampaign: organizationId,
      utmMedium: costCenterId,
    }

    window.vtexjs.checkout.sendAttachment('marketingData', marketingData)
  }

  const handleSettings = function () {
    if (!settings) return

    if (settings.showPONumber === true) {
      buildPOField()
    }

    if (settings.permissions) {
      applyPermissions(settings.permissions)
    }

    if (settings.showQuoteButton) {
      buildCreateQuoteButton()
    }

    if (
      window.vtexjs &&
      window.vtexjs.checkout &&
      window.vtexjs.checkout.orderForm &&
      window.vtexjs.checkout.orderForm.marketingData &&
      (!window.vtexjs.checkout.orderForm.marketingData.utmCampaign ||
        !window.vtexjs.checkout.orderForm.marketingData.utmMedium)
    ) {
      applyMarketingData(settings.organizationId, settings.costCenterId)
    }

    window.b2bCheckoutSettings = settings
  }

  const checkQuotes = function () {
    if (
      window.vtexjs &&
      window.vtexjs.checkout &&
      window.vtexjs.checkout.orderForm &&
      window.vtexjs.checkout.orderForm.customData
    ) {
      const { customData } = window.vtexjs.checkout.orderForm

      if (customData.customApps) {
        const index = customData.customApps.findIndex(function (item) {
          return item.id === 'b2b-quotes-graphql'
        })

        const hasB2bQuote = index !== -1

        if (!hasB2bQuote) return 

        const { quoteId } = customData.customApps[index].fields

        if (index !== -1 && quoteId && parseInt(quoteId, 10) !== 0) {
          buildClearCartButton()
          lockFields()
        }
      }
    }
  }

  const observeDOM = (function () {
    const MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver

    return function (obj, callback) {
      if (!obj || obj.nodeType !== 1) return

      if (MutationObserver) {
        // define a new observer
        const mutationObserver = new MutationObserver(callback)

        // have the observer observe foo for changes in children
        mutationObserver.observe(obj, { childList: true, subtree: true })

        return mutationObserver
      }

      // browser support fallback
      if (window.addEventListener) {
        obj.addEventListener('DOMNodeInserted', callback, false)
        obj.addEventListener('DOMNodeRemoved', callback, false)
      }
    }
  })()

  const selectorsToLock = [
    'td.quantity',
    'a.manualprice-link-remove',
    'span.new-product-price',
    'td.item-remove',
  ]

  const lockFields = function () {
    selectorsToLock.forEach(function (selector) {
      if (!$(selector).hasClass('item-disabled')) {
        $(selector).addClass('item-disabled')
      }
    })
  }

  const observer = new MutationObserver(function () {
    const cartItems = document.querySelector('.cart-items')

    if (cartItems) {
      observer.disconnect()
      observeDOM(cartItems, function () {
        cartItems.classList.add('pointer-events-none')
        checkQuotes()
        setTimeout(function () {
          cartItems.classList.remove('pointer-events-none')
        }, 500)
      })
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  const fetchSettings = function () {
    const rootPath =
      window.vtex.renderRuntime.rootPath !== undefined
        ? window.vtex.renderRuntime.rootPath
        : ''

    const ts = new Date().getTime()

    $.ajax({
      url: `${rootPath}/_v/private/b2b-checkout-settings/${
        isWorkspace() ? `?v=${ts}` : ''
      }`,
    }).then(function (response) {
      if (Object.keys(response).length === 0) {
        window.sessionStorage.removeItem('b2b-checkout-settings')

        return
      }

      response.time = new Date().toISOString()

      if (
        window.vtexjs &&
        window.vtexjs.checkout &&
        window.vtexjs.checkout.orderForm
      ) {
        response.email =
          window.vtexjs.checkout.orderForm.clientProfileData.email
      }

      window.sessionStorage.setItem(
        'b2b-checkout-settings',
        JSON.stringify(response)
      )
      settings = response
      handleSettings()
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

  const initialize = function () {
    const message = window.sessionStorage.getItem('message')

    if (settings && settings.permissions) {
      applyPermissions(settings.permissions)
    }

    if (message) {
      $(window).trigger('addMessage.vtex', {
        type: 'info',
        id: message,
        content: {
          title: getTranslation().messages[message].title,
          detail: getTranslation().messages[message].detail,
        },
      })
      window.sessionStorage.removeItem('message')
    }
  }

  $(window).on('hashchange', () => initialize())
})()
