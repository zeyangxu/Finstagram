import React, { Component } from 'react';
import {
  Grid,
  Checkbox,
  Segment,
  Button,
  Form,
  Header,
  Responsive,
  Message
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Signup extends Component {
  // * Production version
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     username: '',
  //     errUsername: false,
  //     password: '',
  //     errPassword: false,
  //     fname: '',
  //     errFname: false,
  //     lname: '',
  //     errLname: false,
  //     re_password: '',
  //     errRepassword: false,
  //     termsIsChecked: false,
  //     passwordIsValid: true,
  //     showWarningMsg: false,
  //     inputIsValid: true,
  //     errMsgList: []
  //   };
  //   this.handleInputChange = this.handleInputChange.bind(this);
  //   this.postAuth = this.postAuth.bind(this);
  // }

  // * Dev version
  constructor(props) {
    super(props);
    this.state = {
      username: 'zebxu',
      errUsername: false,
      password: '123',
      errPassword: false,
      fname: 'zeyang',
      errFname: false,
      lname: 'xu',
      errLname: false,
      re_password: '123',
      errRepassword: false,
      termsIsChecked: true,
      passwordIsValid: true,
      showWarningMsg: false,
      errMsgList: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postAuth = this.postAuth.bind(this);
  }

  validate = () => {
    const {
      username,
      password,
      fname,
      lname,
      re_password,
      termsIsChecked,
      passwordIsValid
    } = this.state;
    let errMsgList = [];
    let isValid = true;

    // check if there is any empty input
    const map = {
      username: 'errUsername',
      fname: 'errFname',
      lname: 'errLname',
      password: 'errPassword',
      re_password: 'errRepassword'
    };
    const data = { username, password, re_password, fname, lname };
    let emptyStrFlag = false;
    for (const key in data) {
      if (data[key].length === 0) {
        this.setState({ [map[key]]: true });
        emptyStrFlag = true;
      }
    }
    if (emptyStrFlag) {
      isValid = false;
      errMsgList.push('all fileds must be filled');
    }

    // check terms & conditions
    if (!termsIsChecked) {
      isValid = false;
      errMsgList.push('you have to accept terms and condition');
    }

    // check repeat password
    if (!passwordIsValid) {
      isValid = false;
      errMsgList.push("password doesn't match");
    }

    // add more validation rules...
    // turn the isValid flag and push error message to errMsgList

    this.setState({ errMsgList: errMsgList });
    return isValid;
  };

  postAuth = async () => {
    const { username, password, fname, lname } = this.state;

    // validate input
    if (this.validate()) {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, fname, lname })
        });
        const json = await res.json();
        if (res.status === 201) {
          this.props.history.push('/');
        } else {
          let err_list = [];
          const error_map = {
            ER_DUP_ENTRY: 'user name already exists'
          };
          if (error_map[json.error]) {
            err_list.push(error_map[json.error]);
          } else {
            err_list.push(json.error);
          }
          this.setState({
            showWarningMsg: true,
            errMsgList: err_list,
            errUsername: true
          });
          console.log(json.error);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      this.setState({
        showWarningMsg: true
      });
    }
  };

  handleInputChange = async e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    await this.setState({ [name]: value });
    if (
      (name === 're_password') &
      (this.state.re_password === this.state.password)
    ) {
      this.setState({ passwordIsValid: true });
    } else if (
      (name === 're_password') &
      (this.state.re_password !== this.state.password)
    ) {
      this.setState({ passwordIsValid: false });
    }
  };

  toggle = () => {
    this.setState({ termsIsChecked: !this.state.termsIsChecked });
  };

  render() {
    const {
      username,
      password,
      fname,
      lname,
      re_password,
      termsIsChecked,
      passwordIsValid,
      showWarningMsg,
      errUsername,
      errPassword,
      errFname,
      errLname,
      errRepassword,
      errMsgList
    } = this.state;
    return (
      <div>
        <Responsive minWidth={768}>
          <Grid centered style={{ paddingTop: '3rem' }}>
            <Grid.Column width={6}>
              <Segment raised>
                <Header
                  as="h1"
                  textAlign="center"
                  size="huge"
                  style={{
                    fontFamily: "'Pacifico', cursive",
                    fontSize: '50px',
                    color: '#ba68c8',
                    margin: '1rem 1rem 1rem 1rem'
                  }}
                >
                  Finstagram
                </Header>
                <Header textAlign="center">
                  <Header.Subheader style={{ fontSize: '20px' }}>
                    Sign up to starts your finstagram or
                  </Header.Subheader>
                  <Link to="/login">log in</Link>
                </Header>
                <Form onSubmit={this.postAuth}>
                  <Form.Field>
                    <label>User name</label>
                    <Form.Input
                      placeholder="abc123"
                      name="username"
                      value={username}
                      onChange={this.handleInputChange}
                      error={errUsername}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Name</label>
                    <Form.Input
                      placeholder="first name"
                      name="fname"
                      value={fname}
                      onChange={this.handleInputChange}
                      error={errFname}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      placeholder="last name"
                      name="lname"
                      value={lname}
                      onChange={this.handleInputChange}
                      error={errLname}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>
                      Password
                      {passwordIsValid ? null : (
                        <span style={{ color: 'red' }}>
                          {' '}
                          *password doesn't match
                        </span>
                      )}
                    </label>
                    <Form.Input
                      value={password}
                      name="password"
                      type="password"
                      onChange={this.handleInputChange}
                      error={errPassword}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      placeholder="repeat your password"
                      value={re_password}
                      name="re_password"
                      type="password"
                      onChange={this.handleInputChange}
                      error={errRepassword}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="I agree to the Terms and Conditions"
                      checked={termsIsChecked}
                      onChange={this.toggle}
                    />
                  </Form.Field>

                  <Button color="blue" fluid type="submit">
                    Submit
                  </Button>
                </Form>
              </Segment>
              {showWarningMsg ? (
                <Message error attached="bottom" list={errMsgList} />
              ) : null}
            </Grid.Column>
          </Grid>
        </Responsive>

        <Responsive {...Responsive.onlyMobile}>
          <Segment raised />
        </Responsive>
      </div>
    );
  }
}
