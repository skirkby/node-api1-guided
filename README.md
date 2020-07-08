# Lambda Hubs Web API

Guided project for **Node API 1** Module.

In this project we will learn how to create a very simple Web API using `Node.js` and `Express`, and cover the basics of `server-side routing` and using global `middleware`.

The code for the guided project will be written in a single file for simplicity. We'll see ways to structure an API to make it more maintainable in upcoming lectures.

## Prerequisites

- an HTTP client like [Postman](https://www.getpostman.com/downloads/) or [Insomnia](https://insomnia.rest/download/).

## Project Setup

- [ ] **fork** and clone this repository.
- [ ] **CD into the folder** where you cloned **your fork**.

## Assignment

Build a RESTful Web API to manage _"Lessons"_ and _"Hubs"_. A _Hub_ is a group chat channel that brings together an instructor and a group of students from the same cohort as they work on a _Lesson_.

An example would be a _Hub_ created to go over the "Introduction to Node and Express" lesson for the _Web 1_ cohort.

A Lesson has:

- a unique `id`.
- a `name`.

A Hub has:

- a unique `id`.
- a `name`.
- a `lessonId` that connects it to the corresponding Lesson.
- a `cohort`.

### Features

The Web API must provide a set of `endpoints` to fulfill the following needs:

- add a new Lesson.
- view a list of existing Lessons.
- view the details of a single Lesson
- update the information of an existing Lesson.
- remove a Lesson.
- add a new Hub.
- view a list of existing Hubs.
- view the details of a single Hub
- update the information of an existing Hub.
- remove a Hub.

Here is a table with the `endpoint` descriptions:

| Action               | URL               | Method | Response         |
|:---------------------|:------------------|:-------|:-----------------|
| Add a Lesson         | /api/lessons      | POST   | the new Lesson   |
| View list of Lessons | /api/lessons      | GET    | array of Lessons |
| View Lesson details  | /api/lessons/{id} | GET    | a Lesson         |
| Update Lesson        | /api/lessons/{id} | PATCH  | updated Lesson   |
| Remove a Lesson      | /api/lessons/{id} | DELETE | deleted Lesson   |
| Add a Hub            | /api/hubs         | POST   | the new Hub      |
| View list of Hubs    | /api/hubs         | GET    | array of Hubs    |
| View Hub details     | /api/hubs/{id}    | GET    | a Hub            |
| Update Hub           | /api/hubs/{id}    | PATCH  | updated Hub      |
| Remove a Hub         | /api/hubs/{id}    | DELETE | deleted Hub      |

## Files with notes:
- ./index.js
- ./Postman-notes.md
- ./npm.notes.md