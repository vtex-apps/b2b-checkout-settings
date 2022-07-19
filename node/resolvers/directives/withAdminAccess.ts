/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-params */
import type { GraphQLField } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'
import { AuthenticationError, ForbiddenError } from '@vtex/api'

export class WithPermissions extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root: any, args: any, ctx: Context, info: any) => {
      const {
        clients: { authUser },
        vtex: { adminUserAuthToken, logger },
      } = ctx

      if (!adminUserAuthToken) {
        throw new AuthenticationError('Unauthorized')
      }

      try {
        await authUser.validateToken({
          token: adminUserAuthToken,
        })

        return resolve(root, args, ctx, info)
      } catch (error) {
        const {
          response: { status },
        } = error

        switch (status) {
          case 401: {
            throw new AuthenticationError('Unauthorized')
          }

          case 403: {
            throw new ForbiddenError('Unauthorized Access')
          }

          default: {
            logger.error({
              message: 'saveAppSettings-authUser-error',
              error,
            })
          }
        }
      }
    }
  }
}
