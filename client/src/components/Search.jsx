import faker from 'faker';
import React, { Component } from 'react';
import {
  Button,
  Search,
  Grid,
  Header,
  Segment,
  Label,
  Image
} from 'semantic-ui-react';
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

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = async (e, { value }) => {
    await this.setState({ isLoading: true, value });
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    const input = this.state.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let results = [];
    try {
      const res = await fetch(`api/search/all/${sessionID}?keyword=${input}`);
      if (res.status === 200) {
        const json = await res.json();
        results = json.result.map(i => {
          return {
            title: i.username,
            image: faker.internet.avatar(),
            price:
              i.acceptedfollow === null
                ? null
                : i.acceptedfollow === 1
                ? 'followed'
                : 'requested',
            description: `${i.fname} ${i.lname}`
          };
        });
      } else if (res.status === 400) {
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
