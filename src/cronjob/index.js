// cron job for updating website text using mql in open search

// Path: src/cronjob/index.js

const cron              = require("node-cron");
const mql               = require("@microlink/mql");
const sanitizeHtml      = require("sanitize-html");
const { Readability }   = require("@mozilla/readability");
const { JSDOM }         = require("jsdom");

const opensearchClient  = require("../../backend/opensearch-client");

// Cron job will run after every hour
cron.schedule("0 0 */1 * * *", async () => {
    console.log("Running a job every minute");
    const allGems = await opensearchClient.search({
        index: 'gems',
        body: {
            query: {
                match: {
                    "websiteText.keyword": "-"
                }
            },
            size: 10000
        },
    });

    const records = allGems?.body?.hits?.hits;
    if (records) {
        console.log("Total records to update ===>", records.length)
        const gems          = records.map((rec) => rec._source)
        const updatedRecs   = []
        for (const g of gems) {
            let article;
            if ((g.url?.startsWith('http') || g.url?.startsWith('https')) && !g.url?.includes("localhost")) {
                try {
                    const { data } = await mql(g.url, {
                        apiKey: process.env.MICROLINK_API_KEY,
                        meta: false,
                        data: {
                            html: {
                                selector: "html",
                            },
                        },
                    })

                    const htmldata = sanitizeHtml(data.html);
                    const doc = new JSDOM(htmldata, { url: g.url });
                    let reader = new Readability(doc.window.document);
                    article = reader.parse().textContent.replace(/\t|\n/g, '').replace(/  /g, '');
                    updatedRecs.push({ ...g, websiteText: article })
                }
                catch (e) {
                    console.log("Error ===>", e.description)
                    article = ""
                    updatedRecs.push({ ...g, websiteText: article })
                }
            }
        }

        if (updatedRecs.length !== 0) {
            const res = await opensearchClient.helpers.bulk({
                datasource: updatedRecs,
                onDocument (doc) {
                  // The update operation always requires a tuple to be returned, with the
                  // first element being the action and the second being the update options.
                  return [
                    {
                      update: { _index: 'gems', _id: doc.id }
                    },
                    { doc_as_upsert: true }
                  ]
                }
            })
            console.log("Updated records ===>", res.total, res.successful, res.failed)
        }

    }
    console.log("Cron job completed")
})