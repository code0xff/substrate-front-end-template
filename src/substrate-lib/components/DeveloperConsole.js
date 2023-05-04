// This component will simply add utility functions to your developer console.
import { useSubstrateState } from '../'

import * as util from '@polkadot/util'
import * as utilCrypto from '@polkadot/util-crypto'

export default function DeveloperConsole(props) {
  const { api, apiState, keyring, keyringState } = useSubstrateState()
  if (apiState === 'READY') {
    window.api = api
  }
  if (keyringState === 'READY') {
    window.keyring = keyring
  }
  window.util = util
  window.utilCrypto = utilCrypto

  return null
}
