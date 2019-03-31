# Finstagram

this is a project for CS-UY 3083 course

## Technical Stack

- Node.js & Express as backend framework
- React.js as frontend framework
- Semantic-ui-react as css component
- MySQL as database

## Todo

- [ ] Store session id in cookie
- [ ] React-router protected route

### features

- [x] Sign up system
- [x] Log in system
- [ ] Session
- [ ] Upload photo
- [ ] View photo and data
- [ ] Create close friend group

## Notes

### Token-based authentication

#### JWT (JSON Web Token)

- Store token only on client side, more scalable

### Session-based authentication

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
