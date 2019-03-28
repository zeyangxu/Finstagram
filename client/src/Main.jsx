import React, { Component } from 'react';
import Navbar from './Navbar';
import FeedList from './FeedList';

export default class Main extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <FeedList />
      </div>
    );
  }
}
