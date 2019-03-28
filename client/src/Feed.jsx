import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';

export default function Feed({ img_url, owner_name, date, description }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Card fluid centered>
        <Image src={img_url} />
        <Card.Content>
          <Card.Header>{owner_name}</Card.Header>
          <Card.Meta>
            <span className="date">{date}</span>
          </Card.Meta>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name="comments outline" />
          </a>
        </Card.Content>
      </Card>
    </div>
  );
}
