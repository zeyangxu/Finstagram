import React from 'react';
import Feed from './Feed';

export default function FeedList({ photoList, onDeleteBtnClick, username }) {
  return (
    <>
      {photoList &&
        photoList.map(i => (
          <Feed
            img_url={'/' + i.filePath}
            key={i.photoID}
            {...i}
            deleteHandler={onDeleteBtnClick}
            showDelete={false}
            centered={true}
            fluid={true}
            session_name={username}
          />
        ))}
    </>
  );
}
