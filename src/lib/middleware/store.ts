// store.js
import { writable } from 'svelte/store';
import * as Console from "$lib/middleware/log"
import { goto } from "$app/navigation";
import * as indexDB from "$mid/dbStore";

// GLOBAL DEBUG e.g. switch blockout boundaries
export let debug = false; // DO NOT POPULATE MANUALLY! See package.json.

if (import.meta.env.VITE_debug == "true") {
    Console.Log("STATUS", `debug set to true`)
    debug = true
}

// API SERVER ADDRESS

export const apiServer = { url: "https://uat-api.ecosystem2.co.uk" } // Default option 
//export const apiServer = { url: "http://localhost:8004" } // Default option 

if (import.meta.env.VITE_MODE == "localDev") { // Changes apiServer to localhost, when "npm run dev-local" is used. Allows accessing protected endpoints from localhost without SSL (requires api server to be running locally).
    apiServer.url = "http://localhost:8004";
    Console.Log("STATUS", `Sending requests to local server: ${apiServer.url}`)
} else if (import.meta.env.VITE_MODE == "dev") { // Changes apiServer to UAT server, when "npm run dev" is used. Please note, SSL certs are required when accessing protected endpoints from localhost.
    apiServer.url = "https://uat-api.ecosystem2.co.uk";
    Console.Log("STATUS", `Sending requests to UAT server: ${apiServer.url}`);
}

// API ENDPOINTS
export const sensorAPI = apiServer.url + "/sensors/";
export const projectAPI = apiServer.url + "/projects/";
export const mediaAPI = apiServer.url + "/media/";
export const userAPI = apiServer.url + "/user/";

// CESIUM ACCESS TOKEN - Used by cesium to access geospatial data
export const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYWUyNjIzYy0xYzE0LTQ1ZTEtYjY5MC05YmE4NjVhYTBlNjIiLCJpZCI6MzgxMzMsImlhdCI6MTYwNTk4MTA5OH0.dzv2SW0dHtIDhANhtYd7UzFK6p78BTZByXCjXiT8QdY"; // Cesium Access Token

//CHANGE ROUTE - Mainly used by Cesium to change the route, based on what point is clicked
export function routeToPage(route: string, replace: boolean) {
    if (typeof window !== 'undefined' && route && typeof route === 'string') {
        goto(`/${route}`, { replaceState: replace }).catch((error) => {
            console.error('Navigation error:', error);
            goto(`/404`, { replaceState: true });
        });
    } else {
        console.error('Invalid route or environment:', route);
    }
}

// SIDEBAR COMPONENT CONTAINER - Used to request a component be rendered within the sidebar
export const sideBarComponent = writable();

// NODE ID - Used by components to request data on given node (These are the geospatial points you see displayed by cesium)
export let nodeID: string;
export function setNodeID(data: string) {
    nodeID = "";
    nodeID = data;
}

// SENSOR VIEW
export const jsonStore = writable();

export const readingStore = writable();
export const historicalStore = writable();
export const timeSeriesStore = writable();

// PROJECT VIEW
export const projectMetaData = writable();

// USER VIEW
export let userSession: any
export function setUserSession(cookie = {}) {
    userSession = "";
    userSession = cookie;
}
export let userID
export async function setUserID(data = {}) {
    userID = {};
    userID = await indexDB.getObject("userID", "userStore", true);
    console.log("set userid: ",userID)
}

// UserProfile
export let listSelection: string;
export function setListSelection(data: string) {
    listSelection = "";
    listSelection = data;
}

// USER MEDIA
export let userMedia: any[] = []
export function setUserMedia(data, option) {
    if (option == "clear") {
        userMedia = []
        userMedia.push(data)
    }
    else {
        userMedia.push(data)
    }
}

// MEDIA UPLOAD
export const uploadedMedia = writable();


// TEST DATA
export const testCZML = [
    {
        "id": "document",
        "name": "ecosystem2 Test Node Locations",
        "version": "1.0"
    },
    {
        "name": "20230901-152910-000.JPG",
        "properties": {
            "nodeType": "4D65646961"
        },
        "position": {
            "cartographicDegrees": [
                -2.8549208,
                53.3351164,
                100
            ]
        },
        "point": {
            "pixelSize": 12,
            "color": {
                "rgba": [255, 0, 0, 255]
            },
            "outlineColor": {
                "rgba": [255, 255, 255, 255]
            },
            "outlineWidth": 1,
            "heightReference": "CLAMP_TO_GROUND",
        },
        "label": {
            "text": "MEDIA",
            "font": "10pt monospace",
            "style": "FILL_AND_OUTLINE",
            "outlineWidth": 2,
            "verticalOrigin": "BOTTOM",
            "pixelOffset": {
                "cartesian2": [0, -9]
            }
        }
    }

]

export const testProject = {
    _id: "665f03ce44b94927baa4bf6f",
    projectID: "example-project",
    projectTitle: "Example Project",
    projectDescription: "This project is used for testing various components, using offline data",
    userID: "example-user",
    latestupdate: "",
    creationDate: "DATE",
    projectLocation: [-2.9812947, 53.407633, 100],
    mediaID: ["20200223-145227-000.JPG", "20230901-152910-000.JPG"],
};

export const testImageMetadata = [
    {
        mediaID: "20200223-145227-000.JPG",
        desc: "A parody of the creation of adam, involving Jake from Adventure Time",
        dateTime: "20200223-145227",
        location: [
            -2.9871667,
            53.3975306,
            100
        ],
        tags: [
            "Jake",
            "Liverpool"
        ],
        userID: "example-user",
        projectID: "example-project"
    },
    {
        mediaID: "20230901-152910-000.JPG",
        desc: "Image of a freshly made viennese whirl.",
        dateTime: "20230901-152910",
        location: [
            -2.9823119,
            53.4072339,
            100
        ],
        tags: [
            "Biscuit",
            "Sweet"
        ],
        userID: "example-user",
        projectID: "example-project"
    }
];

export const createSamples = (...lengths) => { // Create dummy test data
    const createSamplesLevel = (depth = 0) => {
        const length = lengths[depth];
        return [...Array(length)].map(() => {
            return {
                ...getSample(),
                ...(lengths[depth + 1] !== undefined ? { children: createSamplesLevel(depth + 1) } : {}),
            };
        });
    };
    return createSamplesLevel();
};

const getSample = () => {
    const statusChance = Math.random();
    return {
        firstName: statusChance > 0.25 ? 'Matthew' : statusChance > 0.25 ? 'John' : statusChance > 0.25 ? 'Sam' : 'Frank',
        lastName: statusChance > 0.25 ? 'Smith' : statusChance > 0.25 ? 'Doe' : statusChance > 0.25 ? 'Williams' : 'Mc Guire',
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single',
    };
};

