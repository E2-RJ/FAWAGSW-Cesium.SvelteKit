<script lang="ts">
    import { Button } from "$ui_sh/button";
    import * as Dialog from "$ui_sh/dialog/index.js";
    import { Input } from "$ui_sh/input";
    import { cn } from "$lib/utils.js";
    import { tick } from "svelte";

    import * as c from "$lib/components/e2/Cesium/Cesium.svelte";

    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";

    import { Atom } from "lucide-svelte";
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";

    import { createEventDispatcher } from "svelte";

    //create an event dispatcher
    const dispatch = createEventDispatcher();

    let id: string;
    let name: string;
    let type: string;

    let open = false;

    $: selectedValue =
        types.find((f) => f.value === type)?.label ?? "Select a type...";

    $: buttonDisabled = true;

    const types = [
        {
            value: "geojson",
            label: "GeoJSON",
        },
        {
            value: "terrain",
            label: "Terrain",
        },
    ];

    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }

    function checkInput() {
        buttonDisabled = true;

        function checkId() {
            if (id?.toString().length == 7) {
                console.log("ID correct length");
                return true;
            } else {
                return false;
            }
        }

        function checkName() {
            if (/\s/.test(name) == false) {
                console.log("No whitespace");
                if (name?.toString().length >= 3) {
                    console.log("Name correct length");
                    return true;
                } else {
                    return false;
                }
            }
        }

        function checkType() {
            if (type?.length > 0) {
                console.log("Type set")
                return true;
            } else {
                return false;
            }
        }

        switch (type) {
            case "geojson":
                if (
                    checkType() == true &&
                    checkId() == true &&
                    checkName() == true
                ) {
                    buttonDisabled = false;
                }
                break;
            case "terrain":
                if (checkType() && checkId()) {
                    buttonDisabled = false;
                }
                break;
        }
    }

    function addION() {
        switch (type) {
            case "czml":
            case "geojson":
                c.ds.load(id, "ion", type, "doc.geojson", name);
                break;
            case "terrain":
                c.changeTerrain(id);
                break;
        }
    }
</script>

<Dialog.Root>
    <Dialog.Trigger
        ><Button variant="outline" size="icon">
            <Atom class="h-4 w-4" />
        </Button></Dialog.Trigger
    >
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Cesium ION</Dialog.Title>
            <Dialog.Description>
                "Please enter the information from your cesium ION assets page."
            </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
            <div class="flex w-lg max-w-md flex-row gap-2.5">
                <Popover.Root bind:open let:ids>
                    <Popover.Trigger asChild let:builder>
                        <Button
                            builders={[builder]}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            class="w-[200px] justify-between"
                        >
                            {selectedValue}
                            <ChevronsUpDown
                                class="ml-2 h-4 w-4 shrink-0 opacity-50"
                            />
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content class="w-[200px] p-0">
                        <Command.Root>
                            <Command.Input placeholder="Search type..." />
                            <Command.Empty>No type found.</Command.Empty>
                            <Command.Group>
                                {#each types as framework}
                                    <Command.Item
                                        value={framework.value}
                                        onSelect={(currentValue) => {
                                            type = currentValue;
                                            closeAndFocusTrigger(ids.trigger);
                                            checkInput();
                                        }}
                                    >
                                        <Check
                                            class={cn(
                                                "mr-2 h-4 w-4",
                                                type !== framework.value &&
                                                    "text-transparent",
                                            )}
                                        />
                                        {framework.label}
                                    </Command.Item>
                                {/each}
                            </Command.Group>
                        </Command.Root>
                    </Popover.Content>
                </Popover.Root>
                <Input
                    placeholder="id"
                    bind:value={id}
                    on:change={checkInput}
                />
                {#if type !== "terrain"}
                    <Input
                        placeholder="Name (No Spaces)"
                        bind:value={name}
                        on:change={checkInput}
                    />
                {/if}
                <Button
                    disabled={buttonDisabled}
                    class="login-btn"
                    on:click={() => addION()}>Add</Button
                >
            </div>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
