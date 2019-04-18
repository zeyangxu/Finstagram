import React, { Component } from 'react';
import faker from 'faker';
import { List, Image, Button, Segment } from 'semantic-ui-react';

export default class UserSeg extends Component {
  state = { userList: null };
  componentDidMount() {
    const list = [...new Array(10)].map(i => {
      return { avatar: faker.internet.avatar(), name: faker.name.findName() };
    });
    this.setState({ userList: list });
  }
  render() {
    const { userList } = this.state;
    return (
      <div>
        <Segment>
          <List divided verticalAlign="middle">
            {userList &&
              userList.map((i, index) => {
                return (
                  <List.Item key={index}>
                    <Image avatar src={i.avatar} />
                    <List.Content>{i.name}</List.Content>
                    <List.Content floated="right">
                      <Button size="tiny">Unfollow</Button>
                    </List.Content>
                  </List.Item>
                );
              })}
          </List>
        </Segment>
      </div>
    );
  }
}
