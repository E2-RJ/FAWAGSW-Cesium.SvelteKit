<script context="module">
    let com = "";

    export function setComponent(component) {
        com = component;
    }
</script>

<script lang="ts">
    import { Button } from "$ui_sh/button";
    import { Fingerprint } from "lucide-svelte";
    import * as Dialog from "$ui_sh/dialog";
    import Input from "$ui_sh/input/input.svelte";
    import * as indexDB from "$mid/dbStore";

    import { authenticated, setAuth } from "$mid/store";

    import { createEventDispatcher } from "svelte";

    let field: string;
    //create an event dispatcher
    const dispatch = createEventDispatcher();

    //const authourized = ["test-User"]

    function login() {
        setAuth(field);
        dispatch("authentication", "true");
    }
</script>

<Dialog.Root>
    <Dialog.Trigger
        ><Button variant="outline" size="icon">
            <Fingerprint class="h-4 w-4" />
        </Button></Dialog.Trigger
    >
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Session Login</Dialog.Title>
            <Dialog.Description>
                Please enter your UUID token to begin a session.
            </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
            <div class="flex w-lg max-w-md flex-row gap-2.5">
                <!-- <Input type="email" id="email" placeholder="email" /> -->
                <Input
                    type="uuid"
                    id="uuid"
                    placeholder="uuid"
                    bind:value={field}
                />
                <Button class="login-btn" on:click={() => login()}>Login</Button
                >
            </div>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
