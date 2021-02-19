const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');
const consign    = require('consign');
var cors = require('cors');

module.exports = () => {
  const app = express();

  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || config.get('server.port'));

  // MIDDLEWARES
  app.use(bodyParser.json());
  app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
  
  consign({cwd: 'api'})
  .then('data')
  .then('controllers')
  .then('routes')
  .into(app);

  return app;
};