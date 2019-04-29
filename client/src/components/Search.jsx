import faker from 'faker';
import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class MySearch extends Component {
  state = { source: null };

  async componentDidMount() {}

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: '' });

  handleResultSelect = (e, { result }) => {
    if (this.props.mode === 'invite') {
      this.props.addUser(result.title);
      this.setState({ value: '' });
    } else {
      this.props.history.push(`/user/${result.title}`);
    }
  };

  handleSearchChange = async (e, { value }) => {
    await this.setState({ isLoading: true, value });
    const input = this.state.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let results = [];
    try {
      const res = await fetch(`/api/search/user?keyword=${input}`);
      if (res.status === 200) {
        const json = await res.json();
        results = json.result.map(i => {
          return {
            title: i.username,
            image: faker.internet.avatar(),
            description: `${i.fname} ${i.lname}`
          };
        });
      } else if (res.status === 401) {
        this.props.history.push('/login');
      }
    } catch (err) {
      console.error(err);
    }

    if (input.length < 1) return this.resetComponent();

    this.setState({
      isLoading: false,
      results
    });
  };

  render() {
    const { isLoading, value, results } = this.state;
    return (
      <Search
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        results={results}
        value={value}
      />
    );
  }
}
MySearch.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default compose(
  withCookies,
  withRouter
)(MySearch);
