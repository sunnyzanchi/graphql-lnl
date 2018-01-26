# GraphQL Lunch and Learn

To get started, we'll need to add `express`, `express-graphql`, and `graphql`. We'll be using yarn for this.
We'll also add a few dev dependencies. `eslint`, `eslint-config-gsandf`, and `nodemon`. ESLint will keep our code looking nice and help catch mistakes. Nodemon will watch our files and restart our server when they change. These are all already in the package.json, so just run yarn:
```
yarn
```
If you're unfamiliar with express, it's a web server framework for Node. We won't be doing much with it, it will just handle incoming requests, and `express-graphql` serves as the glue to get the requests to GraphQL.