/* eslint-disable vtex/prefer-early-return */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import { injectIntl, defineMessages } from 'react-intl'
import { currency } from 'vtex.shipping-manager/utils'

import styles from './b2bcheckout.css'

const { formatCurrency } = currency

const messages = defineMessages({
  title: {
    id: 'store/shipping-title',
    defaultMessage: 'Shipping',
  },
  shipping: {
    id: 'store/shipping-method-title',
    defaultMessage: 'Shipping method',
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
  bd: {
    id: 'store/options.shippingEstimate-bd',
    defaultMessage:
      '{timeAmount, plural, =0 {Today} one {In # business day} other {Up to # business days}}',
  },
  d: {
    id: 'store/options.shippingEstimate-d',
    defaultMessage:
      '{timeAmount, plural, =0 {Today} one {In # day} other {Up to # days}}',
  },
  h: {
    id: 'store/options.shippingEstimate-h',
    defaultMessage:
      '{timeAmount, plural, =0 {Right now} one {In # hour} other {Up to # hours}}',
  },
  m: {
    id: 'store/options.shippingEstimate-m',
    defaultMessage:
      '{timeAmount, plural, =0 {Right now} one {In # minute} other {Up to # minutes}}',
  },
})

window.b2bCheckoutSettings = window.b2bCheckoutSettings || {}
const B2BShipping = ({ intl }) => {
  const [state, setState] = useState({
    orderForm: null,
    addressId: null,
    selectedSla: null,
  })

  let checkOf = null

  if (typeof document === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const { orderForm, addressId, selectedSla } = state

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
      selectedSla: orderForm.shippingData.logisticsInfo.find(
        item => item.addressId === orderForm.shippingData.address.addressId
      ).selectedSla,
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

  window.b2bCheckoutSettings.setCurrentAddress = currAddressId => {
    const address = settings.addresses.find(
      item => item.addressId === currAddressId
    )

    setState({
      ...state,
      addressId: currAddressId,
    })

    const shippingData = { address }

    window.vtexjs.checkout
      .sendAttachment('shippingData', shippingData)
      .then(of => {
        setState({
          ...state,
          orderForm: of,
          addressId: currAddressId,
        })
      })
  }

  window.b2bCheckoutSettings.setCurrentOption = newSelectedSla => {
    const { logisticsInfo, address } = orderForm.shippingData
    const selectedAddress = logisticsInfo.find(
      item => item.addressId === addressId
    )

    setState({
      ...state,
      selectedSla: newSelectedSla,
    })

    const shippingData = {
      address,
      logisticsInfo: [
        {
          addressId,
          itemIndex: selectedAddress.itemIndex,
          selectedDeliveryChannel: selectedAddress.selectedDeliveryChannel,
          selectedSla: newSelectedSla,
        },
      ],
      clearAddressIfPostalCodeNotFound: false,
    }

    window.vtexjs.checkout
      .sendAttachment('shippingData', shippingData)
      .then(of => {
        setState({
          ...state,
          orderForm: of,
        })
      })
  }

  const buildAddress = () => {
    let html = ''

    if (!settings.addresses || !settings.addresses.length) {
      return intl.formatMessage(messages.notfound)
    }

    settings.addresses.forEach(address => {
      html += `
          <label
            onClick="b2bCheckoutSettings.setCurrentAddress('${
              address.addressId
            }')"
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

  const buildOptions = () => {
    let html = ''

    const { storePreferencesData, shippingData } = orderForm

    const currentAddress = shippingData.logisticsInfo.find(item => {
      return addressId === item.addressId
    })

    if (currentAddress && currentAddress.slas) {
      currentAddress.slas.forEach(item => {
        const timeAmount = item.shippingEstimate.replace(/\D/gi, '')
        const timeFactor = item.shippingEstimate.replace(/\d/gi, '')

        html += `
          <div>
            <label
            onClick="b2bCheckoutSettings.setCurrentOption('${item.id}')"
            class="shp-lean-option ${styles.leanShippingOption}" id="${
          item.id
        }">
              <input class="shp-option-radio hide" type="radio" value="${
                item.id
              }" />
              <div class="${styles.leanShippingIcon} shp-option-icon">
                <svg class="${
                  styles.svg
                }" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  ${
                    item.id === selectedSla
                      ? '<path d="M8 4C5.792 4 4 5.792 4 8s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4zm0-4C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z" fill="#3386E8"></path>'
                      : '<path d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z" fill="#3386E8"></path>'
                  }
                </svg>
              </div>
              <div class="shp-option-text ${styles.leanShippingText}">
                <div class="shp-option-text-label ${
                  styles.leanShippingTextLabel
                }">${item.name}</div>
                <div class="shp-option-text-package">
                ${intl.formatMessage(messages[timeFactor], {
                  timeAmount,
                })}
                </div>
              </div>
              ${formatCurrency({
                value: item.price,
                storePreferencesData,
              })}
            </label>
          </div>
        `
      })
    }

    return html
  }

  const showGoToPayment = () => {
    return (
      orderForm.shippingData &&
      orderForm.shippingData.address &&
      window.location.hash.indexOf('shipping') !== -1
    )
  }

  const handleGoToPayment = () => {
    window.location.replace('/checkout/#/payment')
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

          <div className={`${styles.deliveryGroup}`}>
            <p className={`${styles.shippingSectionTitle}`}>
              {intl.formatMessage(messages.shipping)}
            </p>
            <div
              className={`${styles.leanShippingGroupList} shp-lean`}
              id="delivery-packages-options"
              dangerouslySetInnerHTML={{ __html: buildOptions() }}
            />
          </div>

          {showGoToPayment() && (
            <p
              className={`${styles.submitPaymentButton} btn-submit-wrapper btn-go-to-payment-wrapper`}
            >
              <button
                className="submit btn-go-to-payment btn btn-large btn-success"
                id="btn-go-to-payment"
                type="button"
                onClick={handleGoToPayment}
              >
                {intl.formatMessage(messages.payment)}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default injectIntl(B2BShipping)
