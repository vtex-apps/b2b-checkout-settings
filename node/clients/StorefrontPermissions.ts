/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import { QUERIES } from '../resolvers/Routes/queries'
import { getTokenToHeader } from './index'

export default class StorefrontPermissions extends AppGraphQLClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.storefront-permissions@1.x', ctx, options)
  }

  public checkUserPermission = async (): Promise<any> => {
    return this.graphql.query(
      {
        extensions: {
          persistedQuery: {
            provider: 'vtex.storefront-permissions@1.x',
            sender: 'vtex.b2b-checkout-settings@1.x',
          },
        },
        query: QUERIES.getPermission,
        variables: {},
      },
      {
        headers: getTokenToHeader(this.context),
        params: {
          locale: this.context.locale,
        },
      }
    )
  }
}
