const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('5AEWRO07RA', '565d3c18293b28c34da217ee991000c1');
const index = client.initIndex('essenia');



router.get('/', (req, res, next) => {
  if (req.query.query) {
    index.search({
      query: req.query.query,
      page: req.query.page,
    }, (err, content) => {
      res.json({
        success: true,
        message: "Here is your search",
        status: 200,
        content: content,
        search_result: req.query.query
      });
    });
  }
});


module.exports = router;

