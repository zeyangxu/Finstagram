import React, { Component } from 'react';
import { Label, Card, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import faker from 'faker';

export default class Feed extends Component {
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
      username,
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
      session_name
    } = this.props;
    const { taggedUsers } = this.state;
    const locale_date = new Date(timestamp).toLocaleDateString();
    const locale_time = new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false
    });
    const link = username === session_name ? '/gallery' : `/user/${username}`;
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
            <Card.Header as={Link} to={link} style={{ marginBottom: '1rem' }}>
              <Image avatar src={faker.internet.avatar()} size="mini" />
              {'   '}
              {username}
            </Card.Header>

            <Card.Meta>
              <span className="date">
                {locale_date} {locale_time}
              </span>
            </Card.Meta>
            <Card.Description>{caption}</Card.Description>
          </Card.Content>
          {isPublic ? null : (
            <Card.Content extra>
              <span>
                <Icon name="users" />
                {groupName}
              </span>
            </Card.Content>
          )}
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
