import { WithPermissions } from './directives/withAdminAccess'

export const schemaDirectives = {
  withAdminAccess: WithPermissions as any,
}
