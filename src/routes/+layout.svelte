<script lang="ts">
    import Cesium from "$lib/components/e2/Cesium/Cesium.svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { Button } from "$ui_sh/button";
    import { Home } from "lucide-svelte";
</script>

<div class="relative">
    <Cesium />
    <div class="fixed">
        <div class="relative mb-4 max-w-md max-h-[85vh]">
            <div class="flex flex-col rounded-lg bg-primary p-4 m-8">
                <Button variant="outline" size="icon" href="/">
                    <Home class="h-4 w-4" />
                </Button>
                <ScrollArea class="rounded-md">
                    <slot class="fixed" />
                </ScrollArea>
            </div>
        </div>
    </div>
</div>
