import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import { useSubstrateState } from '../'
import utils from '../utils'
import qs from 'qs'

function TxButton({
  attrs = null,
  color = 'blue',
  disabled = false,
  label,
  setStatus,
  style = null,
  type = 'QUERY',
  txOnClickHandler = null,
  account = null,
}) {
  // Hooks
  const { api } = useSubstrateState()
  const [unsub, setUnsub] = useState(null)

  const { palletRpc, callable, inputParams, paramFields } = attrs

  const isQuery = () => type === 'QUERY'
  const isSudo = () => type === 'SUDO-TX'
  const isUncheckedSudo = () => type === 'UNCHECKED-SUDO-TX'
  const isUnsigned = () => type === 'UNSIGNED-TX'
  const isSigned = () => type === 'SIGNED-TX'
  const isRpc = () => type === 'RPC'
  const isConstant = () => type === 'CONSTANT'

  const signedTx = () => {
    const transformed = transformParams(paramFields, inputParams)
    if (!account) {
      return
    }
    const connectedSocket = localStorage.getItem('rpc')
    const params = {
      endpoint: connectedSocket,
      account,
      palletRpc,
      callable,
      params: transformed.toString(),
    }
    window.open(`${import.meta.env.VITE_KEYHUB_ENDPOINT}/sign?${qs.stringify(params)}`, '_blank', 'noopener, noreferrer')
  }

  const unsignedTx = async () => {
    // transformed can be empty parameters
    const transformed = transformParams(paramFields, inputParams)
    if (!account) {
      return
    }
    const params = {
      account,
      palletRpc,
      callable,
      params: transformed.toString()
    }
    window.open(`${import.meta.env.VITE_KEYHUB_ENDPOINT}/sign?${qs.stringify(params)}`, '_blank', 'noopener, noreferrer')
  }

  const queryResHandler = result =>
    result.isNone ? setStatus('None') : setStatus(result.toString())

  const query = async () => {
    const transformed = transformParams(paramFields, inputParams)
    const unsub = await api.query[palletRpc][callable](
      ...transformed,
      queryResHandler
    )

    setUnsub(() => unsub)
  }

  const rpc = async () => {
    const transformed = transformParams(paramFields, inputParams, {
      emptyAsNull: false,
    })
    const unsub = await api.rpc[palletRpc][callable](
      ...transformed,
      queryResHandler
    )
    setUnsub(() => unsub)
  }

  const constant = () => {
    const result = api.consts[palletRpc][callable]
    result.isNone ? setStatus('None') : setStatus(result.toString())
  }

  const transaction = async () => {
    if (typeof unsub === 'function') {
      unsub()
      setUnsub(null)
    }

    // setStatus('Sending...')

    const asyncFunc =
      (isSudo() && sudoTx) ||
      (isUncheckedSudo() && uncheckedSudoTx) ||
      (isSigned() && signedTx) ||
      (isUnsigned() && unsignedTx) ||
      (isQuery() && query) ||
      (isRpc() && rpc) ||
      (isConstant() && constant)

    await asyncFunc()

    return txOnClickHandler && typeof txOnClickHandler === 'function'
      ? txOnClickHandler(unsub)
      : null
  }

  const transformParams = (
    paramFields,
    inputParams,
    opts = { emptyAsNull: true }
  ) => {
    // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
    //   Otherwise, it will not be added
    const paramVal = inputParams.map(inputParam => {
      // To cater the js quirk that `null` is a type of `object`.
      if (
        typeof inputParam === 'object' &&
        inputParam !== null &&
        typeof inputParam.value === 'string'
      ) {
        return inputParam.value.trim()
      } else if (typeof inputParam === 'string') {
        return inputParam.trim()
      }
      return inputParam
    })
    const params = paramFields.map((field, ind) => ({
      ...field,
      value: paramVal[ind] || null,
    }))

    return params.reduce((memo, { type = 'string', value }) => {
      if (value == null || value === '')
        return opts.emptyAsNull ? [...memo, null] : memo

      let converted = value

      // Deal with a vector
      if (type.indexOf('Vec<') >= 0) {
        converted = converted.split(',').map(e => e.trim())
        converted = converted.map(single =>
          isNumType(type)
            ? single.indexOf('.') >= 0
              ? Number.parseFloat(single)
              : Number.parseInt(single)
            : single
        )
        return [...memo, converted]
      }

      // Deal with a single value
      if (isNumType(type)) {
        converted =
          converted.indexOf('.') >= 0
            ? Number.parseFloat(converted)
            : Number.parseInt(converted)
      }
      return [...memo, converted]
    }, [])
  }

  const isNumType = type =>
    utils.paramConversion.num.some(el => type.indexOf(el) >= 0)

  const allParamsFilled = () => {
    if (paramFields.length === 0) {
      return true
    }

    return paramFields.every((paramField, ind) => {
      const param = inputParams[ind]
      if (paramField.optional) {
        return true
      }
      if (param == null) {
        return false
      }

      const value = typeof param === 'object' ? param.value : param
      return value !== null && value !== ''
    })
  }

  return (
    <Button
      basic
      size="mini"
      color={color}
      style={style}
      type="submit"
      onClick={transaction}
      disabled={
        disabled ||
        !account ||
        !palletRpc ||
        !callable ||
        !allParamsFilled()
      }
    >
      {label}
    </Button>
  )
}

// prop type checking
TxButton.propTypes = {
  setStatus: PropTypes.func.isRequired,
  account: PropTypes.string,
  type: PropTypes.oneOf([
    'QUERY',
    'RPC',
    'SIGNED-TX',
    'UNSIGNED-TX',
    'SUDO-TX',
    'UNCHECKED-SUDO-TX',
    'CONSTANT',
  ]).isRequired,
  attrs: PropTypes.shape({
    palletRpc: PropTypes.string,
    callable: PropTypes.string,
    inputParams: PropTypes.array,
    paramFields: PropTypes.array,
  }).isRequired,
}

function TxGroupButton(props) {
  return (
    <Button.Group size="mini">
      <TxButton label="Unsigned" type="UNSIGNED-TX" color="grey" {...props} />
      <Button.Or />
      <TxButton label="Signed" type="SIGNED-TX" color="blue" {...props} />
    </Button.Group>
  )
}

export { TxButton, TxGroupButton }
