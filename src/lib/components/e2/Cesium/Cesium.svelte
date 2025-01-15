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

  interface homeViewObject {
    lon: number;
    lat: number;
    hei: number;
  }
  export let homeView: Cartesian3;

  class dataSource {
    load(
      datasource: any,
      type: string = "czml",
      oldName: string = "",
      newName: string = "",
    ) {
      switch (type) {
        case "czml":
          viewer.dataSources.add(Cesium.CzmlDataSource.load(datasource));
          Console.Log(
            "SUCCESS",
            `Loaded ${datasource} datasource from ${type}`,
          );
          break;
        case "geojson":
          viewer.dataSources.add(Cesium.GeoJsonDataSource.load(datasource));
          Console.Log(
            "SUCCESS",
            `Loaded ${datasource} datasource from ${type}`,
          );
          break;
      }
      if (oldName !== "" && newName !== "") {
        setTimeout(new dataSource().rename, 250, oldName, newName);
      }
      viewer.scene.requestRender();
    }
    rename(oldName: string, newName: string) {
      Console.Log("STATUS", `Renaming ${oldName} datasource to ${newName}`);
      var dS = viewer.dataSources.getByName(oldName);
      var dSN = viewer.dataSources.indexOf(dS[0]); // Get the datasources number
      if (dSN !== -1) {
        viewer.dataSources.get(dSN).name = newName; // Set datasource visability
        Console.Log("SUCCESS", `${oldName} datasource name set to ${newName}`);
      } else {
        Console.Log("WARNING", `${oldName} datasource not found`);
      }
    }
    list() {
      // List all datasources stored within Cesium
      Console.Log("STATUS", `Listing Datasources`);
      for (let i = 0; i < viewer.dataSources.length; i++) {
        Console.Log("SUCCESS", `Found datasource`);
        console.log(viewer.dataSources.get(i));
      }
    }
    visability(name: string, visable: boolean) {
      // Toggle visability of a given datasource
      var dS = viewer.dataSources.getByName(name); // Get the datasource
      var dSN = viewer.dataSources.indexOf(dS[0]); // Get the datasources number
      if (dSN !== -1) {
        viewer.dataSources.get(dSN).show = visable; // Set datasource visability
        viewer.scene.requestRender();
        Console.Log(
          "STATUS",
          `${name} datasource visability set to ${visable}`,
        );
      } else {
        Console.Log("WARNING", `${name} datasource not found`);
      }
    }
    remove(name: [string], inverse: boolean = false) {
      // Remove selected datasource(s)
      Console.Log("STATUS", `Removing ${name} datasource`);
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
        viewer.scene.requestRender();
        Console.Log("SUCCESS", `${name} datasource destroyed`);
      }
      if (instances <= 0) {
        Console.Log("WARNING", `${name} datasource not found`);
      }
    }
  }

  export const ds = new dataSource();

  class fly {
    to(lon: number, lat: number, hei: number, newHome: boolean = false) {
      Console.Log(
        "STATUS",
        `Flying to ${lon}, ${lat}; ending at a height of ${hei}`,
      );
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
      });
      Console.Log(
        "SUCCESS",
        `Flown to ${lon}, ${lat}; ending at a height of ${hei}`,
      );
      if (newHome == true) {
        homeView = new Cesium.Cartesian3.fromDegrees(lon, lat, hei);
      }
    }
    home() {
      Console.Log("STATUS", `Flying home`);
      viewer.camera.flyTo({
        destination: homeView,
      });
      Console.Log("SUCCESS", `Flown home`);
    }
  }

  export const f = new fly();

  /*
  export function renameDatasource(d: string, n: string) {
    Console.Log("STATUS", `Renaming ${d} datasource to ${n}`);
    var dS = viewer.dataSources.getByName(d);
    var dSN = viewer.dataSources.indexOf(dS[0]); // Get the datasources number
    if (dSN !== -1) {
      viewer.dataSources.get(dSN).name = n; // Set datasource visability
      Console.Log("SUCCESS", `${d} datasource name set to ${n}`);
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
    Console.Log("STATUS", `Removing ${name} datasource`);
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
      Console.Log("SUCCESS", `${name} datasource destroyed`);
    }
    if (instances <= 0) {
      Console.Log("WARNING", `${name} datasource not found`);
    }
  }

  export function flyTo(
    lon: number,
    lat: number,
    hei: number,
    newHome: boolean = false,
  ) {
    Console.Log(
      "STATUS",
      `Flying to ${lon}, ${lat}; ending at a height of ${hei}`,
    );
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    });
    Console.Log(
      "SUCCESS",
      `Flown to ${lon}, ${lat}; ending at a height of ${hei}`,
    );
    if (newHome == true) {
      homeView = [lon, lat, hei];
    }
  }
  */

  export function changeTerrain(a: any, t: string = "ion") {
    Console.Log("STATUS", `Loading Terrain Data ${a} from ${t}`);
    switch (t) {
      case "ion":
        viewer.scene.setTerrain(
          new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(a)),
        );
        Console.Log("SUCCESS", `Loaded Terrain Data ${a} from ${t}`);
        break;
    }
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
    f.to(-2.8136329, 51.458441, 5000, true);

    const [geoJSON1, geoJSON2, geoJSON3] = [
      await Cesium.IonResource.fromAssetId(2975982),
      await Cesium.IonResource.fromAssetId(2975981),
      await Cesium.IonResource.fromAssetId(2975980),
    ];

    ds.rename;

    ds.load(geoJSON1, "geojson", "doc.geojson", "geoJSON1");
    ds.load(geoJSON2, "geojson", "doc.geojson", "geoJSON2");
    ds.load(geoJSON3, "geojson", "doc.geojson", "geoJSON3");
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
            ds.list();
            alert("Something has gone wrong");
            break;
        }
      } else {
        Console.Log("STATUS", `Point deselected`);
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
