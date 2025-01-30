<script lang="ts">
    import * as Table from "$lib/components/ui/table";
    import { createEventDispatcher } from "svelte";
    import { Skeleton } from "$ui_sh/skeleton/index.js";

    export let data;

    $: keyValueArray = [];

    let render = false;

    async function build(latestReading) {
        console.log("logContents:", latestReading); // Log to the console

        keyValueArray = [];

        for (let key in latestReading) {
            if (key !== "_id" && key !== "sensorID") {
                console.log(`${key}: ${latestReading[key]}`);
                keyValueArray.push({ key: key, value: latestReading[key] });
            }
        }
        console.log(keyValueArray);
    }
    const dispatch = createEventDispatcher();

    function fieldSelection(key) {
        dispatch("fieldSelection", key);
    }
</script>

<div class="pl-1 mb-4">
    {#await build(data.res)}
        <div class="flex items-center space-x-4">
            <div class="space-y-2">
                <Skeleton class="h-4 w-[150px]" />
                <Skeleton class="h-4 w-[150px]" />
                <Skeleton class="h-4 w-[150px]" />
            </div>
            <div class="space-y-2">
                <Skeleton class="h-4 w-[250px]" />
                <Skeleton class="h-4 w-[250px]" />
                <Skeleton class="h-4 w-[250px]" />
            </div>
        </div>
    {:then}
        <div id="readingTable">
            <Table.Root class="w-[350px] my-4">
                {#each keyValueArray as { key, value }}
                    <Table.Body class="w-[350px]  b-1">
                        <Table.Row class="border-1 rounded-md">
                            <Table.Cell
                                class="text-primary-foreground rounded-md border-2 secondary-foreground"
                                on:click={() => fieldSelection(key)}
                                >{key}</Table.Cell
                            >
                            <Table.Cell
                                class="text-primary-foreground rounded-md border-2 secondary-foreground"
                                contenteditable="false">{value}</Table.Cell
                            >
                        </Table.Row>
                    </Table.Body>
                {/each}
            </Table.Root>
        </div>
    {/await}
</div>
