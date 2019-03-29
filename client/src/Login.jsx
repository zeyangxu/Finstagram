import React, { Component } from 'react';
import { Grid, Segment, Button, Form, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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

              <Form>
                <Form.Field>
                  <label>User name</label>
                  <input placeholder="abc123" />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input />
                </Form.Field>
                <Form.Field>
                  don't have an account?
                  <Link to="/signup"> sign up</Link>
                </Form.Field>
                <Button color="blue" fluid type="submit">
                  Sign in
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
