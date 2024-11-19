// Loading env variables
require("dotenv").config();

// Set open search client
const { Client }                = require('@opensearch-project/opensearch');

const { OPENSEARCH_DOMAIN_URL,
        OPENSEARCH_USERNAME,
        OPENSEARCH_PASSWORD }   = process.env

const client = new Client({
    auth: {
        username: OPENSEARCH_USERNAME,
        password: OPENSEARCH_PASSWORD
    },
    node: OPENSEARCH_DOMAIN_URL // OpenSearch domain URL
});

const createIndex = async (indexName) => {
    const indexRes      = await client.indices.exists({ index: indexName })
    const isIndexExist  = indexRes?.statusCode !== 404
    if (isIndexExist) {
        console.log(`${indexName} Index already exist`);
        return 
    }

    const settings = {
        settings: {
            index: {
                auto_expand_replicas: "0-2",
                number_of_shards: 1,
                number_of_replicas: 2
            },
        },
        mappings: {
            properties: {
                media: {
                    properties:{
                        rating: {
                            type: "float",
                            ignore_malformed: true
                        }
                    }
                },
                entityObj: {
                    properties: {
                        entityObj: {
                            properties: {
                                ratings: {
                                    properties: {
                                        value: {
                                            type: "float",
                                            ignore_malformed: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    await client.indices.create({
        index: indexName,
        body: settings,
    });

    console.log(`${indexName} Index created`);
    return
}

createIndex("gems")

module.exports = client;