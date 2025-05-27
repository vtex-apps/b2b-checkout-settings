/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import { QUERIES } from '../resolvers/Routes/queries'
import { getTokenToHeader } from './index'

export class OrganizationsGraphQLClient extends AppGraphQLClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.b2b-organizations-graphql@1.x', ctx, options)
  }

  public getAddresses = async (costCenterId: string): Promise<any> => {
    return this.graphql.query(
      {
        extensions: {
          persistedQuery: {
            provider: 'vtex.b2b-organizations-graphql@1.x',
            sender: 'vtex.b2b-checkout-settings@2.x',
          },
        },
        query: QUERIES.getAddresses,
        variables: {
          id: costCenterId,
        },
      },
      {
        headers: getTokenToHeader(this.context),
        params: {
          locale: this.context.locale,
        },
      }
    )
  }

  public getOrganization = async (organizationId: string): Promise<any> => {
    return this.graphql.query(
      {
        extensions: {
          persistedQuery: {
            provider: 'vtex.b2b-organizations-graphql@1.x',
            sender: 'vtex.b2b-checkout-settings@2.x',
          },
        },
        query: QUERIES.getOrganizationDetails,
        variables: {
          id: organizationId,
        },
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
