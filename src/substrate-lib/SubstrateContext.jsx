import React, { useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
import { ApiPromise, WsProvider } from '@polkadot/api'

import config from '../config'

const parsedQuery = new URLSearchParams(window.location.search)
const connectedSocket = parsedQuery.get('rpc') || import.meta.env.VITE_PROVIDER_SOCKET
///
// Initial state for `useReducer`

const initialState = {
  // These are the states
  socket: connectedSocket,
  jsonrpc: { ...jsonrpc, ...config.CUSTOM_RPC_METHODS },
  api: null,
  apiError: null,
  apiState: null,
}

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT' }
    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' }
    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' }
    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload }
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

///
// Connecting to the Substrate node

const connect = (state, dispatch) => {
  const { apiState, socket, jsonrpc } = state
  // We only want this function to be performed once
  if (apiState) return

  dispatch({ type: 'CONNECT_INIT' })

  console.log(`Connected socket: ${socket}`)
  const provider = new WsProvider(socket)
  const _api = new ApiPromise({ provider, rpc: jsonrpc })

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: _api })
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(_api => dispatch({ type: 'CONNECT_SUCCESS' }))
  })
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }))
  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }))
}

const SubstrateContext = React.createContext()

const SubstrateContextProvider = props => {
  const neededPropNames = ['socket']
  neededPropNames.forEach(key => {
    initialState[key] =
      typeof props[key] === 'undefined' ? initialState[key] : props[key]
  })

  const [state, dispatch] = useReducer(reducer, initialState)
  connect(state, dispatch)

  return (
    <SubstrateContext.Provider value={{ state }}>
      {props.children}
    </SubstrateContext.Provider>
  )
}

// prop typechecking
SubstrateContextProvider.propTypes = {
  socket: PropTypes.string,
}

const useSubstrate = () => useContext(SubstrateContext)
const useSubstrateState = () => useContext(SubstrateContext).state

export { SubstrateContextProvider, useSubstrate, useSubstrateState }
