/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ForbiddenError } from '@vtex/api'

const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

const CACHE = 180
const QUERIES = {
  getPermission: `query permissions {
    checkUserPermission @context(provider: "vtex.storefront-permissions"){
      role {
        id
        name
        slug
      }
      permissions
    }
  }`,
  getOrganizationDetails: `query OrganizationDetails($id: ID!) {
    getOrganizationById(id: $id) {
      status
      paymentTerms {
        id
        name
      }
    }
  }
  `,
  getAddresses: `query addressByCostCenter($id: ID!) {
    getCostCenterById(id: $id) {
      paymentTerms {
        id
        name
      }
      addresses {
        addressId
        addressType
        addressQuery
        postalCode
        country
        receiverName
        city
        state
        street
        number
        complement
        neighborhood
        geoCoordinates
      }
    }
  }
  `,
}

const DEFAULTS = {
  showPONumber: false,
  hasPONumber: false,
}

export const resolvers = {
  Routes: {
    settings: async (ctx: Context) => {
      const {
        clients: { apps, graphQLServer, checkout, session },
        vtex: { logger, storeUserAuthToken, production },
      } = ctx

      const token: any = storeUserAuthToken

      ctx.set('Content-Type', 'application/json')
      ctx.set('Cache-Control', 'no-cache, no-store')

      if (!token) {
        ctx.response.body = {
          error: 'User not authenticated',
        }
        ctx.response.status = 200

        ctx.set('cache-control', 'no-cache')
      } else {
        const app: string = getAppId()
        const accountSettings = await apps.getAppSettings(app)

        if (accountSettings?.showPONumber && !accountSettings?.hasPONumber) {
          const checkoutConfig: any = await checkout
            .getOrderFormConfiguration()
            .catch(error => {
              logger.error({
                message: 'getOrderformConfiguration-error',
                error,
              })
            })

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
              .catch(error => {
                logger.error({
                  message: 'setOrderformConfiguration-error',
                  error,
                })

                return false
              })

            if (setCheckoutConfig) {
              accountSettings.hasPONumber = true
              await apps.saveAppSettings(app, accountSettings).catch(error => {
                logger.error({
                  message: 'saveAppSettings-error',
                  error,
                })
              })
            }
          }
        }

        const {
          data: { checkUserPermission },
        }: any = await graphQLServer
          .query(
            QUERIES.getPermission,
            {},
            {
              persistedQuery: {
                provider: 'vtex.storefront-permissions@1.x',
                sender: 'vtex.b2b-checkout-settings@0.x',
              },
            }
          )
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
          .catch(() => null)

        const settings = {
          ...DEFAULTS,
          ...accountSettings,
          ...checkUserPermission,
        }

        if (
          userSession?.namespaces?.['storefront-permissions']?.costcenter?.value
        ) {
          const {
            data: { getCostCenterById },
          }: any = await graphQLServer
            .query(
              QUERIES.getAddresses,
              {
                id: userSession.namespaces['storefront-permissions'].costcenter
                  .value,
              },
              {
                persistedQuery: {
                  provider: 'vtex.b2b-organizations-graphql@0.x',
                  sender: 'vtex.b2b-checkout-settings@0.x',
                },
              }
            )
            .then((res: any) => {
              return {
                data: {
                  getCostCenterById: {
                    addresses: res?.data?.getCostCenterById?.addresses,
                    paymentTerms: res?.data?.getCostCenterById?.paymentTerms,
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

          if (getCostCenterById?.paymentTerms) {
            settings.paymentTerms = getCostCenterById.paymentTerms
          }
        }

        if (
          userSession?.namespaces?.['storefront-permissions']?.organization
            ?.value
        ) {
          const {
            data: { getOrganizationById },
          }: any = await graphQLServer
            .query(
              QUERIES.getOrganizationDetails,
              {
                id: userSession.namespaces['storefront-permissions']
                  .organization.value,
              },
              {
                persistedQuery: {
                  provider: 'vtex.b2b-organizations-graphql@0.x',
                  sender: 'vtex.b2b-checkout-settings@0.x',
                },
              }
            )
            .then((res: any) => {
              return {
                data: {
                  getOrganizationById: {
                    paymentTerms: res?.data?.getOrganizationById?.paymentTerms,
                    status: res?.data?.getOrganizationById?.status,
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

          if (!settings.paymentTerms && getOrganizationById?.paymentTerms) {
            settings.paymentTerms = getOrganizationById.paymentTerms
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
  },
}
