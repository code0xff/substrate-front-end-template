import React from 'react'
import {
  Menu,
  Container,
  Button,
} from 'semantic-ui-react'
// import { useSubstrate, useSubstrateState } from './substrate-lib'

function Main(props) {
  // const {
  //   setCurrentAccount,
  //   state: { keyring, currentAccount },
  // } = useSubstrate()

  // const onChange = (_, data) => {
  //   setFormState(prev => ({ ...prev, [data.state]: data.value }))
  // }

  return (
    <Menu
      attached="top"
      tabular
      style={{
        backgroundColor: '#fff',
        borderColor: '#fff',
        paddingTop: '1em',
        paddingBottom: '1em',
      }}
    >
      <Container>
        <Menu.Menu position="right" style={{ alignItems: 'center' }}>
          <Button
            basic
            circular
            color="grey"
            floated="right"
            icon="sign in"
          />
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default function Account(props) {
  return <Main {...props} />
}
