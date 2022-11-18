# TS URL Shortener

- The idea here is to paste in a long url in some text field then get a shortened version of the URL.

## Scope

- Long URL --> Short URL
- URL length? As short as they can be
- Characters in the URL? [0-9, a-z, A-Z]
- Future implementation: Highly Scalable, High Availability, Rate Limiting, Logging Metrics & Analytics

## Design

### API Implementation

- There are two endpoints

1. `POST`
   - The client sends a HTTP request with the long url as the request body.
   - The server responds with a status of 201 and the short URL.
   - If the long URL already exists in the DB, regenerate another record with the same long URL? We'll see.
2. `GET`
   - Client sends a GET request to the tiny URL (pastes it on the browser)
   - Server returns a redirect response to the long URL.

Notable points:

1. **Permanent Redirect**
   - Server returns a **status code 301** for a permanent redirect which means the browser caches this response and future requests will be redirected to this long URL without necessarily making requests to the server.
2. **Temporary Redirect**
   - Server returns a **status code 302** for a temporary redirect which means all subsequent requests will be sent to the server to retreive the long URL.

_We'll see what status code to chose_

### Hash Function

- Hash key of length 8 is used - means that we should be able to generate 62^8 number of hash values for the URLs.
- Hash Collision + Resolution will be used this time but Base 62 implementation looks abit better here, why?
- Generate a hash value - check if it exists in DB, if it does generate another one - recursively check until no match is found, then store this alongside the long URL. Process Becomes quite expensive over time plus I'm planning on using MongoDB for my database so I can't use the unique IDs provided By MongoDB to generate a Base 62.
- Base 62 would have no issue with hash collisions since the IDs generated will always Be unique in the DB -> generate unique ID -> get it's Base 62 (this Becomes the short URL) -> store the unique ID in the DB alongside short URL + long URL

## Process Flow

- User visits the short URL -> Ingress -> Directs to Server -> Server checks Redis Cache -> If Key found, return long URL with redirect -> if not, update cache then send redirect long URL to user.
