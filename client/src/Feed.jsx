import React from 'react';
import { Button, Card, Image, Icon } from 'semantic-ui-react';

export default function Feed({
  img_url,
  owner_name,
  date,
  description,
  deleteHandler,
  photoID,
  isPublic
}) {
  date = new Date(date).toLocaleDateString();
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Card>
        <Image src={img_url} />
        <Card.Content>
          <Card.Header>
            {owner_name}
            <Button
              onClick={e => deleteHandler(photoID)}
              icon="delete"
              floated="right"
              color="red"
              compact
            />
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
