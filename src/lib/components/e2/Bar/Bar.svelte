<script lang="ts">
    import * as c from "$lib/components/e2/Cesium/Cesium.svelte";
    import { Button } from "$ui_sh/button";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    let datasourceVisability = {
        geoJSON1: true,
        geoJSON2: true,
        geoJSON3: true,
    };

    function handleChange(d: string) {
        c.ds.visability(d, !datasourceVisability[d]);
    }
</script>

<div class="flex flex-col rounded-lg bg-primary p-4 m-8">
    <h1 class="text-white">UAT FWAG BUTTONS</h1>
    <br />
    <div>
        <div class="flex items-center space-x-2">
            <Checkbox
                id="terms"
                bind:checked={datasourceVisability.geoJSON1}
                on:click={async () => handleChange("geoJSON1")}
                class="accent-orange-500"
            />
            <Label
                id="terms-label"
                for="terms"
                class="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Gordano_Moor_WGS84
            </Label>
            <Checkbox
                id="terms"
                bind:checked={datasourceVisability.geoJSON2}
                on:click={async () => handleChange("geoJSON2")}
                class="accent-orange-500"
            />
            <Label
                id="terms-label"
                for="terms"
                class="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Watercourse_Link_CanalRiversTrust_Clipped
            </Label>
            <Checkbox
                id="terms"
                bind:checked={datasourceVisability.geoJSON3}
                on:click={async () => handleChange("geoJSON3")}
                class="accent-orange-500"
            />
            <Label
                id="terms-label"
                for="terms"
                class="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                EA_Main_Rivers_Surroundings
            </Label>
        </div>
        <br />
        <div class="flex items-center space-x-2">
            <Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975662)}
                >DSM_ST4070_P_10614_20210404_20210404_wgs84</Button
            >
            <Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975648)}
                >DSM_ST4070_P_10614_20210404_20210404_wgs84</Button
            >
            <Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975646)}
                >DTM_ST4570_P_10614_20210404_20210404_wgs84</Button
            >

            <!--<Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975994)}
                >Vegetation Object Model 1</Button
            >
            <Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975997)}
                >Vegetation Object Model 2</Button
            >-->
        </div>
        <br />
        <div class="flex items-center space-x-2">
            <Button
                variant="secondary"
                on:click={async () => c.f.to(-2.8191839, 51.457361, 1000)}
            >
                POI1</Button
            >
            <Button
                variant="secondary"
                on:click={async () => c.f.to(-2.7858999, 51.462126, 1000)}
                >POI2</Button
            >
            <Button
                variant="secondary"
                on:click={async () => c.f.to(-2.8046459, 51.461386, 500)}
                >POI3</Button
            >
            <Button variant="secondary" on:click={async () => c.f.home()}
                >Home</Button
            >
        </div>
    </div>
</div>
