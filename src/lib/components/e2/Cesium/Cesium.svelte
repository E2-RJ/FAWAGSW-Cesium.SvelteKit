<script context="module" lang="ts">
  import {
    Viewer,
    Credit,
    Cartesian3,
    ClockRange,
    Color,
    Entity,
    HermitePolynomialApproximation,
    JulianDate,
    SampledProperty,
  } from "cesium";
  import * as Cesium from "cesium";
  export let selectedPoint: string;

  // cesium viewer
  export let viewer: Viewer;
  export let credit: Credit;

  export function loadDatasource(
    datasource: any,
    type: string = "czml",
    oldName: string = "",
    newName: string = "",
  ) {
    // Load in given datasource
    switch (type) {
      case "czml":
        viewer.dataSources.add(Cesium.CzmlDataSource.load(datasource));
        break;
      case "geojson":
        viewer.dataSources.add(Cesium.GeoJsonDataSource.load(datasource));
        break;
    }
    if (oldName !== "" && newName !== "") {
      setTimeout(renameDatasource, 250, oldName, newName);
    }
  }

  function renameDatasource(d: string, n: string) {
    var dS = viewer.dataSources.getByName(d);
    var dSN = viewer.dataSources.indexOf(dS[0]); // Get the datasources number
    if (dSN !== -1) {
      viewer.dataSources.get(dSN).name = n; // Set datasource visability
      Console.Log("STATUS", `${d} datasource name set to ${n}`);
    } else {
      Console.Log("WARNING", `${d} datasource not found`);
    }
  }

  export function listDatasources() {
    // List all datasources stored within Cesium
    Console.Log("STATUS", `Listing Datasources`);
    for (let i = 0; i < viewer.dataSources.length; i++) {
      Console.Log("SUCCESS", `Found datasource`);
      console.log(viewer.dataSources.get(i));
    }
  }

  export function toggleDatasources(name: string, visable: boolean) {
    // Toggle visability of a given datasource
    var dS = viewer.dataSources.getByName(name); // Get the datasource
    var dSN = viewer.dataSources.indexOf(dS[0]); // Get the datasources number
    if (dSN !== -1) {
      viewer.dataSources.get(dSN).show = visable; // Set datasource visability
      Console.Log("STATUS", `${name} datasource visability set to ${visable}`);
    } else {
      Console.Log("WARNING", `${name} datasource not found`);
    }
  }

  export function removeDatasources(name: [string], inverse: boolean = false) {
    // Remove selected datasource(s)
    let instances = 0;
    for (let i = 0; i < viewer.dataSources.length; i++) {
      switch (inverse) {
        default:
        case false: // Remove given datasource
          if (!name.indexOf(viewer.dataSources.get(i).name)) {
            var dS = viewer.dataSources.get(i); // Get the datasource, based on the index
            viewer.dataSources.remove(dS, true); // Destroy the datasource
            instances++;
          }
          break;
        case true: // Remove all datasources, except the given one
          if (name.indexOf(viewer.dataSources.get(i).name)) {
            var dSA = viewer.dataSources.get(i); // Get the datasource, based on the index
            viewer.dataSources.remove(dSA, true); // Destroy the datasource
            instances++;
          }
          break;
      }
      Console.Log("STATUS", `${name} datasource destroyed`);
    }
    if (instances <= 0) {
      Console.Log("WARNING", `${name} datasource not found`);
    }
  }

  function flyTo(lon: number, lat: number, hei: number) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    });
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import "cesium/Build/Cesium/Widgets/widgets.css";
  import {
    accessToken,
    sensorAPI,
    projectAPI,
    sideBarComponent,
    setNodeID,
    debug,
    routeToPage,
  } from "$mid/store";
  import type { CreditCard } from "lucide-svelte";
  import * as Console from "$mid/log";

  //import { getData } from "$mid/dbStore.js";

  // cesium access token
  Cesium.Ion.defaultAccessToken = accessToken;

  if (typeof window !== "undefined") {
    // browser code
  }

  // CESIUM BASIC SETTINGS
  onMount(async () => {
    viewer = new Viewer("cesiumContainer", {
      // UI
      animation: false, // Show animation controls
      baseLayerPicker: false, // Show base layer picker
      fullscreenButton: false, // Show fullscreen button
      vrButton: false,
      geocoder: false, // Show location search
      homeButton: false, // Show home button
      infoBox: true, // Show infobox when point is clicked
      sceneModePicker: false, // Show scene mode picker
      selectionIndicator: false, // Show indicator around selected point
      timeline: false, // Show Timeline
      navigationHelpButton: false, // Show help button
      //creditContainer: document.createElement("none"), // Show cesium ion link

      // EFFECTS?
      shouldAnimate: true, // Animation on by default
      scene3DOnly: true,
      requestRenderMode: true, // Only render on request from entity, reduces CPU usage
      maximumRenderTimeChange: Infinity, // Time in with a new frame is requested, depending on simulation time changes. (Set to a high value, such as Infinity, if no elements in your scene change with simulation time)
    });
  });

  credit = new Cesium.Credit(
    '<a href="https://google.com/" target="_blank"><img src="/images/cesium_logo.png"  style="vertical-align: -7px" title="Cesium"/></a>',
  );

  /*
  const layers = viewer.scene.imageryLayers;

  const cesiumLogo = Cesium.ImageryLayer.fromProviderAsync(
  Cesium.SingleTileImageryProvider.fromUrl("/src/lib/assets/Logomark/e2_logomark_white.svg", {
    rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
  },{options: {alpha: 1}})
);

layers.add(cesiumLogo);
*/

  // Start Svelte Lifecycle
  onMount(async () => {
    const [geoJSON1, geoJSON2, geoJSON3] = [
      await Cesium.IonResource.fromAssetId(2975982),
      await Cesium.IonResource.fromAssetId(2975981),
      await Cesium.IonResource.fromAssetId(2975980),
    ];

    const [terrain1, terrain2, terrain3] = [
      new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(2975662)),
      new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(2975648)),
      new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(2975646)),
    ];

    loadDatasource(geoJSON1, "geojson", "doc.geojson", "geoJSON1");
    loadDatasource(geoJSON2, "geojson", "doc.geojson", "geoJSON2");
    loadDatasource(geoJSON3, "geojson", "doc.geojson", "geoJSON3");

    viewer.scene.setTerrain(terrain1, terrain2, terrain3);
  });

  onMount(async () => {
    viewer.selectedEntityChanged.addEventListener(function (selectedEntity) {
      // Listens for picked entity

      if (Cesium.defined(selectedEntity)) {
        selectedPoint = selectedEntity.name;
        let nodeType = String(selectedEntity.properties.nodeType);
        setNodeID(selectedEntity.name);
        Console.Log("STATUS", `Selected ${selectedEntity.name}`);
        switch (nodeType) {
          case "geoJSON1":
            break;
          case "geoJSON2":
            break;
          case "geoJSON2":
            break;
          default:
            listDatasources();
            alert("Something has gone wrong");
            break;
        }
      } else {
        Console.Log("STATUS", `Point deselected`);
        toggleDatasources("sensorNodeLocations", true);
        toggleDatasources("projectNodeLocations", true);
        toggleDatasources("mediaNodeLocations", false);
        sideBarComponent.set("home");
      }
    });
  });
</script>

<main
  id="cesiumContainer"
  class="fixed h-screen w-screen m-0"
  class:border-green-500={debug}
  class:border-2={debug}
/>
