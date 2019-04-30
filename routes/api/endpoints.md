# API endpoints

## Auth

### GET `/api/auth/<sessionID>`

response: {success, username}

Handle session check, check if the session id exist

### DELETE `/api/auth/<sessionID>`

response: {success}

Handle sign out, delete the session id record in database

### POST `/api/auth/`

body: {username, password}

response: {success, sessionID}

Handle log in

## Register

### POST `/api/register/`

body: {password, username, fname, lname}

response: {success, sessionID, \*error}

## Upload

### POST `/api/upload/photo`

body: file, {active_session_id, description, isPublic}

response: {success}

Handle photo upload, image format and size limit are restricted

## Photo

### GET `/api/photo/<sessionID>`

response: {success, data:\[{username,
filePath,
photoID,
timestamp,
caption,
isPublic}\]}

Handle public photo fetching

## Gallery

> Prsonal photo manager

### GET `/api/gallery/<sessionID>`

response: {success, data, \*error}

Handle personal photo fetching

### DELETE `/api/gallery/<sessionID>`

response: {success, \*error}

Handle personal photo deleting

## Groups

### GET `/api/groups/own/<sessionID>`

response: {success, data: \[{groupName}\]}

Response a list of group names the user owns

### GET `/api/groups/belong/<sessionID>`

response: {success, data \[{groupName, groupOwner}\]}

Response a list of group names the user belong to

## Follow

### GET `/api/follow/following/<sessionID>`

response: {success, result: \[{followeeUsername}\]}

Response a list of username that you follow

### GET `/api/follow/follower/<sessionID>`

response: {success, result: \[{followerUsername}\]}

Response a list of username that follow you

### GET `/api/follow/request/<sessionID>`

response: {success, result: \[{followerUsername}\]}

Response a list of username that sent follow request to you
