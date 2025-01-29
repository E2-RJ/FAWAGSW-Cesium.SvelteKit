import { sensorAPI } from "$mid/store";
import * as Console from "$mid/log";

export async function load({ fetch, params }) {
    const id = params.slug;
    const url = `${sensorAPI}${id}`;
    const res = await fetch(url, { method: "GET" })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            //Process the response
            Console.Log("SUCCESS", `Fetch sensorAPI/${id}`);
            console.table(json);
            if (!json) {
                alert(JSON.stringify(json)); //Show popup with raw json response, as a string
            }

            //readingStore.set(json);

            return json
        })
        .catch(function (error) {
            Console.Log("ERROR", `${error}`);
        });
    return { res };

}