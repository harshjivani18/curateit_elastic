const opensearchClient = require("../../backend/opensearch-client");
const moment = require('moment');

exports.createOpensearchData = async (req, res) => {
    try {
        const { gem, userId } = req.body;
        const collectionName = gem.collection_gems?.name;
        const collectionId = gem.collection_gems?.id;
        const collectionSlug = gem.collection_gems?.slug;

        const tagArr = [];
        gem.tags.forEach((t) => {
            return tagArr.push(t.tag)
        })

        const expander = [];
        if (gem.expander && gem.expander.length > 0) {
            gem.expander.forEach((e) => {
                return expander.push(e?.text, e?.keyword)
            })
        }

        const gemsString = expander.join(' ') + ' ' + gem?.socialfeed_obj?.text + ' ' + gem?.socialfeed_obj?.tweetId;
        const formattedCreateDate = moment(gem.createdAt).format('YYYY-MM-DD');
        const formattedUpdateDate = moment(gem.updatedAt).format('YYYY-MM-DD');
        const colorObj = gem.media && gem.media.color && typeof gem.media.color === "object" ? { ...gem.media, author: null } : { ...gem.media, color: {}, author: null }
        const socialDate = gem?.socialfeed_obj?.date === "" ? null : gem.socialfeed_obj?.date;
        // const finalArr = []
        const obj = {
            id: gem.id,
            url: gem.url,
            slug: gem.slug,
            title: gem.title === "" ? null : gem.title,
            description: gem.description === "" ? null : gem.description,
            text: gem.text === "" ? null : gem.text,
            image: gem.metaData?.icon ? gem.metaData?.icon?.icon : gem.metaData?.defaultIcon ? gem.metaData?.defaultIcon : null,
            // metadata: gem.metaData, will raise issue for parser and it is not considering any major information that is why commented it
            media: colorObj,
            s3_link: gem.S3_link === "" ? null : gem.S3_link,
            remarks: gem.remarks === "" ? null : gem.remarks,
            is_favourite: gem.is_favourite,
            socialfeedAt: gem.socialfeedAt,
            broken_link: gem.broken_link,
            comment_count: gem.comments_count,
            shares_count: gem.shares_count,
            likes_count: gem.likes_count,
            save_count: gem.save_count,
            entityObj: gem.entityObj,
            createddate: formattedCreateDate,
            updateddate: formattedUpdateDate,
            creatorName: gem.creatorName === "" ? null : gem.creatorName,
            releaseDate: gem.releaseDate === "" ? null : gem.releaseDate,
            socialfeed_obj: { ...gem.socialfeed_obj, date: socialDate },
            expander: gem.expander,
            media_type: gem.media_type === "" ? null : gem.media_type,
            platform: gem.platform === "" ? null : gem.platform,
            post_type: gem.post_type === "" ? null : gem.post_type,
            author: userId,
            collectionName: collectionName === "" ? null : collectionName,
            collectionId: collectionId === "" ? null : collectionId,
            collectionSlug: collectionSlug === "" ? null : collectionSlug,
            tags: tagArr,
            gemsString,
            websiteText: "-"
        }
        // finalArr.push(obj)
        // const bulkRes = await opensearchClient.helpers.bulk({ 
        //     datasource: finalArr, 
        //     onDocument (doc) {
        //         return {
        //             create: { _index: 'gems', _id: String(doc.id) }
        //         }
        //     } 
        // })

        // console.log("BlugRes ===>", bulkRes.successful)
        // console.log("Entry Point ===>")
        await opensearchClient.index({
            id: gem.id,
            index: "gems",
            body: obj,
            refresh: false
        })

        return res.send("success");
    } catch (error) {
        console.log("createOpensearchData error====>", error);
        return res.send(error);
    }
}

exports.createBulkOpensearchData = async (req, res) => {
    try {
        const { gems, userId } = req.body;
        const chunk = []
        for (const gem of gems) {
            const collectionName = gem.collection_gems?.name;
            const collectionId = gem.collection_gems?.id;
            const collectionSlug = gem.collection_gems?.slug;
            const tagArr = [];
            gem.tags.forEach((t) => {
                return tagArr.push(t.tag)
            })

            const expander = [];
            if (gem.expander && gem.expander.length > 0) {
                gem.expander.forEach((e) => {
                    return expander.push(e?.text, e?.keyword)
                })
            }

            const gemsString = expander.join(' ') + ' ' + gem?.socialfeed_obj?.text + ' ' + gem?.socialfeed_obj?.tweetId;
            const formattedCreateDate = moment(gem.createdAt).format('YYYY-MM-DD');
            const formattedUpdateDate = moment(gem.updatedAt).format('YYYY-MM-DD');
            const colorObj = gem.media && gem.media.color && typeof gem.media.color === "object" ? { ...gem.media, author: null } : { ...gem.media, color: {}, author: null }
            const socialDate = gem?.socialfeed_obj?.date === "" ? null : gem.socialfeed_obj?.date;

            const obj = {
                id: gem.id,
                url: gem.url,
                slug: gem.slug,
                title: gem.title === "" ? null : gem.title,
                description: gem.description === "" ? null : gem.description,
                text: gem.text === "" ? null : gem.text,
                image: gem.metaData?.icon ? gem.metaData?.icon?.icon : gem.metaData?.defaultIcon ? gem.metaData?.defaultIcon : null,
                // metadata: gem.metaData, will raise issue for parser and it is not considering any major information that is why commented it
                media: colorObj,
                s3_link: gem.S3_link === "" ? null : gem.S3_link,
                remarks: gem.remarks === "" ? null : gem.remarks,
                is_favourite: gem.is_favourite,
                socialfeedAt: gem.socialfeedAt,
                broken_link: gem.broken_link,
                comment_count: gem.comments_count,
                shares_count: gem.shares_count,
                likes_count: gem.likes_count,
                save_count: gem.save_count,
                entityObj: gem.entityObj,
                createddate: formattedCreateDate,
                updateddate: formattedUpdateDate,
                creatorName: gem.creatorName === "" ? null : gem.creatorName,
                releaseDate: gem.releaseDate === "" ? null : gem.releaseDate,
                socialfeed_obj: { ...gem.socialfeed_obj, date: socialDate },
                expander: gem.expander,
                media_type: gem.media_type === "" ? null : gem.media_type,
                platform: gem.platform === "" ? null : gem.platform,
                post_type: gem.post_type === "" ? null : gem.post_type,
                author: userId,
                collectionName: collectionName === "" ? null : collectionName,
                collectionId: collectionId === "" ? null : collectionId,
                collectionSlug: collectionSlug === "" ? null : collectionSlug,
                tags: tagArr,
                gemsString,
                websiteText: "-"
            }
            chunk.push(obj)
        }
        // const operations = chunk.flatMap(doc => [{ index: { _index: 'gems' } }, doc])
        // console.log("Length ===>", operations.length)

        const bulkRes = await opensearchClient.helpers.bulk({ 
            datasource: chunk, 
            onDocument (doc) {
                return {
                    create: { _index: 'gems', _id: doc.id }
                }
            } 
        })

        console.log("Done ==>", chunk.length, bulkRes.successful)

        return res.send(bulkRes);
    } catch (error) {
        console.log("createOpensearchData error====>", error);
        return res.send(error);
    }
}

exports.updateOpensearchData = async (req, res) => {
    try {
        const { id } = req.params;
        const { gem } = req.body;
        const collectionName = gem.collection_gems?.name;
        const collectionId = gem.collection_gems?.id;
        const collectionSlug = gem.collection_gems?.slug;
        const colorObj = gem.media && gem.media.color && typeof gem.media.color === "object" ? gem.media : { ...gem.media, color: {} }

        const tagArr = [];
        gem.tags.forEach((t) => {
            return tagArr.push(t.tag)
        })

        const expander = [];
        if (gem.expander && gem.expander.length > 0) {
            gem.expander.forEach((e) => {
                return expander.push(e?.text, e?.keyword)
            })
        }
        // const finalArr = []
        const gemsString = expander.join(' ') + ' ' + gem?.socialfeed_obj?.text + ' ' + gem?.socialfeed_obj?.tweetId;
        const formattedUpdateDate = moment(gem.updatedAt).format('YYYY-MM-DDTHH:mm:ss');
        const obj = {
            id: id,
            url: gem.url,
            title: gem.title,
            slug: gem.slug,
            description: gem.description,
            text: gem.text,
            // metadata: gem.metaData, will raise issue for parser and it is not considering any major information that is why commented it
            image: gem.metaData?.icon ? gem.metaData?.icon?.icon : gem.metaData?.defaultIcon ? gem.metaData?.defaultIcon : null,
            remarks: gem.remarks,
            entityObj: gem.entityObj,
            creatorName: gem.creatorName,
            updateddate: formattedUpdateDate,
            socialfeed_obj: gem.socialfeed_obj,
            media: colorObj,
            s3_link: gem.s3_link === "" ? null : gem.s3_link,
            remarks: gem.remarks === "" ? null : gem.remarks,
            is_favourite: gem.is_favourite,
            socialfeedAt: gem.socialfeedAt,
            broken_link: gem.broken_link,
            comment_count: gem.comment_count,
            likes_count: gem.likes_count,
            save_count: gem.save_count,
            expander: gem.expander,
            media_type: gem.media_type,
            platform: gem.platform,
            post_type: gem.post_type,
            collectionName,
            collectionId,
            collectionSlug: collectionSlug === "" ? null : collectionSlug,
            tags: tagArr,
            gemsString
        }

        // const res = await opensearchClient.update({
        //     id: id,
        //     index: "gems",
        //     body: {
        //         doc: obj
        //     },
        //     refresh: true
        // })

        // console.log("UpdateRes ===>", res)

        // finalArr.push(obj)

        const oRes = await opensearchClient.helpers.bulk({
            datasource: [obj],
            onDocument (doc) {
                return [
                    {
                        update: { _index: 'gems', _id: doc.id }
                    },
                    {
                        doc_as_upsert: true 
                    }
                ]
            }
        })
        console.log("ORes ===>", oRes)

        return res.send("success");
    } catch (error) {
        console.log("updateElasticData error===>", error);
        return error;
    }
}

exports.deleteOpensearchData = async (req, res) => {
    try {
        const { id } = req.params;

        await opensearchClient.helpers.bulk({
            datasource: [{ id: parseInt(id) }],
            onDocument (doc) {
              return {
                delete: { _index: 'gems', _id: doc.id }
              }
            }
        })

        return res.send("success");
    } catch (error) {
        console.log("deleteElasticData error===>", error);
        return error;
    }
}

exports.deleteBulkOpensearchData = async (req, res) => {
    try {
        const { ids } = req.query;
        const newIds  = ids.replace(/\s/g, "").split(",")
        await opensearchClient.helpers.bulk({
            datasource: newIds.map((id) => ({ id: parseInt(id) })),
            onDocument (doc) {
              return {
                delete: { _index: 'gems', _id: doc.id }
              }
            }
        })
        return res.send("success");
    } catch (error) {
        console.log("deleteElasticBULKData error===>", error);
        return error;
    }
}

exports.getOpensearchData = async (req, res) => {
    try {
        const result = await opensearchClient.search({
            index: 'gems',
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                match_all: {}
                            }
                        ],
                        filter: [
                            {
                                term: {
                                    author: 955 // Replace 'userId' with the actual user ID
                                }
                            }
                        ],
                        //   size: 1000
                    }
                },
                size: 10000,
            },
        });
        res.send({ length: result.body.hits.hits.length, data: result.body.hits.hits });

    } catch (error) {
        console.log("error===>", error);
    }
}