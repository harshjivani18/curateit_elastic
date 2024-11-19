// Using libraries
const express               = require('express');
const routes                = express.Router();
const { createOpensearchData, 
        updateOpensearchData, 
        createBulkOpensearchData, 
        deleteBulkOpensearchData, 
        deleteOpensearchData, 
        getOpensearchData } = require('../controllers/open-search.controller');

routes.post('/', createOpensearchData);
routes.post('/bulk', createBulkOpensearchData);

routes.put('/:id', updateOpensearchData);

routes.delete('/bulk', deleteBulkOpensearchData);
routes.delete('/:id', deleteOpensearchData);

routes.get('/opensearch-test', getOpensearchData);


module.exports = routes;