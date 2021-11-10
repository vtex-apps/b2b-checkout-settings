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
}

const DEFAULTS = {
  showPONumber: false,
  hasPONumber: false,
}

export const resolvers = {
  Routes: {
    settings: async (ctx: Context) => {
      const {
        clients: { apps, graphQLServer, checkout },
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
          const checkoutConfig: any  = await checkout.getOrderFormConfiguration().catch((error) => {
            logger.error({
              message: 'getOrderformConfiguration-error',
              error,
            })
          })

          // Check if checkout has b2b-checkout-settings app
          console.log(`checkoutConfig?.apps.findIndex((app: any) => app.id === 'b2b-checkout-settings') =>`, checkoutConfig?.apps.findIndex((app: any) => app.id === 'b2b-checkout-settings'))
          if (checkoutConfig?.apps.findIndex((app: any) => app.id === 'b2b-checkout-settings') === -1) {
            checkoutConfig.apps.push({
              major: 1,
              id: 'b2b-checkout-settings',
              fields: ['purchaseOrderNumber'],
            })

            const setCheckoutConfig: any = await checkout.setOrderFormConfiguration(
              checkoutConfig,
              ctx.vtex.authToken
            )
            .then( () => true )
            .catch( (error) => {
              logger.error({
                message: 'setOrderformConfiguration-error',
                error,
              })
              return false
            } )

            if (setCheckoutConfig) {
              accountSettings.hasPONumber = true
              await apps.saveAppSettings(app, accountSettings).catch((error) => {
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
            console.log('Error =>', error)
            logger.error({
              message: 'checkUserPermission-error',
              error,
            })

            return {
              data: {
                checkUserPermission: null,
              },
            }
          })

        const settings = {
          ...DEFAULTS,
          ...accountSettings,
          ...checkUserPermission,
        }

        ctx.set('cache-control', `public, max-age=${production ? CACHE : 'no-cache'}`)

        ctx.response.body = settings

        ctx.response.status = 200
      }
    },
  },
}
