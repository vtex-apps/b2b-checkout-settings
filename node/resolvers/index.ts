/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ForbiddenError } from '@vtex/api'

import Mutation from './Mutations'
import Query from './Queries'
import Routes from './Routes'

export const resolvers = {
  Routes,
  Query,
  Mutation,
}
