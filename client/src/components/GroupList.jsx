import React, { Component } from 'react';
import faker from 'faker';
import {
  Modal,
  Grid,
  Icon,
  Message,
  Label,
  Form,
  Header,
  List,
  Image,
  Button,
  Segment
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Search from './Search';
import MultiSearch from './MultiSelectSearch';

class NestedModal extends Component {
  state = { open: false };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });
  deleteGroup = async e => {
    const { cookies, groupName } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/groups/delete/${sessionID}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName: groupName })
      });
      const json = await res.json();
      if (res.status === 200) {
        this.close();
        this.props.getData();
      } else if (res.status === 400) {
        this.props.history.push('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };
  render() {
    const { open } = this.state;

    return (
      <Modal
        open={open}
        onOpen={this.open}
        onClose={this.close}
        size="small"
        trigger={
          <Button icon style={{ marginLeft: '3rem' }} color="red">
            Remove Group <Icon name="right chevron" />
          </Button>
        }
      >
        <Modal.Header>Modal #2</Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to delete <span>{this.props.groupName}</span>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="trash alternate outline"
            color="red"
            content="Comfirm"
            onClick={this.deleteGroup}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
class GroupList extends Component {
  state = {
    groupList: [],
    modalOpen: false,
    newModalOpen: false,
    newGroupName: '',
    showWarningMsg: false,
    errMsgList: [],
    selectedGroupName: '',
    groupMemberList: []
  };
  getData = async () => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/groups/own/${sessionID}`);
      const json = await res.json();

      this.setState({
        groupList: json.data,
        newModalOpen: false,
        modalOpen: false
      });
    } catch (err) {
      console.error(err);
      this.props.history.push('/');
    }
  };
  componentDidMount() {
    this.getData();
  }
  openItemModal = async (e, { name }) => {
    console.log('target: ' + name);
    const list = await this.getGroupUsers(name, false);
    this.setState({
      modalOpen: true,
      selectedGroupName: name,
      groupMemberList: list
    });
  };
  closeItemModal = () => {
    this.setState({ modalOpen: false });
  };
  openNewItemModal = () => {
    this.setState({ newModalOpen: true });
  };
  closeNewItemModal = () => {
    this.setState({ newModalOpen: false });
  };
  groupNameOnChange = e => {
    this.setState({ newGroupName: e.target.value });
  };
  createGroup = async () => {
    const { cookies } = this.props;
    const { newGroupName, errMsgList } = this.state;
    if (newGroupName === '') {
      this.setState({
        showWarningMsg: true,
        errMsgList: errMsgList.concat('Group name cannot be empty!')
      });
      return;
    }
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/groups/create/${sessionID}`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName: newGroupName })
      });
      const json = await res.json();
      if (res.status === 200) {
        this.setState({ newGroupName: '' });
        this.getData();
      } else if (res.status === 400) {
        this.props.history.push('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };
  getGroupUsers = async (groupName, shouldChangeState) => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(
        `/api/groups/users/${sessionID}?groupName=${groupName}`
      );
      const json = await res.json();
      if (res.status === 200) {
        if (shouldChangeState) {
          this.setState({ groupMemberList: json.data });
        } else {
          return json.data;
        }
      }
    } catch (err) {
      console.error(err);
      this.props.history.push('/');
    }
  };
  render() {
    const {
      groupList,
      modalOpen,
      newModalOpen,
      newGroupName,
      showWarningMsg,
      errMsgList,
      selectedGroupName,
      groupMemberList
    } = this.state;
    return (
      <div>
        <Modal
          dimmer="inverted"
          open={newModalOpen}
          onClose={this.closeNewItemModal}
        >
          <Modal.Header>Create a group</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <Form onSubmit={this.createGroup}>
                <Form.Field>
                  <label>Group Name</label>
                  <input
                    value={newGroupName}
                    onChange={this.groupNameOnChange}
                  />
                </Form.Field>
                <Button type="submit" color="blue">
                  Create
                </Button>
              </Form>
              {showWarningMsg ? <Message error list={errMsgList} /> : null}
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <Modal dimmer="inverted" open={modalOpen} onClose={this.closeItemModal}>
          <Modal.Header>
            Invite a user
            <NestedModal
              groupName={selectedGroupName}
              getData={this.getData}
              cookies={this.props.cookies}
            />
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {groupMemberList.map(i => {
                  return (
                    <Label size="huge" key={i} style={{ marginBottom: '1rem' }}>
                      <Image avatar src={faker.internet.avatar()} alt="" />
                      {i}
                    </Label>
                  );
                })}
              </div>
              <MultiSearch
                selectedGroupName={selectedGroupName}
                getGroupUsers={this.getGroupUsers}
              />
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              floated="right"
              content="Done"
              icon="close"
              style={{ marginBottom: '1rem' }}
              onClick={this.closeItemModal}
            />
          </Modal.Actions>
        </Modal>
        <Segment>
          <List divided verticalAlign="middle">
            <Header>
              <Header.Content>Your Group</Header.Content>
              <Button
                color="violet"
                floated="right"
                size="mini"
                onClick={this.openNewItemModal}
              >
                New Group
              </Button>
            </Header>
            {groupList &&
              groupList.map((i, index) => {
                return (
                  <List.Item
                    key={index}
                    name={i.groupName}
                    onClick={this.openItemModal}
                    style={{ cursor: 'pointer' }}
                  >
                    <Image avatar src={faker.internet.avatar()} />
                    <List.Content>
                      <List.Header>{i.groupName}</List.Header>
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
GroupList.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default compose(
  withCookies,
  withRouter
)(GroupList);
