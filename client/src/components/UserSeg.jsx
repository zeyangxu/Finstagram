import React, { Component } from 'react';
import faker from 'faker';
import { List, Image, Header, Segment, Icon } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class UserSeg extends Component {
  state = { userList: null };
  getSession = () => {
    const { cookies } = this.props;
    return cookies.cookies.sessionID;
  };
  async componentDidMount() {
    const sessionID = this.getSession();
    try {
      const result = await fetch(`/api/follow/following/${sessionID}`);
      const json = await result.json();
      const list = json.result.map(i => {
        return { avatar: faker.internet.avatar(), name: i.followeeUsername };
      });
      this.setState({ userList: list });
    } catch (err) {
      console.error(err);
      this.props.history.push('/');
    }
  }
  render() {
    const { userList } = this.state;
    return (
      <div>
        <Segment>
          <Header>
            <Header.Content>Following</Header.Content>
          </Header>
          <List divided verticalAlign="middle">
            {userList &&
              userList.map((i, index) => {
                return (
                  <List.Item key={index}>
                    <Image avatar src={i.avatar} />
                    <List.Content>{i.name}</List.Content>
                  </List.Item>
                );
              })}
          </List>
        </Segment>
      </div>
    );
  }
}
UserSeg.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default compose(
  withCookies,
  withRouter
)(UserSeg);
