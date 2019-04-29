import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import FeedList from './FeedList';
import CollectionList from './CollectionList';
import OtherUserCollectionList from './OtherUserCollectionList';

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
    const { fetchType } = this.props;
    const sessionID = this.getSession();
    let endpoint = '';
    switch (fetchType) {
      case 'main':
        endpoint = `/api/photo/${sessionID}`;
        break;
      case 'gallery':
        endpoint = `/api/gallery/${sessionID}`;
        break;
      case 'otheruser':
        endpoint = `/api/photo/user/${this.props.match.params.username}`;
        break;
      default:
        endpoint = '';
    }
    console.log('fetching from: ', endpoint);
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      if (res.status === 200) {
        this.setState({ photoList: json.data });
      } else {
        console.log('status', res.status);
        if (res.status === 401) {
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
      prevProps.showPublic !== this.props.showPublic ||
      this.props.location !== prevProps.location
    ) {
      this.fetchPhoto();
      console.log('PhotoList componentDidUpdate side effect fetch');
    }
  }
  // handle delete button click event
  onDeleteBtnClick = async id => {
    const sessionID = this.getSession();
    this.props.startLoader();
    const res = await fetch(`/api/gallery/${sessionID}?photo=${id}`, {
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
    switch (this.props.fetchType) {
      case 'main':
        return (
          <FeedList
            photoList={photoList}
            onDeleteBtnClick={this.onDeleteBtnClick}
            username={this.props.username}
          />
        );
      case 'gallery':
        return (
          <CollectionList
            photoList={photoList}
            onDeleteBtnClick={this.onDeleteBtnClick}
            rerender={this.fetchPhoto}
          />
        );
      case 'otheruser':
        return <OtherUserCollectionList photoList={photoList} />;
      default:
        return null;
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
