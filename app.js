const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  return next();
});

app.use(isAuth);

app.use('/graphql', graphqlHttp({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true,
}));

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;
mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-d5g96.gcp.mongodb.net/${MONGO_DB}?retryWrites=true`,
  { useNewUrlParser: true },
)
  .then(() => {
    app.listen(8000, () => {
      console.log('Ready On localhost:8000');
    });
  })
  .catch((error) => {
    console.log(error);
  });
