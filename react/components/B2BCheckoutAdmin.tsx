import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { useIntl, FormattedMessage } from 'react-intl'
import {
  Layout,
  PageHeader,
  PageBlock,
  Button,
  ToastConsumer,
  ToastProvider,
  Toggle,
} from 'vtex.styleguide'

import APP_SETTINGS from '../graphql/appSettings.graphql'
import SAVE_APP_SETTINGS from '../graphql/saveAppSettings.graphql'

const AppSettings: FC = () => {
  const { formatMessage } = useIntl()

  const [settingsState, setSettingsState] = useState({
    showPONumber: false,
    hasPONumber: false,
    showQuoteButton: false,
  })

  const [settingsLoading, setSettingsLoading] = useState(false)

  const { data } = useQuery(APP_SETTINGS, {
    ssr: false,
  })

  const [saveSettings] = useMutation(SAVE_APP_SETTINGS)

  useEffect(() => {
    if (!data?.appSettings) return

    setSettingsState(data.appSettings)
  }, [data])

  const handleSaveSettings = async (showToast: any) => {
    setSettingsLoading(true)

    await saveSettings({
      variables: {
        settings: settingsState,
      },
    })
      .then(() => {
        showToast({
          message: formatMessage({
            id: 'admin/b2bCheckoutSettings.saveSettings.success',
          }),
          duration: 5000,
        })
        setSettingsLoading(false)
      })
      .catch(err => {
        console.error(err)
        showToast({
          message: formatMessage({
            id: 'admin/b2bCheckoutSettings.saveSettings.failure',
          }),
          duration: 5000,
        })
        setSettingsLoading(false)
      })
  }

  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: { showToast: any }) => (
          <Layout
            pageHeader={
              <PageHeader
                title={
                  <FormattedMessage id="admin/b2bCheckoutSettings.settings.title" />
                }
              />
            }
          >
            <PageBlock>
              <section className="pv4">
                <Toggle
                  semantic
                  label={formatMessage({
                    id: 'admin/b2bCheckoutSettings.settings.showPONumber.label',
                  })}
                  size="large"
                  checked={settingsState.showPONumber}
                  onChange={() => {
                    setSettingsState({
                      ...settingsState,
                      showPONumber: !settingsState.showPONumber,
                    })
                  }}
                  helpText={formatMessage({
                    id: 'admin/b2bCheckoutSettings.settings.showPONumber.helpText',
                  })}
                />
              </section>
              <section className="pv4">
                <Toggle
                  semantic
                  label={formatMessage({
                    id: 'admin/b2bCheckoutSettings.settings.showQuoteButton.label',
                  })}
                  size="large"
                  checked={settingsState.showQuoteButton}
                  onChange={() => {
                    setSettingsState({
                      ...settingsState,
                      showQuoteButton: !settingsState.showQuoteButton,
                    })
                  }}
                  helpText={formatMessage({
                    id: 'admin/b2bCheckoutSettings.settings.showQuoteButton.helpText',
                  })}
                />
              </section>
              <section className="pt4">
                <Button
                  variation="primary"
                  onClick={() => handleSaveSettings(showToast)}
                  isLoading={settingsLoading}
                >
                  {formatMessage({
                    id: 'admin/b2bCheckoutSettings.saveSettings.buttonText',
                  })}
                </Button>
              </section>
            </PageBlock>
          </Layout>
        )}
      </ToastConsumer>
    </ToastProvider>
  )
}

export default AppSettings
