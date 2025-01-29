<script lang="ts">
    import * as c from "$lib/components/e2/Cesium/Cesium.svelte";
    import { Button } from "$ui_sh/button";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import AddION from "$ui_e2/Dialog/AddION.svelte";
    import DemiAuth from "$ui_e2/Dialog/AuthDialog.svelte";
    import * as Console from "$mid/log";

    import { projectAPI, authenticated } from "$mid/store";

    let datasourceVisability = {
        GorMoor: true,
        WLCanal: true,
        EAMRivers: true,
        GorNPEm: true,
        FreBoa: true,
        WFDCat: true,
        HyrNOSurvey: true,
        GordanoDipwells: true,
        GordanoEcohydro: true,
        MajorWaterways: true,
        MinorWaterways: true,
        GordanoReserves: true,
    };

    function handleChange(d: string) {
        c.ds.visability(d, !datasourceVisability[d]);
    }

    function handleAuthState(event) {
        let user = authenticated;
        c.ds.remove(["projectSensorNodeLocations"]);
        fetch(projectAPI + `FWAGSW/sensor/${user}`, {
            method: "GET",
        }) // Include the cookie in the headers
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                // pass response into function
                Console.Log("REQUEST", `Fetch listSensors`);
                Console.Log("SUCCESS", `${json.length - 1} sensors recieved`); // Log number of sensors we recieved
                console.table(json.slice(1));
                c.ds.load(json);
            });
    }
</script>

<div>
    <h1 class="text-white text-lg font-bold">FWAG SW Data Layers</h1>
    <br />
    <div>
        <DemiAuth on:authentication={handleAuthState} />
        <!--NOT connected to DB-->
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
                    bind:checked={datasourceVisability.MajorWaterways}
                    on:click={async () => handleChange("MajorWaterways")}
                    class="accent-orange-500 border-2 border-white rounded-md"
                />
                <Label
                    id="terms-label"
                    for="terms"
                    class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Major Waterways
                </Label>
            </div>
            <div>
                <Checkbox
                    id="terms"
                    bind:checked={datasourceVisability.MinorWaterways}
                    on:click={async () => handleChange("MinorWaterways")}
                    class="accent-orange-500 border-2 border-white rounded-md"
                />
                <Label
                    id="terms-label"
                    for="terms"
                    class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Minor Waterways
                </Label>
            </div>
            <div>
                <Checkbox
                    id="terms"
                    bind:checked={datasourceVisability.GordanoDipwells}
                    on:click={async () => handleChange("GordanoDipwells")}
                    class="accent-orange-500 border-2 border-white rounded-md"
                />
                <Label
                    id="terms-label"
                    for="terms"
                    class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Gordano Dipwells
                </Label>
            </div>
            <div>
                <Checkbox
                    id="terms"
                    bind:checked={datasourceVisability.GordanoEcohydro}
                    on:click={async () => handleChange("GordanoEcohydro")}
                    class="accent-orange-500 border-2 border-white rounded-md"
                />
                <Label
                    id="terms-label"
                    for="terms"
                    class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Ecohydrological Features
                </Label>
            </div>
            <div>
                <Checkbox
                    id="terms"
                    bind:checked={datasourceVisability.GordanoReserves}
                    on:click={async () => handleChange("GordanoReserves")}
                    class="accent-orange-500 border-2 border-white rounded-md"
                />
                <Label
                    id="terms-label"
                    for="terms"
                    class="ml-1 text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Gordano Reserves
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
        </div>
        <br />
        <div class="flex flex-col items-left space-y-2">
            <h1 class="mt-1 text-primary-foreground">LiDAR Layers</h1>
            <Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975662)}
                >EA Digital Surface Model 1 - 1m</Button
            >
            <Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975648)}
                >EA Digital Surface Model 2 - 1m</Button
            >
            <Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975646)}
                >EA Digital Terrain Model 1 - 1m</Button
            >

            <!--<Button
                variant="secondary"
                on:click={async () => c.changeTerrain(2975994)}
                >Vegetation Object Model 1</Button
            >
                    <Button
                        variant="secondary"
                        on:click={async () => c.changeTerrain(2975997)}
                        >Vegetation Object Model</Button
                    >-->
        </div>
        <br />
        <div class="flex flex-col items-left space-y-2">
            <h1 class="mt-1 text-primary-foreground">Camera</h1>
            <Button variant="secondary" on:click={async () => c.f.home()}
                >Home</Button
            >
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
        </div>
    </div>
</div>
