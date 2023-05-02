import React, { createRef, useEffect } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Message,
  Sticky,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'
import Account from './Account'

import { useSearchParams } from 'react-router-dom'
import { requestToken, requestResource } from './oauth/oauth.js'
import { u8aToHex } from '@polkadot/util'
import { toUint8Array } from 'js-base64';
import { ApiPromise, WsProvider } from '@polkadot/api'

function Main() {
  const { apiState, apiError, } = useSubstrateState()
  const [account, setAccount] = React.useState()
  const [balance, setBalance] = React.useState()
  const [searchParams] = useSearchParams()

  const code = searchParams.get('code')
  useEffect(() => {
    async function queryBalance(universalAddress) {
      const publicKey = u8aToHex(toUint8Array(universalAddress.slice(1)))
      const provider = new WsProvider(import.meta.env.VITE_PROVIDER_SOCKET)
      const api = await ApiPromise.create({ provider })
      api.query.system.account(publicKey, ({ data: { free } }) => {
        if (free !== balance) {
          setBalance(free.toHuman())
        }
      })
    }

    let _account = localStorage.getItem('account')
    if (_account) {
      (async () => {
        setAccount(_account)
        await queryBalance(_account)
      })()
    } else {
      if (code) {
        (async () => {
          const tokenResponse = await requestToken(code)
          const tokenResult = await tokenResponse.text()
          const tokenJson = JSON.parse(tokenResult)

          const resourceResponse = await requestResource(tokenJson.access_token);
          const resourceResult = await resourceResponse.text()
          const { public_key } = JSON.parse(resourceResult)
          localStorage.setItem('account', public_key)
          setAccount(public_key)
          await queryBalance(public_key)
        })()
      }
    }
  }, [code])

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <Container>
        <Sticky context={contextRef}>
          <Account account={account} balance={balance} setAccount={setAccount} />
        </Sticky>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row>
            <Transfer account={account} />
            <Upgrade />
          </Grid.Row>
          <Grid.Row>
            <Interactor account={account} />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <TemplateModule />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
