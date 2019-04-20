import React, { Component } from 'react';
import {
  Button,
  Grid,
  Dimmer,
  Loader,
  Container,
  Modal,
  Placeholder
} from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import PhotoList from './PhotoList';
import Upload from './Upload';
import FriendList from './FriendList';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoList: [],
      loading: false,
      modalOpen: false,
      imageUploadPreviewURL: null
    };
    this.fileInput = React.createRef();
  }

  startLoader = () => {
    console.log('startLoader()');
    this.setState({ loading: true });
  };
  stopLoader = () => {
    console.log('stopLoader()');
    this.setState({ loading: false });
  };
  openModal = () => {
    this.setState({ modalOpen: true });
  };
  closeModal = () => {
    this.setState({ modalOpen: false, imageUploadPreviewURL: null });
  };

  fileInputOnChange = () => {
    if (this.fileInput) {
      this.setState({
        imageUploadPreviewURL: URL.createObjectURL(
          this.fileInput.current.files[0]
        )
      });
    }
  };

  render() {
    const { loading, modalOpen, imageUploadPreviewURL } = this.state;
    return (
      <div>
        <Navbar username={this.props.username} />
        <Container style={{ marginTop: '2rem' }}>
          <Dimmer active={loading}>
            <Loader>Loading</Loader>
          </Dimmer>
          <Button
            onClick={this.openModal}
            color="violet"
            icon="add"
            style={{ marginBottom: '2rem' }}
          />
          <Modal dimmer="inverted" open={modalOpen} onClose={this.closeModal}>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
              {imageUploadPreviewURL ? (
                <div style={{ height: 300, width: 300, marginRight: '2rem' }}>
                  <img
                    alt="upload-img"
                    src={imageUploadPreviewURL}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      display: 'block',
                      margin: 'auto'
                    }}
                  />
                </div>
              ) : (
                <Placeholder
                  style={{ height: 150, width: 150, marginRight: '2rem' }}
                >
                  <Placeholder.Image />
                </Placeholder>
              )}
              <Modal.Description>
                <Upload
                  startLoader={this.startLoader}
                  stopLoader={this.stopLoader}
                  fileInputRef={this.fileInput}
                  fileInputOnChange={this.fileInputOnChange}
                  urlInputOnChange={this.urlInputOnChange}
                  closeModal={this.closeModal}
                  clearRef={this.clearRef}
                />
              </Modal.Description>
            </Modal.Content>
          </Modal>
          <Grid>
            <Grid.Column width={11}>
              <PhotoList
                fetchType="gallery"
                loading={loading}
                startLoader={this.startLoader}
                stopLoader={this.stopLoader}
              />
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <FriendList />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}
Gallery.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default withCookies(Gallery);
