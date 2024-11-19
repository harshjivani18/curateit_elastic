// Using libraries
const express               = require('express');
const routes                = express.Router();
const { createElasticData, updateElasticData, deleteElasticData, getElasticData, createBulkElasticData, deleteBulkElasticData } = require('../controllers/elastic-search.controller');

routes.post('/', createElasticData);
routes.post('/bulk', createBulkElasticData);

routes.put('/:id', updateElasticData);

routes.delete('/bulk', deleteBulkElasticData);
routes.delete('/:id', deleteElasticData);

routes.get('/test', getElasticData);


module.exports = routes;