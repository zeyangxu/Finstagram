import React, { Component } from 'react';
import {
  Button,
  Grid,
  Dimmer,
  Loader,
  Container,
  Header,
  Image
} from 'semantic-ui-react';
import faker from 'faker';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import PhotoList from './PhotoList';

class OtherUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      followState: 'Follow'
    };
    this.fileInput = React.createRef();
  }
  // check isFollow
  checkFollow = async () => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    if (this.props.match.params.username === this.props.username) {
      this.setState({ followState: 'yourself' });
      return;
    }
    try {
      const res = await fetch(
        `/api/follow/isfollow/${sessionID}?user=${
          this.props.match.params.username
        }`
      );
      const json = await res.json();
      if (res.status === 200) {
        this.setState({ followState: json.result });
      }
    } catch (err) {
      console.error(err);
    }
  };
  async componentDidMount() {
    this.checkFollow();
  }
  startLoader = () => {
    console.log('startLoader()');
    this.setState({ loading: true });
  };
  stopLoader = () => {
    console.log('stopLoader()');
    this.setState({ loading: false });
  };
  handleFollowClick = async () => {
    // make a follow request
    const { cookies } = this.props;
    const { followState } = this.state;
    const sessionID = cookies.cookies.sessionID;
    if (followState === 'Follow') {
      try {
        const res = await fetch(
          `/api/follow/request/${sessionID}?user=${
            this.props.match.params.username
          }`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        if (res.status === 200) {
          this.checkFollow();
        } else {
          console.error('request follow failed');
        }
      } catch (err) {
        console.error(err);
      }
    } else if (followState === 'Following') {
      try {
        const res = await fetch(
          `/api/follow/unfollow/${sessionID}?user=${
            this.props.match.params.username
          }`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        if (res.status === 200) {
          this.checkFollow();
        } else {
          console.error('unfollow failed');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      this.checkFollow();
    }
  }
  render() {
    const { loading, followState } = this.state;
    return (
      <div>
        <Navbar username={this.props.username} />
        <Container style={{ marginTop: '2rem' }}>
          <Header
            as="h1"
            icon
            textAlign="center"
            style={{ marginBottom: '5rem' }}
          >
            <Image avatar size="massive" src={faker.internet.avatar()} />
            <Header.Content>{this.props.match.params.username}</Header.Content>
            {followState !== 'yourself' && (
              <Button
                disabled={followState === 'Requested'}
                color={followState === 'Following' ? 'grey' : 'blue'}
                onClick={this.handleFollowClick}
              >
                {followState === 'Following' ? 'Unfollow' : followState}
              </Button>
            )}
          </Header>
          <Dimmer active={loading}>
            <Loader>Loading</Loader>
          </Dimmer>

          <Grid>
            <Grid.Column>
              <PhotoList
                fetchType="otheruser"
                loading={loading}
                startLoader={this.startLoader}
                stopLoader={this.stopLoader}
              />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}
OtherUser.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default withCookies(OtherUser);
