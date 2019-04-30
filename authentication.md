# Authentication

## JWT (JSON Web Token)

- Store token only on client side, more scalable

## Session based authentication

### First time login

- client login
- server authorize the login
- server create a session-id
- server save session-id with login username
- server send back session id
- client store session id as coockie (localStorage?)

### Re-login

- client request login page
- has session => send session to server => auth => redirect
- session expired => re-enter username and password => login again
