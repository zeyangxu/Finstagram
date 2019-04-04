import React from 'react';
import { Button, Card, Image, Icon } from 'semantic-ui-react';

export default function Feed({
  img_url,
  owner_name,
  date,
  description,
  deleteHandler,
  photoID
}) {
  date = new Date(date).toLocaleDateString();
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Card fluid centered>
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
          <span>
            <Icon name="comments outline" />
          </span>
        </Card.Content>
      </Card>
    </div>
  );
}
