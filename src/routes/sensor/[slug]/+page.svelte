<script lang="ts">
    import { onMount } from "svelte";
    import Table from "$ui_e2/Bar/IOT/Table.svelte";
    import Graph, { createTimeSeries } from "$ui_e2/Bar/IOT/Graph.svelte";
    import { sensorAPI, readingStore, historicalStore } from "$mid/store";
    //import { selectedPoint } from "$ui_e2/Cesium/Cesium.svelte";
    import * as Console from "$mid/log";
    import { page } from "$app/stores";
    import Separator from "$ui_sh/separator/separator.svelte";

    export let data;

    let showGraph = false;
    $: selectedPoint = $page.params.slug;

    function handleFieldSelection(event) {
        if (event.detail !== "dateTime") {
            let hist =
                sensorAPI +
                selectedPoint +
                "/" +
                new Date("2023-12-01T00:00:00.000Z").toISOString() +
                "/" +
                new Date("2023-12-08T00:00:00.000Z").toISOString();
            Console.Log("REQUEST", `Fetch ${hist}`);
            fetch(hist, { method: "GET" }) // Returns a Json object, containing historical readings for selected sensor. IF NO ID IS PROVIDED, YOU GET BACK A PRE-DEFINED QUERY
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    //Process the response
                    Console.Log("SUCCESS", `Fetch ${hist}`);
                    console.table(json);
                    if (!json) {
                        alert(JSON.stringify(json)); //Show popup with raw json response, as a string
                    }

                    historicalStore.set(json);

                    return;
                })
                .then(function () {
                    createTimeSeries(event.detail);
                })
                .catch(function (error) {
                    Console.Log("ERROR", `${error}`);
                });

            showGraph = true;
        } else {
            Console.Log("WARNING", `${event.detail} is not an accepted field`);
        }
    }
</script>

<div>
    <h1 class="text-lg text-primary-foreground font-semibold my-4">
        Sensor Readings:
    </h1>
    <Separator class="my-2 w-4/5" />
    <Table {data} on:fieldSelection={handleFieldSelection} />

    {#if showGraph}
        <Graph></Graph>
    {:else}
        <p class="flex flex-row space-x-1.5 text-primary-foreground">
            Please select field ...
        </p>
    {/if}
</div>
