var AssistantV1 = require('watson-developer-cloud/assistant/v1');

const username = '8a69ef4e-9357-49ff-ae53-eb10aad13026';
const password = 'CdkUvKu2WAFK';
const workspace_id = '63adf22a-21ba-42ae-8243-ecebce45447c';
const intent = 'Cambio_Swift_PFePJ_Consultar_Codigo';
const maxConfidence = 0.8;

var assistant = new AssistantV1({
    version: '2018-09-20',
    username: username,
    password: password,
    url: 'https://gateway.watsonplatform.net/assistant/api'
});

async function getIntentExamples(workspace_id, intent, page_limit = 500) {
    return new Promise((resolve, reject) => {
        const params = {
            workspace_id: workspace_id,
            intent: intent,
            page_limit: page_limit
        };

        assistant.listExamples(params, function(err, res) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                let examples = [];
                res.examples.forEach(element => {
                    examples.push(element.text);
                });
                resolve(examples);
            }
        });
    });
}

async function updateIntent(workspace_id, intent, examples) {
    return new Promise((resolve, reject) => {
        const params = {
            workspace_id: workspace_id,
            intent: intent,
            new_examples: examples
        };

        assistant.updateIntent(params, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    })
}

async function getWorkspaceStatus(workspace_id) {
    return new Promise((resolve, reject) => {
        const params = {
            workspace_id: workspace_id,
        };

        assistant.getWorkspace(params, function(err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(res.status);
            }
        });
    })
}

// This Watson API endpoint has a rate limit of 20 requests per second. We will make one request every 5 seconds, just to be on the safe side
async function runEvery(func, params, interval = 5) {
    var status = '';
    var start = new Date().getTime();
    do {
        var current = new Date().getTime();
        if ((current - start)/1000 > interval) {
            var start = new Date().getTime();
            status = await func(params);
        }
    } while (status != 'Available');
    return true;
}

async function isWorkspaceAvailable(workspace_id) {
    return await runEvery(getWorkspaceStatus, workspace_id);
}

async function checkExample(workspace_id, example) {
    return new Promise((resolve, reject) => {
        assistant.message({
            workspace_id: workspace_id,
            input: {'text': example}
        },  function(err, res) {
            if (err) {
                reject(err)
            } else {
                resolve(res.intents[0])
            }
        });
    });
}

async function createExample(workspace_id, intent, example) {
    return new Promise((resolve, reject) => {
        var params = {
            workspace_id: workspace_id,
            intent: intent,
            text: example
        };

        assistant.createExample(params, function(err, res) {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        });
    })
}

async function checkAndTrain(workspace_id, examples){
    // Loop through all examples
    let count = 0;
    let not_trained = []
    for (example of examples) {
        count += 1;
        // Wait until the trainning is done
        await isWorkspaceAvailable(workspace_id);
        // Check the example against Watson and store the returned intent and confidence
        let result = await checkExample(workspace_id, example);
        console.log(result.intent + ' : ' + result.confidence*100 + '%');
        // We will add the example, only if classified incorrectly or with a low confidence score
        if (result.intent != intent || result.confidence <= maxConfidence) {
            await createExample(workspace_id, intent, example);
        }
        // Else add to not_trained
        else not_trained.push(example);
        console.log(`${count} examples done, ${examples.length - count} remaining`)
    }
    return not_trained;
}

async function main() {
    // Fetch all the intent's examples
    let examples = await getIntentExamples(workspace_id, intent);
    // Watson return the examples already sorted, but we will sort again, just to be sure
    examples = examples.sort();
    if (examples.length > 0) {
        // Delete all examples from the intent
        await updateIntent(workspace_id, intent, []);
    }
    // Check and train examples
    console.log("Checking examples")
    let not_trained = await checkAndTrain(workspace_id, examples);
    // Recheck all not trained examples
    console.log("Rechecking not trained examples")
    not_trained = await checkAndTrain(workspace_id, not_trained);
}

main();
