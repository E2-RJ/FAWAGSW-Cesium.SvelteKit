<script context="module">
    import { historicalStore } from "$mid/store";

    let timerSeriesArray = [];
    //let noot;

    export function createTimeSeries(key) {
        console.log("creating time series");
        if (key != "dateTime") {
            //noot = key;
            console.log("key: ", key);

            historicalStore.subscribe((data) => {
                timerSeriesArray = [];
                console.log("HistoricalStore", data); // Log to the console
                //console.log("NOOT NOOT:", timerSeriesArray[0].date);
                for (let obj in data) {
                    timerSeriesArray.push({
                        date: data[obj].dateTime,
                        close: data[obj][key],
                    });
                }

                timeSeriesStore.set(timerSeriesArray);
            });
        }
    }

    export function graphVisability() {
        timerSeriesArray = [];
        return true;
    }
</script>

<script>
    import * as d3 from "d3";
    import { timeSeriesStore } from "$mid/store";
    import Separator from "$ui_sh/separator/separator.svelte";
    // The chart dimensions and margins as optional props.
    export let width = 1000;
    export let height = 800;
    export let marginTop = 20;
    export let marginRight = 20;
    export let marginBottom = 30;
    export let marginLeft = 40;
    let loaded = false;

    let xScale, yScale, line;

    $: visability = "FROZEN";

    //$: selectedKey = noot

    //$: selectedKey = noot

    // Receive plot data as prop.
    //export let data;

    timeSeriesStore.subscribe((data) => {
        console.log("TSA: ", timerSeriesArray);
        console.log("Array: ", data);

        // Create the x (horizontal position) scale
        xScale = d3.scaleUtc(
            d3.extent(timerSeriesArray, (d) => new Date(d.date)),
            [marginLeft, width - marginRight],
        );

        // Create the y (vertical position) scale.
        // yScale = d3.scaleLinear(
        //     [20, d3.max(timerSeriesArray, (d) => d.close)],
        //     [height - marginBottom, marginTop],
        // );
        yScale = d3.scaleLinear([20, 37], [height - marginBottom, marginTop]);

        // Create the line generator.
        line = d3
            .line()
            .x((d) => xScale(new Date(d.date)))
            .y((d) => yScale(d.close));

        if (timerSeriesArray.length > 0) {
            visability = "READY";
        }

        if (visability === "FROZEN") {
            timerSeriesArray = [];
        }
    });
</script>

<div class="w-[350px]">
    {#key loaded}
        {#if "READY" === visability}
            <h1 class="text-md text-primary-foreground font-semibold my-4">
                Graph:
            </h1>
            <svg
                id="timeSeriesGraph"
                class="timeSeriesGraph"
                {width}
                {height}
                viewBox="0 0 {width} {height}"
                style:max-width="100%"
                style:height="auto"
            >
                <!-- X-Axis -->
                <g transform="translate(0,{height - marginBottom})">
                    <line stroke="silver" x1={marginLeft - 6} x2={width} />

                    {#each xScale.ticks() as tick}
                        <!-- X-Axis Ticks -->
                        <line
                            stroke="silver"
                            x1={xScale(tick)}
                            x2={xScale(tick)}
                            y1={0}
                            y2={6}
                        />

                        <!-- X-Axis Tick Labels -->
                        <text
                            fill="silver"
                            text-anchor="middle"
                            x={xScale(tick)}
                            y={22}
                        >
                            {tick.getFullYear()}
                        </text>
                    {/each}
                </g>

                <!-- Y-Axis and Grid Lines -->
                <g transform="translate({marginLeft},0)">
                    {#each yScale.ticks() as tick}
                        {#if tick !== 0}
                            <!-- 
            Grid Lines. 
            Note: First line is skipped since the x-axis is already present at 0. 
          -->
                            <line
                                stroke="silver"
                                stroke-opacity="1.5"
                                x1={0}
                                x2={width - marginLeft}
                                y1={yScale(tick)}
                                y2={yScale(tick)}
                            />

                            <!-- 
            Y-Axis Ticks. 
            Note: First tick is skipped since the x-axis already acts as a tick. 
          -->
                            <line
                                stroke="silver"
                                x1={0}
                                x2={-6}
                                y1={yScale(tick)}
                                y2={yScale(tick)}
                            />
                        {/if}

                        <!-- Y-Axis Tick Labels -->
                        <text
                            fill="silver"
                            text-anchor="end"
                            font-size="30px"
                            dominant-baseline="middle"
                            x={-9}
                            y={yScale(tick)}
                        >
                            {tick}
                        </text>
                    {/each}

                    <!-- Y-Axis Label -->
                    <text
                        fill="silver"
                        text-anchor="start"
                        x={-marginLeft}
                        y={15}
                    >
                        <!--{noot}:-->
                    </text>
                </g>

                <path
                    fill="none"
                    stroke="silver"
                    stroke-width="4.4"
                    d={line(timerSeriesArray)}
                />
            </svg>
        {:else if "FROZEN" === visability}
            <div></div>
        {/if}
    {/key}
</div>
