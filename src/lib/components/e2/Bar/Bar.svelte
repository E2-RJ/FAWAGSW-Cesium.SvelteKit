<script lang="ts">
    import * as c from "$lib/components/e2/Cesium/Cesium.svelte";
    import { Button } from "$ui_sh/button";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import AddION from "$ui_e2/Dialog/AddION.svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

    let datasourceVisability = {
        GorMoor: true,
        WLCanal: true,
        EAMRivers: true,
        GorNPEm: true,
        FreBoa: true,
        WFDCat: true,
        HyrNOSurvey: true,
    };

    function handleChange(d: string) {
        c.ds.visability(d, !datasourceVisability[d]);
    }
</script>

<ScrollArea class="rounded-md">
    <div class="relative mb-4 max-w-md max-h-[85vh]">
        <div class="flex flex-col rounded-lg bg-primary p-4 m-8">
            <h1 class="text-white text-lg font-bold">FWAG SW Data Layers</h1>
            <br />
            <div>
                <AddION />
                <Label
                    id="terms-label"
                    for="terms"
                    class="ml-1 text-white text-md font-medium leading-none  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Add datasource (e2)
                </Label>
                <br />
                <br />
                <div class="flex flex-col items-left space-y-2">
                    <h1 class="mt-1 text-primary-foreground">Data Layers</h1>
                    <div>
                        <Checkbox
                            class="accent-orange-500 border-2 border-white rounded-md"
                            id="terms"
                            bind:checked={datasourceVisability.GorMoor}
                            on:click={async () => handleChange("GorMoor")}
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="ml-1 text-white text-sm font-medium leading-none  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Gordano Moor Boundary
                        </Label>
                    </div>
                    <div>
                        <Checkbox
                            id="terms"
                            bind:checked={datasourceVisability.WLCanal}
                            on:click={async () => handleChange("WLCanal")}
                            class="accent-orange-500 border-2 border-white rounded-md"
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="ml-1  text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Surrounding Rivers
                        </Label>
                    </div>
                    <div>
                        <Checkbox
                            id="terms"
                            bind:checked={datasourceVisability.EAMRivers}
                            on:click={async () => handleChange("EAMRivers")}
                            class="accent-orange-500 border-2 border-white rounded-md"
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            EA Main Rivers
                        </Label>
                    </div>
                    <div>
                        <Checkbox
                            id="terms"
                            bind:checked={datasourceVisability.GorNPEm}
                            on:click={async () => handleChange("GorNPEm")}
                            class="accent-orange-500 border-2 border-white rounded-md"
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Anna Peat Emissions Data
                        </Label>
                    </div>
                    <div>
                        <Checkbox
                            id="terms"
                            bind:checked={datasourceVisability.FreBoa}
                            on:click={async () => handleChange("FreBoa")}
                            class="accent-orange-500 border-2 border-white rounded-md"
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="ml-1  text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Anna Freeboard Data
                        </Label>
                    </div>
                    <div>
                        <Checkbox
                            id="terms"
                            bind:checked={datasourceVisability.WFDCat}
                            on:click={async () => handleChange("WFDCat")}
                            class="accent-orange-500 border-2 border-white rounded-md"
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Portbury Ditch Water Catchement
                        </Label>
                    </div>
                    <div>
                        <Checkbox
                            id="terms"
                            bind:checked={datasourceVisability.HyrNOSurvey}
                            on:click={async () => handleChange("HyrNOSurvey")}
                            class="accent-orange-500 border-2 border-white rounded-md"
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            HydroNode_Ordnance Survey OPEN RIVERS
                        </Label>
                    </div>
                </div>
                <br />
                <div class="flex flex-col items-left space-y-2">
                    <h1 class="mt-1 text-primary-foreground">LiDAR Layers</h1>
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
                <div class="flex flex-col items-left space-y-2">
                    <h1 class="mt-1 text-primary-foreground">Camera</h1>
                    <Button
                        variant="secondary"
                        on:click={async () => c.f.home()}>Home</Button
                    >
                    <Button
                        variant="secondary"
                        on:click={async () =>
                            c.f.to(-2.8191839, 51.457361, 1000)}
                    >
                        POI1</Button
                    >
                    <Button
                        variant="secondary"
                        on:click={async () =>
                            c.f.to(-2.7858999, 51.462126, 1000)}>POI2</Button
                    >
                    <Button
                        variant="secondary"
                        on:click={async () =>
                            c.f.to(-2.8046459, 51.461386, 500)}>POI3</Button
                    >
                </div>
            </div>
        </div>
    </div>
</ScrollArea>
