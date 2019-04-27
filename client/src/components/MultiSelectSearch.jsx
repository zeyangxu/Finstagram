import faker from 'faker';
import React, { Component } from 'react';
import { Search, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class MultiSelectSearch extends Component {
  state = {
    source: null,
    results: [],
    searchQuery: '',
    selectedValue: ['leo']
  };

  async componentDidMount() {}

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      searchQuery: ''
    });

  // handleResultSelect = (e, { result }) => {
  //   if (this.props.mode === 'invite') {
  //     this.setState({ value: result.title });
  //   } else {
  //     this.props.history.push(`/user/${result.title}`);
  //   }
  // };

  handleSearchChange = async (e, { searchQuery }) => {
    await this.setState({ isLoading: true, searchQuery });
    const input = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let results = [];
    try {
      const res = await fetch(`/api/search/all?keyword=${input}`);
      if (res.status === 200) {
        const json = await res.json();
        results = json.result.map((i, index) => {
          return {
            key: i.username,
            text: i.username,
            value: index,
            image: faker.internet.avatar()
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
  change = (e, { value, options }) => {
    const data = options[value[0]].text;
    console.log('onLabelClick: ' + data);
    const { selectedValue } = this.state;
    this.setState({
      selectedValue: selectedValue.concat(data),
      searchQuery: ''
    });
  };

  render() {
    const { isLoading, selectedValue, results, searchQuery } = this.state;
    return (
      <Dropdown
        loading={isLoading}
        onSearchChange={this.handleSearchChange}
        options={results}
        onChange={this.change}
        placeholder="Group"
        searchQuery={searchQuery}
        multiple
        search
        selection
      />
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
