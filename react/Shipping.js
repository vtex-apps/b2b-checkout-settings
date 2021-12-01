/* eslint-disable vtex/prefer-early-return */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import { injectIntl, defineMessages } from 'react-intl'

import styles from './b2bcheckout.css'

const messages = defineMessages({
  title: {
    id: 'store/shipping-title',
    defaultMessage: 'Shipping',
  },
  payment: {
    id: 'store/go-to-payment',
    defaultMessage: 'Go to payent',
  },
  error: {
    id: 'store/error-loading-addresses',
    defaultMessage: "Couldn't load addresses",
  },
  notfound: {
    id: 'store/no-addresses',
    defaultMessage: 'No addresses available',
  },
})

window.b2bCheckoutSettings = window.b2bCheckoutSettings || {}
const B2BShipping = ({ intl }) => {
  const [state, setState] = useState({
    orderForm: null,
    addressId: null,
  })

  let checkOf = null

  if (typeof document === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const { orderForm, addressId } = state

  checkOf = setInterval(() => {
    if (
      !window.b2bCheckoutSettings.ofLoaded &&
      window.vtexjs &&
      window.vtexjs.checkout &&
      window.vtexjs.checkout.orderForm
    ) {
      clearInterval(checkOf)
      window.b2bCheckoutSettings.ofLoaded = true
      setState({
        ...state,
        orderForm: window.vtexjs.checkout.orderForm,
      })
    }
  }, 500)

  if (!orderForm) return null

  if (!addressId && orderForm.shippingData.address) {
    setState({
      ...state,
      addressId: orderForm.shippingData.address.addressId,
    })
  }

  const settings = JSON.parse(
    window.sessionStorage.getItem('b2b-checkout-settings')
  )

  if (!settings || settings.error) {
    return (
      <div>
        {' '}
        {settings ? settings.error : intl.formatMessage(messages.error)}{' '}
      </div>
    )
  }

  window.b2bCheckoutSettings.setCurrent = currAddressId => {
    const address = settings.addresses.find(
      item => item.addressId === currAddressId
    )

    setState({
      ...state,
      addressId: currAddressId,
    })

    const shippingData = { address }

    window.vtexjs.checkout.sendAttachment('shippingData', shippingData)
  }

  const buildAddress = () => {
    let html = ''

    if (!settings.addresses || !settings.addresses.length) {
      return intl.formatMessage(messages.notfound)
    }

    settings.addresses.forEach(address => {
      html += `
          <label
            onClick="b2bCheckoutSettings.setCurrent('${address.addressId}')"
            class="address-item ${styles.addressItemOption} ${
        address.addressId === addressId ? styles.addressItemOptionActive : ''
      }">
            <div class="${styles.addressItemIcon} shp-option-icon">
              <svg class="${
                styles.svg
              }" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                ${
                  address.addressId === addressId
                    ? '<path d="M8 4C5.792 4 4 5.792 4 8s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4zm0-4C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z" fill="#3386E8"></path>'
                    : '<path d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z" fill="#3386E8"></path>'
                }
              </svg>

            </div>
            <div class="shp-option-text ${styles.addressItemText}">
              <div class="address-summary address-summary-USA">
                <span>
                  <span class="street">${address.street}</span>
                </span>
                <br class="line1-delimiter" />
                <span>
                  <span class="city">${address.city}</span>
                </span>
                <span>
                  <span class="state-delimiter">, </span>
                  <span class="state">${address.state}</span>
                </span>
                <span>
                  <span class="postalCode-delimiter"> </span>
                  <span class="postalCode">${address.postalCode}</span>
                </span>
                <br class="line2-delimiter" />
                <span class="country">${address.country}</span>
              </div>
            </div>
          </label>
        `
    })

    return html
  }

  return (
    <div className="step accordion-group shipping-data">
      <div className="accordion-heading">
        <span className="accordion-toggle collapsed">
          {intl.formatMessage(messages.title)}
        </span>
      </div>
      <div className="accordion-inner shipping-container">
        <div className="box-step">
          <div className={`${styles.addressFormPart1}`}>
            <div
              className={`${styles.addressList} address-list`}
              dangerouslySetInnerHTML={{ __html: buildAddress() }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default injectIntl(B2BShipping)
