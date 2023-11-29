export const QUERIES = {
  getPermission: `query permissions {
    checkUserPermission {
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
      customFields {
        name
        value
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
      customFields {
        name
        value
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
        reference
      }
    }
  }
  `,
}
