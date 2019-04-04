import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Feed from './Feed';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';

class FeedList extends Component {
  state = {
    photoList: []
  };
  async componentDidMount() {
    this.fetchPhoto();
  }
  // fetch gallery api endpoint
  fetchPhoto = async () => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/gallery/?id=${sessionID}`);
      const json = await res.json();
      if (res.status === 200) {
        this.setState({ photoList: json.data });
      } else {
        if (res.status === 400 && json.error === 'session id not found') {
          this.props.history.push('/');
        }
        console.log('fetch photo fail', json.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  // perform side effect after user delete or upload
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loading !== this.props.loading) {
      this.fetchPhoto();
      console.log('FeedList componentDidUpdate side effect fetch');
    }
  }
  // handle delete button click event
  onDeleteBtnClick = async id => {
    this.props.startLoader();
    const res = await fetch(`/api/gallery/${id}`, {
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
    return (
      <div>
        <Grid centered>
          <Grid.Column width={9}>
            {photoList &&
              photoList.map(i => (
                <Feed
                  img_url={'http://localhost:5000' + i.filePath}
                  key={i.photoID}
                  photoID={i.photoID}
                  owner_name="zeb"
                  date={i.timestamp}
                  description={i.caption}
                  deleteHandler={this.onDeleteBtnClick}
                />
              ))}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
FeedList.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default withCookies(FeedList);
