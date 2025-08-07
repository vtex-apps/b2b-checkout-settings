import type { IOContext } from '@vtex/api'
import { IOClients } from '@vtex/api'

import { AuthUser } from './AuthUser'
import { Checkout } from './Checkout'
import { OrganizationsGraphQLClient } from './Organizations'
import StorefrontPermissions from './StorefrontPermissions'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get storefrontPermissions() {
    return this.getOrSet('storefrontPermissions', StorefrontPermissions)
  }

  public get organizations() {
    return this.getOrSet('organizations', OrganizationsGraphQLClient)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get authUser() {
    return this.getOrSet('authUser', AuthUser)
  }
}

export const getTokenToHeader = (ctx: IOContext) => {
  const adminToken = ctx.authToken
  const userToken = ctx.storeUserAuthToken
  const { sessionToken, account } = ctx

  let allCookies = `VtexIdclientAutCookie=${adminToken}`

  if (userToken) {
    allCookies += `; VtexIdclientAutCookie_${account}=${userToken}`
  }

  return {
    'x-vtex-credential': ctx.authToken,
    VtexIdclientAutCookie: adminToken,
    cookie: allCookies,
    ...(sessionToken && {
      'x-vtex-session': sessionToken,
    }),
  }
}
