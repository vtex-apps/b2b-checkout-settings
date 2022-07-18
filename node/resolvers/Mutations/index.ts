import { GraphQLError } from 'graphql'

import { VBASE_BUCKET, VBASE_SETTINGS_FILE } from '../constants'

export interface Settings {
  showPONumber: boolean
  hasPONumber: boolean
  showQuoteButton: boolean
}

export default {
  saveAppSettings: async (
    _: void,
    { settings }: { settings: Settings },
    ctx: Context
  ) => {
    const {
      clients: { vbase },
      vtex: { logger },
    } = ctx

    if (!settings) throw new GraphQLError('Input not provided')

    try {
      await vbase.saveJSON(VBASE_BUCKET, VBASE_SETTINGS_FILE, settings)

      return settings
    } catch (error) {
      logger.error({
        message: 'appSettings-saveVbaseError',
        error,
      })

      throw new GraphQLError('Failed to save settings')
    }
  },
}
