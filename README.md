# Backend task - node.js

## Installation

To install the server and development dependencies run `npm i`.

## Unit tests and code coverage

To run the unit tests and code coverage run `npm test`. The coverage report creates an HTML file at `coverage/index.html`

## Task 1

- `http://localhost:9999/ping` return the server date time.

## Task 2

- `http://localhost:9999/posts` returns a filtered and sorted list.
- `http://localhost:9999/posts?sortOrderProperty=title` returns a filtered and sorted list by title ASC.
- `http://localhost:9999/posts?sortOrderProperty=-title` returns a filtered and sorted list by title ASC.

## Task 3: Mock data generator

To generate mocked data containing the products run `node mock-database-data.js`.

