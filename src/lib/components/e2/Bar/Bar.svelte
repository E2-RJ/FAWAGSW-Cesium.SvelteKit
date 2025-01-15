<script lang="ts">
    import * as cesium from "$lib/components/e2/Cesium/Cesium.svelte";
    import { Button } from "$ui_sh/button";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    //let [geoChecked1, geoChecked2, geoChecked3] = [true,true,true];

    let datasourceVisability = {
        geoJSON1: true,
        geoJSON2: true,
        geoJSON3: true,
    };

    function handleChange(d: string) {
        cesium.ds.visability(d, !datasourceVisability[d]);
    }
</script>

<div class="flex items-center space-x-2">
    <Checkbox
        id="terms"
        bind:checked={datasourceVisability.geoJSON1}
        on:click={async () => handleChange("geoJSON1")}
        aria-labelledby="terms-label"
    />
    <Label
        id="terms-label"
        for="terms"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
        geoJSON1
    </Label>
    <Checkbox
        id="terms"
        bind:checked={datasourceVisability.geoJSON2}
        on:click={async () => handleChange("geoJSON2")}
        aria-labelledby="terms-label"
    />
    <Label
        id="terms-label"
        for="terms"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
        geoJSON1
    </Label>
    <Checkbox
        id="terms"
        bind:checked={datasourceVisability.geoJSON3}
        on:click={async () => handleChange("geoJSON3")}
        aria-labelledby="terms-label"
    />
    <Label
        id="terms-label"
        for="terms"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
        geoJSON1
    </Label>
</div>
<div class="flex items-center space-x-2">
    <Button on:click={async () => cesium.changeTerrain(2975662)}>
        LIDAR001</Button
    >
    <Button on:click={async () => cesium.changeTerrain(2975648)}
        >LIDAR002</Button
    >
    <Button on:click={async () => cesium.changeTerrain(2975646)}
        >LIDAR003</Button
    >
</div>
<div class="flex items-center space-x-2">
    <Button on:click={async () => cesium.f.to(-2.8191839, 51.457361, 1000)}>
        POI1</Button
    >
    <Button on:click={async () => cesium.f.to(-2.7858999, 51.462126, 1000)}
        >POI2</Button
    >
    <Button on:click={async () => cesium.f.to(-2.8046459, 51.461386, 500)}
        >POI3</Button
    >
    <Button on:click={async () => cesium.f.home()}
        >Home</Button
    >
</div>
