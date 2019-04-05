import React from 'react';
import { Button, Card, Image, Icon } from 'semantic-ui-react';

export default function Photo({
  img_url,
  owner_name,
  date,
  description,
  deleteHandler,
  photoID,
  isPublic,
  centered,
  fluid,
  showDelete
}) {
  date = new Date(date).toLocaleDateString();
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
          <Card.Header>
            {owner_name}
            {showDelete && (
              <Button
                onClick={e => deleteHandler(photoID)}
                icon="delete"
                floated="right"
                color="red"
                compact
              />
            )}
          </Card.Header>

          <Card.Meta>
            <span className="date">{date}</span>
          </Card.Meta>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          {isPublic ? (
            <span>
              <Icon name="eye" />
              public
            </span>
          ) : (
            <span>
              <Icon name="eye slash" />
              private
            </span>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
