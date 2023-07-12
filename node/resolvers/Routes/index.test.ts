import { randUuid } from '@ngneat/falso'
import type { PaymentTerm } from 'vtex.b2b-organizations-graphql'

import index from './index'

const costCenterPaymentTerms = 'costCenterPaymentTerms'
const organizationPaymentTerms = 'organizationPaymentTerms'

const graphQLQuery = jest.fn()

interface ResponseBody {
  paymentTerms: PaymentTerm[]
}

const mockContext = () => {
  return {
    clients: {
      graphQLServer: {
        query: graphQLQuery
          .mockResolvedValueOnce({ data: {} })
          .mockResolvedValueOnce({
            data: {
              getCostCenterById: {
                addresses: {},
                customFields: {},
                paymentTerms: [{ id: costCenterPaymentTerms }],
              },
            },
          })
          .mockResolvedValueOnce({
            data: {
              getOrganizationById: {
                addresses: {},
                customFields: {},
                paymentTerms: [{ id: organizationPaymentTerms }],
              },
            },
          }),
      },
      session: {
        getSession: jest.fn().mockResolvedValueOnce({
          sessionData: {
            namespaces: {
              'storefront-permissions': {
                costcenter: {
                  value: randUuid(),
                },
                organization: {
                  value: randUuid(),
                },
              },
            },
          },
        }),
      },
      vbase: {
        getJSON: jest.fn().mockResolvedValueOnce({}),
      },
    },
    response: {} as Response,
    set: jest.fn(),
    vtex: {
      logger: jest.fn(),
      sessionToken: jest.fn().mockResolvedValueOnce({}),
      storeUserAuthToken: jest.fn().mockResolvedValueOnce({ data: {} }),
    },
  } as unknown as Context
}

describe('given Routes to call b2b checkout settings', () => {
  describe('when have the cost center and organization with payment terms', () => {
    let context: Context

    beforeEach(async () => {
      context = mockContext()
      await index.settings(context)
    })
    it('should return payments terms from cost center', () => {
      const { response } = context

      expect(response.status).toEqual(200)
      expect(
        (response.body as ResponseBody)?.paymentTerms.some(
          (item: PaymentTerm) => item.id === costCenterPaymentTerms
        )
      ).toBeTruthy()

      expect(
        (response.body as ResponseBody)?.paymentTerms.some(
          (item: PaymentTerm) => item.id === organizationPaymentTerms
        )
      ).toBeFalsy()
    })
  })
  describe('when have just the organization with payment terms', () => {
    let context: Context

    beforeEach(async () => {
      graphQLQuery
        .mockResolvedValueOnce({ data: {} })
        .mockResolvedValueOnce({
          data: {
            getCostCenterById: {
              addresses: {},
              customFields: {},
              paymentTerms: [],
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            getOrganizationById: {
              addresses: {},
              customFields: {},
              paymentTerms: [{ id: organizationPaymentTerms }],
            },
          },
        })
      context = mockContext()
      await index.settings(context)
    })
    it('should return payments terms from organization', () => {
      const { response } = context

      expect(response.status).toEqual(200)
      expect(
        (response.body as ResponseBody)?.paymentTerms.some(
          (item: PaymentTerm) => item.id === costCenterPaymentTerms
        )
      ).toBeFalsy()

      expect(
        (response.body as ResponseBody)?.paymentTerms.some(
          (item: PaymentTerm) => item.id === organizationPaymentTerms
        )
      ).toBeTruthy()
    })
  })
})
