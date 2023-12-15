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
  const token =
    ctx.storeUserAuthToken ?? ctx.adminUserAuthToken ?? ctx.authToken

  const { sessionToken } = ctx

  return {
    'x-vtex-credential': ctx.authToken,
    VtexIdclientAutCookie: token,
    cookie: `VtexIdclientAutCookie=${token}`,
    'x-vtex-session': sessionToken,
  }
}
