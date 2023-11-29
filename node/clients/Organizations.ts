/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import { QUERIES } from '../resolvers/Routes/queries'
import { createHeaderWithToken } from './index'

export class OrganizationsGraphQLClient extends AppGraphQLClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.b2b-organizations-graphql@0.x', ctx, options)
  }

  public getAddresses = async (costCenterId: string): Promise<any> => {
    return this.graphql.query(
      {
        extensions: {
          persistedQuery: {
            provider: 'vtex.b2b-organizations-graphql@0.x',
            sender: 'vtex.b2b-checkout-settings@1.x',
          },
        },
        query: QUERIES.getAddresses,
        variables: {
          id: costCenterId,
        },
      },
      {
        headers: createHeaderWithToken(this.context),
      }
    )
  }

  public getOrganization = async (organizationId: string): Promise<any> => {
    return this.graphql.query(
      {
        extensions: {
          persistedQuery: {
            provider: 'vtex.b2b-organizations-graphql@0.x',
            sender: 'vtex.b2b-checkout-settings@1.x',
          },
        },
        query: QUERIES.getOrganizationDetails,
        variables: {
          id: organizationId,
        },
      },
      {
        headers: createHeaderWithToken(this.context),
      }
    )
  }
}
