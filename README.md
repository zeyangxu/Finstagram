# Finstagram

this is a project for CS-UY 3083 course

## Technical Stack

![](https://cdn-images-1.medium.com/max/1200/1*EKW3XazCN98jcVrlEP3H8g.png)

- Node.js & Express as backend framework
- React.js as frontend framework
- Semantic-ui-react as css component
- MySQL as database

## Database structure

![](./static/RelationalSchema.jpg)

## Authentication System

This app use session based authentication

![](https://cdn-images-1.medium.com/max/1600/1*Hg1gUTXN5E3Nrku0jWCRow.png)

## Frontend Components Structure

![](./static/components_struct.png)

## Backend api endpoint

### Auth

#### GET `/api/auth/<sessionID>`

response: {success, username}

Handle session check, check if the session id exist

#### DELETE `/api/auth/<sessionID>`

response: {success}

Handle sign out, delete the session id record in database

#### POST `/api/auth/`

body: {username, password}

response: {success, sessionID}

Handle log in

### Register

#### POST `/api/register/`

body: {password, username, fname, lname}

response: {success, sessionID, \*error}

### Upload

#### POST `/api/upload/photo`

body: file, {active_session_id, description, isPublic}

response: {success}

Handle photo upload, image format and size limit are restricted

### Photo

#### GET `/api/photo/<sessionID>`

response: {success, data:\[{username,
filePath,
photoID,
timestamp,
caption,
isPublic}\]}

Handle public photo fetching

### Gallery

> Prsonal photo manager

#### GET `/api/gallery/<sessionID>`

response: {success, data, \*error}

Handle personal photo fetching

#### DELETE `/api/gallery/<sessionID>`

response: {success, \*error}

Handle personal photo deleting

### Groups

#### GET `/api/groups/own/<sessionID>`

response: {success, data: \[{groupName}\]}

Response a list of group names the user owns

#### GET `/api/groups/belong/<sessionID>`

response: {success, data \[{groupName, groupOwner}\]}

Response a list of group names the user belong to

### Follow

#### GET `/api/follow/following/<sessionID>`

response: {success, result: \[{followeeUsername}\]}

Response a list of username that you follow

#### GET `/api/follow/follower/<sessionID>`

response: {success, result: \[{followerUsername}\]}

Response a list of username that follow you

#### GET `/api/follow/request/<sessionID>`

response: {success, result: \[{followerUsername}\]}

Response a list of username that sent follow request to you

## Todo

- [x] Store session id in cookie
- [x] React-router protected route
- [x] Not storing session-id of all request
- [ ] Show upload error alert modal
- [x] Tag other user in a post
- [ ] Post photo with a url
- [x] add a button to the right of group list that can create new group
- [x] implement add user into your group
- [ ] custom alert component

### Features

- [x] Sign up system
- [x] Log in system
- [x] Session
- [x] Upload photo
- [x] View photo and data
- [x] Create close friend group

## Notes

### JWT (JSON Web Token)

- Store token only on client side, more scalable

### Session based authentication

#### First time login

- client login
- server authorize the login
- server create a session-id
- server save session-id with login username
- server send back session id
- client store session id as coockie (localStorage?)

#### Re-login

- client request login page
- has session => send session to server => auth => redirect
- session expired => re-enter username and password => login again
