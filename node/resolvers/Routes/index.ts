import type { PaymentTerm } from 'vtex.b2b-organizations-graphql'

import { DEFAULTS, VBASE_BUCKET, VBASE_SETTINGS_FILE } from '../constants'

const CACHE = 180

export default {
  settings: async (ctx: Context) => {
    const {
      clients: {
        organizations,
        storefrontPermissions,
        checkout,
        session,
        vbase,
      },
      vtex: { host, logger, storeUserAuthToken, production },
    } = ctx

    const token: any = storeUserAuthToken

    ctx.set('Content-Type', 'application/json')
    ctx.set('Cache-Control', 'no-cache, no-store')

    if (!token && !host?.includes('myvtex.com')) {
      ctx.response.body = {
        error: 'User not authenticated',
      }
      ctx.response.status = 200

      ctx.set('cache-control', 'no-cache')
    } else {
      const accountSettings: any = await vbase
        .getJSON(VBASE_BUCKET, VBASE_SETTINGS_FILE, true)
        .catch((error) => {
          logger.error({
            message: 'settings-getJSON-error',
            error,
          })
        })

      if (accountSettings?.showPONumber && !accountSettings?.hasPONumber) {
        const checkoutConfig: any = await checkout
          .getOrderFormConfiguration()
          .catch((error) => {
            logger.error({
              message: 'settings-getOrderformConfiguration-error',
              error,
            })
          })

        accountSettings.hasPONumber = true

        // Check if checkout has b2b-checkout-settings app
        if (
          checkoutConfig?.apps.findIndex(
            (currApp: any) => currApp.id === 'b2b-checkout-settings'
          ) === -1
        ) {
          checkoutConfig.apps.push({
            major: 1,
            id: 'b2b-checkout-settings',
            fields: ['purchaseOrderNumber'],
          })

          const setCheckoutConfig: any = await checkout
            .setOrderFormConfiguration(checkoutConfig, ctx.vtex.authToken)
            .then(() => true)
            .catch((error) => {
              accountSettings.hasPONumber = false

              logger.error({
                message: 'settings-setOrderformConfiguration-error',
                error,
              })

              return false
            })

          if (setCheckoutConfig) {
            await vbase
              .saveJSON(VBASE_BUCKET, VBASE_SETTINGS_FILE, accountSettings)
              .catch((error) => {
                logger.error({
                  message: 'settings-saveJSON-error',
                  error,
                })
              })
          }
        }
      }

      const {
        data: { checkUserPermission },
      }: any = await storefrontPermissions
        .checkUserPermission()
        .catch((error: any) => {
          logger.error({
            message: 'checkUserPermission-error',
            error,
          })

          return {
            data: {
              checkUserPermission: {
                permissions: [],
              },
            },
          }
        })

      const sessionToken =
        ctx.vtex.sessionToken ?? ctx.request.header?.sessiontoken

      const userSession = await session
        .getSession(sessionToken as string, ['*'])
        .then((currentSession: any) => {
          return currentSession.sessionData
        })
        .catch((error) => {
          logger.error({
            message: 'getSession-error',
            error,
          })
        })

      let settings = {
        ...DEFAULTS,
        ...accountSettings,
        ...checkUserPermission,
      }

      // allow users without organization or cost center to access checkout
      if (
        !userSession?.namespaces?.['storefront-permissions']?.organization ||
        !userSession?.namespaces?.['storefront-permissions']?.costcenter
      ) {
        settings = {}
      }

      if (
        userSession?.namespaces?.['storefront-permissions']?.costcenter?.value
      ) {
        settings.costCenterId =
          userSession?.namespaces?.['storefront-permissions']?.costcenter?.value
        const {
          data: { getCostCenterById },
        }: any = await organizations
          .getAddresses(settings.costCenterId)
          .then((res: any) => {
            const { addresses, paymentTerms, customFields } =
              res?.data?.getCostCenterById ?? {}

            return {
              data: {
                getCostCenterById: {
                  addresses,
                  customFields,
                  paymentTerms,
                },
              },
            }
          })
          .catch((error: any) => {
            logger.error({
              message: 'getCostCenterAddresses-error',
              error,
            })

            return {
              data: {
                getCostCenterById: null,
              },
            }
          })

        if (getCostCenterById?.addresses) {
          settings.addresses = getCostCenterById.addresses
        }

        if (getCostCenterById?.customFields) {
          settings.costCenterCustomFields = getCostCenterById.customFields
        }

        if (getCostCenterById?.paymentTerms?.length > 0) {
          settings.paymentTerms = getCostCenterById.paymentTerms
        }
      }

      if (
        userSession?.namespaces?.['storefront-permissions']?.organization?.value
      ) {
        settings.organizationId =
          userSession?.namespaces?.[
            'storefront-permissions'
          ]?.organization?.value

        const {
          data: { getOrganizationById },
        }: any = await organizations
          .getOrganization(settings.organizationId)
          .then((res: any) => {
            const { customFields, status, paymentTerms } =
              res?.data?.getOrganizationById ?? {}

            return {
              data: {
                getOrganizationById: {
                  customFields,
                  paymentTerms,
                  status,
                },
              },
            }
          })
          .catch((error: any) => {
            logger.error({
              message: 'getOrganizationById-error',
              error,
            })

            return {
              data: {
                getOrganizationById: null,
              },
            }
          })

        // fix to only show the payment terms that are in common between the organization and the cost center
        if (settings.paymentTerms && getOrganizationById?.paymentTerms) {
          const intersection = settings.paymentTerms.filter(
            (ccPaymentTerms: PaymentTerm) =>
              getOrganizationById.paymentTerms.some(
                (orgPaymentTerms: PaymentTerm) =>
                  ccPaymentTerms.id === orgPaymentTerms.id &&
                  ccPaymentTerms.name === orgPaymentTerms.name
              )
          )

          settings.paymentTerms = intersection
        }

        if (!settings.paymentTerms && getOrganizationById?.paymentTerms) {
          settings.paymentTerms = getOrganizationById.paymentTerms
        }

        if (!settings.customFields && getOrganizationById?.customFields) {
          settings.customFields = getOrganizationById.customFields
        }

        // if organization status is "on-hold" or "inactive", remove "can-checkout" permission
        if (getOrganizationById?.status !== 'active') {
          const newPermissions = settings.permissions?.filter(
            (permission: string) => permission !== 'can-checkout'
          )

          settings.permissions = newPermissions ?? []
        }
      }

      ctx.set(
        'cache-control',
        `public, max-age=${production ? CACHE : 'no-cache'}`
      )

      ctx.response.body = settings

      ctx.response.status = 200
    }
  },
}
