import React from 'react';
import Feed from './Feed';

export default function FeedList({ photoList, onDeleteBtnClick }) {
  return (
    <div>
      {photoList &&
        photoList.map(i => (
          <Feed
            img_url={'http://localhost:5000' + i.filePath}
            key={i.photoID}
            {...i}
            deleteHandler={onDeleteBtnClick}
            showDelete={false}
            centered={true}
            fluid={true}
          />
        ))}
    </div>
  );
}
