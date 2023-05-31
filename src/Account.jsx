import React from 'react'
import {
  Menu,
  Container,
  Button,
  Label,
  Icon,
} from 'semantic-ui-react'
import qs from 'qs'

function Main(props) {
  const signin = () => {
    const state = Math.random().toString(36).slice(2, 11)
    const client_id = import.meta.env.VITE_CLIENT_ID
    const params = {
      response_type: 'code',
      scope: 'profile',
      client_id,
      state,
    }
    const queryString = qs.stringify(params)
    window.location.href = `${import.meta.env.VITE_KEYHUB_ENDPOINT}/api/v1/oauth2/authorize?${queryString}`
  }

  const signout = () => {
    props.setAccount(null)
    localStorage.removeItem('account')
  }

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
        <Menu.Menu position="left">
          {
            props.account ?
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'space-between' }}>
                  <Label basic>
                    <Icon name="user" />{props.account}
                  </Label>
                  <Label basic style={{ marginTop: '0.2em', marginRight: 'auto' }}>
                    <Icon name="money" />{props.balance} cCDTs
                  </Label>
                  <Label basic style={{ marginTop: '0.2em', marginRight: 'auto' }}>
                    <Icon name="linkify" />{props.rpc}
                  </Label>
                </div>
              </div>
              :
              <div>
                <Label basic style={{ marginTop: '0.2em', marginRight: 'auto' }}>
                  <Icon name="linkify" />{props.rpc}
                </Label>
              </div>
          }
        </Menu.Menu>
        <Menu.Menu position='right'>
          <div style={{ margin: 'auto' }}>
            <Button
              basic
              circular
              color="grey"
              floated="right"
              icon={props.account ? "sign out" : "sign in"}
              onClick={props.account ? signout : signin}
            />
          </div>
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default function Account(props) {
  return <Main {...props} />
}
