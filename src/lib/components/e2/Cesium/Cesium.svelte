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

  // Create an initial camera view
  var initialPosition = new Cesium.Cartesian3.fromDegrees(
    -2.959,
    53.369,
    1700.082,
  );
  var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
    -3.7,
    -37.9,
    0.0,
  );
  var homeCameraView = {
    destination: initialPosition,
    orientation: {
      heading: initialOrientation.heading,
      pitch: initialOrientation.pitch,
      roll: initialOrientation.roll,
    }, // Add some camera flight animation options
    duration: 2.0,
    maximumHeight: 2000,
    pitchAdjustHeight: 2000,
    endTransform: Cesium.Matrix4.IDENTITY,
  };

  class dataSource {
    async load(
      datasource: any,
      source: string = "json",
      type: string = "czml",
      key: string = "",
      oldName: string = "",
      newName: string = "",
      options = {},
    ) {
      let d = datasource;
      //const [s, t, o, n] = [source, type, oldName, newName];
      console.log(datasource, source, type, key, oldName, newName);
      Console.Log("REQUEST", `Loading ${datasource} from ${source}`);

      if (source == "ion") {
        console.log("Creating cesium ion request");
        switch (type) {
          case "czml":
          case "geojson":
            console.log("Requesting GeoJSON from cesium ion");
            if (key == "") {
              d = await Cesium.IonResource.fromAssetId(datasource);
            } else if (key !== "") {
              d = await Cesium.IonResource.fromAssetId(datasource, {
                accessToken: key,
              });
            }
            break;
          case "pointCloud":
            console.log("Requesting PointCloud from cesium ion");
            d = await Cesium.Cesium3DTileset.fromIonAssetId(datasource);
            break;
        }
      }
      switch (type) {
        case "czml":
          viewer.dataSources.add(Cesium.CzmlDataSource.load(d));
          Console.Log(
            "SUCCESS",
            `Loaded ${datasource} datasource from ${type}`,
          );
          break;
        case "geojson":
          console.log(d);
          await viewer.dataSources.add(
            Cesium.GeoJsonDataSource.load(d, options),
          );
          Console.Log(
            "SUCCESS",
            `Loaded ${datasource} datasource from ${type}`,
          );
          break;
        case "pointCloud":
          console.log(d);
          let prim = await viewer.scene.primitives.add(d);
          prim.name = newName;
          prim.show = false;
          if (options !== "") {
            prim.style = new Cesium.Cesium3DTileStyle(options);
          }
          break;
      }
      if (type !== "pointCloud") {
        if (oldName !== "" && newName !== "") {
          //setTimeout(new dataSource().rename, 20, oldName, newName);
          new dataSource().rename(type, oldName, newName);
        }
      }
      viewer.scene.requestRender();
    }
    rename(type: string, oldName: string, newName: string) {
      Console.Log("STATUS", `Renaming ${oldName} ${type} to ${newName}`);
      var exists = new dataSource().find(type, newName);
      console.log(exists);
      if (exists !== -1) {
        Console.Log(
          "WARNING",
          `${newName} ${type} already exists, is this intentional?`,
        );
      } else {
        var dSN = new dataSource().find(type, oldName); // Get the datasources number

        switch (type) {
          case "czml":
          case "geojson":
            if (dSN !== -1) {
              viewer.dataSources.get(dSN).name = newName; // Set datasource visability
              Console.Log(
                "SUCCESS",
                `${oldName} datasource name set to ${newName}`,
              );
            } else {
              Console.Log("ERROR", `${oldName} datasource not found`);
            }
            break;
          case "pointCloud":
            if (dSN !== -1) {
              viewer.scene.primitives.get(dSN).name = newName; // Set datasource visability
              Console.Log(
                "SUCCESS",
                `${oldName} datasource name set to ${newName}`,
              );
            } else {
              Console.Log("ERROR", `${oldName} datasource not found`);
            }
            break;
        }
      }
    }

    find(type: string, name: string) {
      let dS, dSN;
      switch (type) {
        case "czml":
        case "geojson":
          dSN = -1;
          dS = viewer.dataSources.getByName(name);
          dSN = viewer.dataSources.indexOf(dS[0]); // Get the datasources number
          Console.Log("SUCCESS", `Found datasource ${name}`);
          console.log(dS);
          break;
        case "pointCloud":
          console.log("FINDING: " + name);
          dSN = -1;
          for (let i = 0; i < viewer.scene.primitives.length; i++) {
            let dS2 = viewer.scene.primitives.get(i);
            console.log(dS2.name);
            if (dS2.name == name) {
              dSN = i;
              Console.Log("SUCCESS", `Found datasource ${dS2.name}`);
              console.log(dSN);
            } else {
              dSN = -1;
            }
          }
          break;
      }
      return dSN;
    }
    list() {
      // List all datasources stored within Cesium
      Console.Log("STATUS", `Listing Datasources`);
      for (let i = 0; i < viewer.dataSources.length; i++) {
        var dS = viewer.dataSources.get(i);
        Console.Log("SUCCESS", `Found datasource ${dS.name}`);
        console.log(dS);
      }
    }
    visability(name: string, visable: boolean) {
      // Toggle visability of a given datasource
      var dSN = new dataSource().find("czml", name); // Get the datasources number
      if (dSN !== -1) {
        viewer.dataSources.get(dSN).show = visable; // Set datasource visability
        viewer.scene.requestRender();
        Console.Log(
          "STATUS",
          `${name} datasource visability set to ${visable}`,
        );
      } else {
        Console.Log("ERROR", `${name} datasource not found`);
      }
    }

    cloudVisability(visable: boolean) {
      console.log(visable);
      // Toggle visability of a given datasource
      for (let i = 0; i < viewer.scene.primitives.length; i++) {
        var dS = viewer.scene.primitives.get(i);
        //viewer.scene.primitives.get(i).name = i;
        if (dS.name == "3021154" || dS.name == "3020415") {
          dS.show = visable;
        }
        Console.Log("SUCCESS", `Found datasource ${dS.name}`);
        console.log(dS);
      }
      viewer.scene.requestRender();
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
        Console.Log("ERROR", `${name} datasource not found`);
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

  export let viewModel: { [key: string]: any } = {
    show: false,
    gradient: false,
    band1Position: [100],
    band2Position: [80.76],
    band3Position: [67.93],
    bandThickness: [7.36],
    bandTransparency: 0.5,
    backgroundTransparency: 0.75,
  };

  export function showMaterial(show: boolean) {
    console.log(show);
    viewModel.show = show;
    updateMaterial();
  }

  export function updateViewModel(key: string, value: number[]) {
    viewModel[key] = value;
    console.log(viewModel);
    updateMaterial();
  }

  export function updateMaterial() {
    const gradient = Boolean(viewModel.gradient);
    const band1Position = Number(viewModel.band1Position[0]);
    const band2Position = Number(viewModel.band2Position[0]);
    const band3Position = Number(viewModel.band3Position[0]);
    const bandThickness = Number(viewModel.bandThickness[0]);
    const bandTransparency = Number(viewModel.bandTransparency);
    const backgroundTransparency = Number(viewModel.backgroundTransparency);

    const layers = [];
    const backgroundLayer = {
      entries: [
        {
          height: 4200.0,
          color: new Cesium.Color(0.0, 0.0, 0.2, backgroundTransparency),
        },
        {
          height: 8000.0,
          color: new Cesium.Color(1.0, 1.0, 1.0, backgroundTransparency),
        },
        {
          height: 8500.0,
          color: new Cesium.Color(1.0, 0.0, 0.0, backgroundTransparency),
        },
      ],
      extendDownwards: true,
      extendUpwards: true,
    };
    layers.push(backgroundLayer);

    const gridStartHeight = 4200.0;
    const gridEndHeight = 8848.0;
    const gridCount = 50;
    for (let i = 0; i < gridCount; i++) {
      const lerper = i / (gridCount - 1);
      const heightBelow = Cesium.Math.lerp(
        gridStartHeight,
        gridEndHeight,
        lerper,
      );
      const heightAbove = heightBelow + 10.0;
      const alpha = Cesium.Math.lerp(0.2, 0.4, lerper) * backgroundTransparency;
      layers.push({
        entries: [
          {
            height: heightBelow,
            color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
          },
          {
            height: heightAbove,
            color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
          },
        ],
      });
    }

    const antialias = Math.min(10.0, bandThickness * 0.1);

    if (!gradient) {
      const band1 = {
        entries: [
          {
            height: band1Position - bandThickness * 0.5 - antialias,
            color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
          },
          {
            height: band1Position - bandThickness * 0.5,
            color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
          },
          {
            height: band1Position + bandThickness * 0.5,
            color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
          },
          {
            height: band1Position + bandThickness * 0.5 + antialias,
            color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
          },
        ],
      };

      const band2 = {
        entries: [
          {
            height: band2Position - bandThickness * 0.5 - antialias,
            color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
          },
          {
            height: band2Position - bandThickness * 0.5,
            color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
          },
          {
            height: band2Position + bandThickness * 0.5,
            color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
          },
          {
            height: band2Position + bandThickness * 0.5 + antialias,
            color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
          },
        ],
      };

      const band3 = {
        entries: [
          {
            height: band3Position - bandThickness * 0.5 - antialias,
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
          },
          {
            height: band3Position - bandThickness * 0.5,
            color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
          },
          {
            height: band3Position + bandThickness * 0.5,
            color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
          },
          {
            height: band3Position + bandThickness * 0.5 + antialias,
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
          },
        ],
      };

      layers.push(band1);
      layers.push(band2);
      layers.push(band3);
    } else {
      const combinedBand = {
        entries: [
          {
            height: band1Position - bandThickness * 0.5,
            color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
          },
          {
            height: band2Position,
            color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
          },
          {
            height: band3Position + bandThickness * 0.5,
            color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
          },
        ],
      };

      layers.push(combinedBand);
    }

    let material;

    if (viewModel.show) {
      material = Cesium.createElevationBandMaterial({
        scene: viewer.scene,
        layers: layers,
      });
    } else {
      material = material && material.destroy();
    }
    viewer.scene.globe.material = material;
    viewer.scene.requestRender();
  }

  export function listPrimitives() {
    Console.Log("STATUS", `Listing Primitives`);
    for (let i = 0; i < viewer.scene.primitives.length; i++) {
      var dS = viewer.scene.primitives.get(i);
      //viewer.scene.primitives.get(i).name = i;
      Console.Log("SUCCESS", `Found datasource ${dS.name}`);
      console.log(dS);
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
      baseLayerPicker: true, // Show base layer picker
      fullscreenButton: false, // Show fullscreen button
      vrButton: false,
      geocoder: false, // Show location search
      homeButton: false, // Show home button
      infoBox: true, // Show infobox when point is clicked
      sceneModePicker: false, // Show scene mode picker
      selectionIndicator: false, // Show indicator around selected point
      timeline: true, // Show Timeline
      navigationHelpButton: false, // Show help button
      //creditContainer: document.createElement("none"), // Show cesium ion link
      /*
      terrain: Cesium.Terrain.fromWorldTerrain({
        requestVertexNormals: true,
      }),
      */
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

    const geoJSON = [
      {
        name: "GorMoor",
        id: 2975982,
        options: {
          stroke: Cesium.Color.fromBytes(37, 190, 50, 255),
          fill: Cesium.Color.fromBytes(37, 190, 50, 20),
          strokeWidth: 3,
          clampToGround: true,
        },
      },
      {
        name: "GordanoDipwells",
        id: 3011735,
        options: {
          markerSize: 38,
          markerSymbol: "water",
          clampToGround: true,
        },
      },
      {
        name: "GordanoEcohydro",
        id: 3011736,
        options: {
          markerSize: 38,
          markerSymbol: "dam",
          clampToGround: true,
        },
      },
      {
        name: "MinorWaterways",
        id: 3011741,
        options: {
          stroke: Cesium.Color.fromBytes(30, 40, 250, 200),
          fill: Cesium.Color.fromBytes(37, 190, 50, 50),
          strokeWidth: 1,
          clampToGround: true,
        },
      },

      {
        name: "MajorWaterways",
        id: 3011740,
        options: {
          stroke: Cesium.Color.fromBytes(30, 40, 250, 200),
          fill: Cesium.Color.fromBytes(37, 190, 50, 50),
          strokeWidth: 1.4,
          clampToGround: true,
        },
      },
      /*
      {
        name: "WLCanal",
        id: 2975981,
        options: {
          stroke: Cesium.Color.fromBytes(0, 0, 255, 255),
          fill: Cesium.Color.fromBytes(0, 0, 255, 50),
          strokeWidth: 1,
          clampToGround: true,
        },
      },
      {
        name: "EAMRivers",
        id: 2980614,
        options: {
          stroke: Cesium.Color.fromBytes(0, 150, 255, 255),
          fill: Cesium.Color.fromBytes(0, 150, 255, 50),
          strokeWidth: 1,
          clampToGround: true,
        },
      },
*/
      {
        name: "GorNPEm",
        id: 2982305,
        options: {
          stroke: Cesium.Color.fromBytes(139, 69, 19, 255),
          fill: Cesium.Color.fromBytes(139, 69, 19, 80),
          strokeWidth: 3,
        },
      },
      {
        name: "FreBoa",
        id: 2982444,
        options: {
          stroke: Cesium.Color.fromBytes(10, 191, 255, 255),
          fill: Cesium.Color.fromBytes(10, 191, 255, 80),
          strokeWidth: 3,
          clampToGround: true,
        },
      },
      {
        name: "WFDCat",
        id: 2980668,
        options: {
          stroke: Cesium.Color.fromBytes(10, 50, 150, 255),
          fill: Cesium.Color.fromBytes(37, 50, 150, 50),
          strokeWidth: 3,
          clampToGround: true,
        },
      },
      /*
      {
        name: "HyrNOSurvey",
        id: 2980627,
        options: {
          stroke: Cesium.Color.fromBytes(37, 190, 50, 255),
          fill: Cesium.Color.fromBytes(37, 190, 50, 50),
          strokeWidth: 3,
          clampToGround: true,
        },
      },
      */

      {
        name: "GordanoReserves",
        id: 3011737,
        options: {
          stroke: Cesium.Color.fromBytes(60, 179, 114, 255),
          fill: Cesium.Color.fromBytes(60, 179, 114, 50),
          strokeWidth: 3,
          clampToGround: true,
        },
      },
    ];

    geoJSON.forEach(async function (data) {
      await ds.load(
        data.id,
        "ion",
        "geojson",
        "",
        "doc.geojson",
        data.name,
        data.options,
      );
    });

    const pointClouds = [
      {
        id: 3020415,
        name: "3020415",
        options: {
          color: {
            conditions: [
              ["${Classification} === 2", "color('brown')"], // ground
              ["${Classification} === 3", "color('greenyellow')"], // low vegetation
              ["${Classification} === 4", "color('green')"], // medium vegetation
              ["${Classification} === 5", "color('darkgreen')"], // high vegetation
              ["true", "color('white')"],
            ],
          },
        },
      },
      {
        id: 3021154,
        name: "3021154",
        options: {
          color: {
            conditions: [
              ["${Classification} === 2", "color('brown')"], // ground
              ["${Classification} === 3", "color('greenyellow')"], // low vegetation
              ["${Classification} === 4", "color('green')"], // medium vegetation
              ["${Classification} === 5", "color('darkgreen')"], // high vegetation
              ["true", "color('white')"],
            ],
          },
        },
      },
    ];

    pointClouds.forEach(async function (data) {
      console.log(data);
      await ds.load(
        data.id,
        "ion",
        "pointCloud",
        "",
        "",
        data.name,
        data.options,
      );
    });

    updateMaterial();
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
          case "73656e736f72":
            try {
              routeToPage(`sensor/${selectedEntity.name}`, true);
            } catch (error) {
              console.log(error);
            }
            break;
          case "geoJSON2":
            break;
          case "geoJSON3":
            break;
          default:
            ds.list();
            Console.Log("WARNING", `Selected an unknown entity. 👀`);
            console.log(selectedEntity);
            Console.Log(
              "INFO",
              `Belongs to datasource: ${selectedEntity.entityCollection.owner.name}`,
            );
            //alert("Something has gone wrong");
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
