# Finstagram

this is a project for CS-UY 3083 course

## Technical Stack

- Node.js & Express as backend framework
- React.js as frontend framework
- Semantic-ui-react as css component
- MySQL as database

## Database structure

![](./static/RelationalSchema.jpg)

## Authentication System

This app use session based authentication

![](https://cdn-images-1.medium.com/max/1600/1*Hg1gUTXN5E3Nrku0jWCRow.png)

## Todo

- [x] Store session id in cookie
- [ ] React-router protected route
- [x] Not storing session-id of all request

### Features

- [x] Sign up system
- [x] Log in system
- [x] Session
- [ ] Upload photo
- [ ] View photo and data
- [ ] Create close friend group

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
