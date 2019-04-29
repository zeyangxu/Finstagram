import faker from 'faker';
import React, { Component } from 'react';
import { Message, Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class MultiSelectSearch extends Component {
  state = {
    results: [],
    selectedValue: [],
    showMsg: false,
    errMsg: ''
  };

  async componentDidMount() {
    try {
      const res = await fetch('/api/search/user/all');
      const json = await res.json();
      if (res.status === 200) {
        const clean = json.result.map((i, index) => {
          return {
            key: i.username,
            text: i.username,
            value: index,
            image: faker.internet.avatar()
          };
        });
        this.setState({ results: clean });
      } else {
        throw new Error('server error');
      }
    } catch (err) {
      console.error(err);
    }
  }

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      searchQuery: ''
    });

  multiSelectOnChange = (e, { value }) => {
    const { results } = this.state;
    const users = value.map(i => results[i].text);
    this.setState({ selectedValue: users });
  };
  addUsers = async () => {
    const { selectedGroupName, cookies } = this.props;
    const { selectedValue } = this.state;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/groups/add/list/${sessionID}`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName: selectedGroupName,
          users: selectedValue
        })
      });

      if (res.status === 200) {
        this.props.getGroupUsers(selectedGroupName, true);
      } else if (res.status === 401) {
        this.props.history.push('/');
      } else if (res.status === 400) {
        const json = await res.json();
        this.setState({ showMsg: true, errMsg: json.error });
      }
    } catch (err) {
      console.error(err);
      this.props.history.push('/');
    }
  };
  tagUsers = async () => {
    const { photoID, cookies, isPublic } = this.props;
    const { selectedValue } = this.state;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/tag/add/${sessionID}`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoID,
          users: selectedValue,
          isPublic
        })
      });

      if (res.status === 200) {
        this.props.rerender();
      } else if (res.status === 401) {
        this.props.history.push('/');
      } else if (res.status === 400) {
        const json = await res.json();
        this.setState({ showMsg: true, errMsg: json.error });
      }
    } catch (err) {
      console.error(err);
      this.props.history.push('/');
    }
  };
  render() {
    const { isLoading, results, showMsg, errMsg } = this.state;
    return (
      <>
        <Dropdown
          loading={isLoading}
          options={results}
          placeholder="Search users..."
          onChange={this.multiSelectOnChange}
          minCharacters={3}
          clearable
          multiple
          search
          selection
        />
        {this.props.mode === 'invite' && (
          <Button
            primary
            style={{ margin: '2rem 0 0 1rem' }}
            onClick={this.addUsers}
          >
            Invite
          </Button>
        )}
        {this.props.mode === 'tag' && (
          <Button primary style={{ marginTop: '1rem' }} onClick={this.tagUsers}>
            Request Tag
          </Button>
        )}
        {showMsg && (
          <Message negative>
            <Message.Header>{errMsg}</Message.Header>
          </Message>
        )}
      </>
    );
  }
}
MultiSelectSearch.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default compose(
  withCookies,
  withRouter
)(MultiSelectSearch);
