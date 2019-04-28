import faker from 'faker';
import React, { Component } from 'react';
import { Button, Search, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class MultiSelectSearch extends Component {
  state = {
    results: [],
    selectedValue: []
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
      }
    } catch (err) {
      console.error(err);
      this.props.history.push('/');
    }
  };
  render() {
    const { isLoading, results } = this.state;
    return (
      <>
        <Dropdown
          loading={isLoading}
          options={results}
          placeholder="Group"
          onChange={this.multiSelectOnChange}
          minCharacters={3}
          clearable
          multiple
          search
          selection
        />
        <Button primary style={{ marginTop: '2rem' }} onClick={this.addUsers}>
          Invite
        </Button>
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
