/*
 * Node.js Worker (Standalone, ESM)
 * This file is a standalone file and isn't being a part of the build/bundle
 */
import { parentPort } from "worker_threads";
import { join } from "path";
// Test Path
//import Index from "../../src/index.js";
//import { Index } from "../../dist/flexsearch.bundle.module.min.js";
import { Index } from "flexsearch";

/** @type Index */
let index;
/** @type {IndexOptions} */
let options;

parentPort.on("message", async function(data){

    const task = data["task"];
    const id = data["id"];
    let args = data["args"];

    switch(task){

        case "init":

            options = data["options"] || {};
            // load extern field configuration
            let filepath = options["config"];
            if(filepath){
                filepath = join("file://", filepath);
                options = Object.assign({}, options, (await import(filepath))["default"]);
                delete options.worker;
            }

            index = new Index(options);
            //index.db && await index.db;

            parentPort.postMessage({ "id": id });
            break;

        default:

            let message;

            if(task === "export"){
                if(!options.export || typeof options.export !== "function"){
                    throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"export\".");
                }
                // skip non-field indexes
                if(!args[1]) args = null;
                else{
                    args[0] = options.export;
                    args[2] = 0;
                    args[3] = 1; // skip reg
                }
            }
            if(task === "import"){
                if(!options.import || typeof options.import !== "function"){
                    throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"import\".");
                }
                if(args[0]){
                    const data = await options.import.call(index, args[0]);
                    index.import(args[0], data);
                }
            }
            else{
                message = args && index[task].apply(index, args);
                if(message && message.then){
                    message = await message;
                }
                if(message && message.await){
                    message = await message.await;
                }
                if(task === "search" && message.result){
                    message = message.result;
                }
            }

            parentPort.postMessage(
                task === "search"
                    ? { "id": id, "msg": message }
                    : { "id": id }
            );
    }
});
