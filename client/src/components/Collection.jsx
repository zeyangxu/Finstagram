import React, { Component } from 'react';
import {
  Grid,
  Button,
  Popup,
  Label,
  Dropdown,
  Card,
  Image,
  Icon
} from 'semantic-ui-react';
import faker from 'faker';
import MultiSelectSearch from './MultiSelectSearch';

export default class Photo extends Component {
  state = { taggedUsers: [] };
  getData = async () => {
    try {
      const res = await fetch(`/api/tag/photo?photoID=${this.props.photoID}`);
      const json = await res.json();
      if (res.status === 200) {
        this.setState({ taggedUsers: json.data });
      }
    } catch (err) {
      console.error(err);
    }
  };
  componentDidMount() {
    this.getData();
  }
  render() {
    const {
      img_url,
      owner_name,
      timestamp,
      caption,
      deleteHandler,
      photoID,
      isPublic,
      centered,
      fluid,
      showDelete,
      groupName,
      groupOwner,
      rerender
    } = this.props;
    const { taggedUsers } = this.state;
    const locale_date = new Date(timestamp).toLocaleDateString();
    const locale_time = new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false
    });
    return (
      <div style={{ marginBottom: '2rem' }}>
        <Card centered={centered} fluid={fluid}>
          <div style={{ height: '100%', width: '100%' }}>
            <Image
              src={img_url}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                display: 'block',
                margin: 'auto'
              }}
            />
          </div>
          <Card.Content>
            <Card.Header>{owner_name}</Card.Header>

            <Card.Meta>
              <span className="date">
                {locale_date} {locale_time}
              </span>
            </Card.Meta>
            <Card.Description>{caption}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            {isPublic ? (
              <span>
                <Icon name="eye" />
                public
              </span>
            ) : (
              <span>
                <Icon name="users" />
                {groupName}
              </span>
            )}
            {showDelete && (
              <Dropdown
                icon="ellipsis horizontal"
                style={{ position: 'absolute', right: 0, marginRight: '1rem' }}
              >
                <Dropdown.Menu>
                  <Popup
                    trigger={<Dropdown.Item icon="at" text="Tag" />}
                    on="click"
                  >
                    <MultiSelectSearch
                      mode="tag"
                      photoID={photoID}
                      isPublic={isPublic}
                      rerender={this.getData}
                    />
                  </Popup>
                  <Dropdown.Item
                    icon="trash"
                    text="Delete"
                    onClick={e => deleteHandler(photoID)}
                  />
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Card.Content>
          {taggedUsers.length > 0 && (
            <Card.Content extra>
              <label>Tagged Users</label>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {taggedUsers.map(i => {
                  return (
                    <Label
                      basic
                      image
                      key={i.username}
                      color={i.acceptedTag === 1 ? 'green' : 'red'}
                      style={{ marginTop: '0.5rem' }}
                    >
                      <img src={faker.internet.avatar()} alt="" />
                      {i.username}
                    </Label>
                  );
                })}
              </div>
            </Card.Content>
          )}
        </Card>
      </div>
    );
  }
}
