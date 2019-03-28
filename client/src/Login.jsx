import React, { Component } from 'react';
import {
  Grid,
  Checkbox,
  Segment,
  Button,
  Form,
  Header
} from 'semantic-ui-react';

export default class Login extends Component {
  render() {
    return (
      <div>
        <Grid centered columns={3} style={{ paddingTop: '5rem' }}>
          <Grid.Column>
            <Segment raised>
              <Header
                as="h1"
                textAlign="center"
                size="huge"
                style={{
                  fontFamily: "'Pacifico', cursive",
                  fontSize: '50px',
                  color: '#ba68c8',
                  marginTop: '1rem',
                  marginBottom: '3rem'
                }}
              >
                Finstagram
              </Header>
              <Header textAlign="center">
                <Header.Subheader style={{ fontSize: '20px' }}>
                  Signin
                </Header.Subheader>
              </Header>
              <Form>
                <Form.Field>
                  <label>Email</label>
                  <input placeholder="abc123@abc.com" />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input />
                </Form.Field>
                <Form.Field>
                  <Checkbox label="I agree to the Terms and Conditions" />
                </Form.Field>
                <Button color="blue" fluid type="submit">
                  Submit
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
