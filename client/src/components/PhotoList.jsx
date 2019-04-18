import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import FeedList from './FeedList';
import CollectionList from './CollectionList';

class PhotoList extends Component {
  state = {
    photoList: []
  };
  async componentDidMount() {
    this.fetchPhoto();
  }
  getSession = () => {
    const { cookies } = this.props;
    return cookies.cookies.sessionID;
  };

  // fetch gallery api endpoint
  fetchPhoto = async () => {
    const { showPublic } = this.props;
    const sessionID = this.getSession();
    const endpoint = showPublic ? '/api/photo' : '/api/gallery';
    console.log('fetching from: ', `${endpoint}/${sessionID}`);
    try {
      const res = await fetch(`${endpoint}/${sessionID}`);
      const json = await res.json();
      if (res.status === 200) {
        this.setState({ photoList: json.data });
      } else {
        console.log('status', res.status);
        if (res.status === 400) {
          this.props.history.push('/login');
        }
        console.log('fetch photo fail', json.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  // perform side effect after user delete or upload
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.loading !== this.props.loading ||
      prevProps.showPublic !== this.props.showPublic
    ) {
      this.fetchPhoto();
      console.log('PhotoList componentDidUpdate side effect fetch');
    }
  }
  // handle delete button click event
  onDeleteBtnClick = async id => {
    const sessionID = this.getSession();
    this.props.startLoader();
    const res = await fetch(`/api/gallery?photo=${id}&session=${sessionID}`, {
      method: 'DELETE',
      headers: { ContentType: 'application/json' }
    });
    const json = await res.json();
    if (res.status === 200) {
      window.scrollTo(0, 0);
      console.log('delete success');
    } else {
      console.error(json.error);
    }
    this.props.stopLoader();
  };
  render() {
    const { photoList } = this.state;
    console.log('PhotoList render');
    if (this.props.showPublic) {
      return (
        <FeedList
          photoList={photoList}
          onDeleteBtnClick={this.onDeleteBtnClick}
        />
      );
    } else {
      return (
        <CollectionList
          photoList={photoList}
          onDeleteBtnClick={this.onDeleteBtnClick}
        />
      );
    }
  }
}
PhotoList.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default compose(
  withCookies,
  withRouter
)(PhotoList);
