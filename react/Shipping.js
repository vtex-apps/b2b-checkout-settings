/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { injectIntl, defineMessages } from 'react-intl'

import styles from './checkout.css'

const messages = defineMessages({
  title: {
    id: 'store/shipping-title',
    defaultMessage: 'Shipping',
  },
  payment: {
    id: 'store/go-to-payment',
    defaultMessage: 'Go to payent',
  },
})

const B2BShipping = ({ intl }) => {
  if (typeof document === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const settings = JSON.parse(
    window.sessionStorage.getItem('b2b-checkout-settings')
  )

  if (!settings || settings.error) {
    return <div> {settings ? settings.error : `Couldn't load addresses`} </div>
  }

  const buildAddress = () => {
    let html = ''

    console.log('buildAddress')
    if (!settings.addresses || !settings.addresses.length) {
      return 'No addresses available'
    }

    settings.addresses.forEach(address => {
      html += `
          <label className="address-item ${styles.addressItemOption}">
            <div className="shp-option-text ${styles.addressItemText}">
              <div className="address-summary address-summary-USA">
                <span>
                  <span className="street">${address.street}</span>
                </span>
                <br className="line1-delimiter" />
                <span>
                  <span className="city">${address.city}</span>
                </span>
                <span>
                  <span className="state-delimiter">, </span>
                  <span className="state">${address.state}</span>
                </span>
                <span>
                  <span className="postalCode-delimiter"> </span>
                  <span className="postalCode">${address.postalCode}</span>
                </span>
                <br className="line2-delimiter" />
                <span className="country">${address.country}</span>
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

          <p
            className={`${styles.submitPaymentButton} btn-submit-wrapper btn-go-to-payment-wrapper`}
          >
            <button
              className="submit  btn-go-to-payment btn btn-large btn-success"
              id="btn-go-to-payment"
              type="button"
            >
              {intl.formatMessage(messages.payment)}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default injectIntl(B2BShipping)
