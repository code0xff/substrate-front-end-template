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
    const client_id = 'JJuzRtzmyV2S4h8tvLdR-Q'
    const params = {
      response_type: 'code',
      scope: 'profile',
      client_id,
      state,
    }
    const queryString = qs.stringify(params)
    window.location.href = `http://localhost:9999/api/v1/oauth2/authorize?${queryString}`
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
        <Menu.Menu position="right" style={{ alignItems: 'center' }}>
          {
            props.account ?
              <Label basic>
                <Icon name="user" />{props.account}
              </Label>
              :
              <Button
                basic
                circular
                color="grey"
                floated="right"
                icon="sign in"
                onClick={signin}
              />
          }
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default function Account(props) {
  return <Main {...props} />
}
