import { VBASE_BUCKET, VBASE_SETTINGS_FILE, DEFAULTS } from '../constants'

export default {
  appSettings: async (_: void, __: void, ctx: Context) => {
    const {
      clients: { vbase },
      vtex: { logger },
    } = ctx

    let settings = null

    try {
      settings = await vbase.getJSON(VBASE_BUCKET, VBASE_SETTINGS_FILE, true)
    } catch (error) {
      logger.error({
        message: 'appSettings-getVbaseError',
        error,
      })
    }

    if (!settings) {
      settings = DEFAULTS
    }

    return settings
  },
}
