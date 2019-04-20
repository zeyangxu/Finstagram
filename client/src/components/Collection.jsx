import React from 'react';
import { Dropdown, Card, Image, Icon } from 'semantic-ui-react';

export default function Photo({
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
  groupOwner
}) {
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
                <Dropdown.Item
                  icon="trash"
                  text="Delete"
                  onClick={e => deleteHandler(photoID)}
                />
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
