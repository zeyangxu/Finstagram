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
            photoID={i.photoID}
            owner_name={i.username}
            date={i.timestamp}
            isPublic={i.isPublic}
            description={i.caption}
            deleteHandler={onDeleteBtnClick}
            showDelete={false}
            centered={true}
            fluid={true}
          />
        ))}
    </div>
  );
}
