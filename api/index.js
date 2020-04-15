const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

router.all('/', (_, res) => res.send('Hello World!'));
router.all('/record_success', require('./record_success'));
router.all('/record', require('./record'));
router.all('/sms', require('./sms'));

app.use('/api', router);

app.listen(port, () =>
  console.log(`sm-portfolio-api listening at http://localhost:${port}`)
);
