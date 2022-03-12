<script lang="ts">
  import L from "leaflet";
  import * as markerIcons from "./markers";
  import type { StationWithPrediction } from "./types";
  let map;

  const initialView = [48, -123];

  function createMap(container) {
    let m = L.map(container, { preferCanvas: true }).setView(initialView, 8);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
        subdomains: "abcd",
        maxZoom: 14,
      }
    ).addTo(m);

    return m;
  }

  function markerIcon(rotation = 0, color = "black") {
    let html = `
      <div class="map-marker"
        style="transform: rotate(${rotation}deg); fill: ${color}">
        ${markerIcons.arrow}
      </div>`;
    return L.divIcon({
      html,
      className: "map-marker",
    });
  }

  function createMarker(station: StationWithPrediction) {
    const [prediction] = station.predictions;
    if (!prediction) {
      throw Error("no prediction to create marker");
    }
    const rotation =
      prediction.Velocity_Major > 0
        ? prediction.meanFloodDir
        : prediction.meanEbbDir;
    let color = "black";
    if (Math.abs(prediction.Velocity_Major) > 7) {
      color = "red";
    } else if (Math.abs(prediction.Velocity_Major) > 3) {
      color = "yellow";
    } else if (Math.abs(prediction.Velocity_Major) > 1) {
      color = "green";
    }
    let icon = markerIcon(rotation, color);
    let marker = L.marker([station.lat, station.lng], { icon });

    return marker;
  }

  let markerLayers;
  function mapAction(container) {
    map = createMap(container);

    markerLayers = L.layerGroup();

    const addMarkers = async () => {
      const response = await fetch(
        "https://omniscient-society-production.up.railway.app/predictions"
      );

      const stations = (await response.json()) as StationWithPrediction[];
      console.log("stations: ", stations);
      for (let s of stations) {
        let m = createMarker(s);
        markerLayers.addLayer(m);
      }

      markerLayers.addTo(map);
    };
    addMarkers();

    return {
      destroy: () => {
        map.remove();
        map = null;
      },
    };
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
</script>

// TODO: add tooltip // TODO: add scrubber
<svelte:head>
  <title>PNW Current Map</title>
  <meta name="robots" content="noindex nofollow" />
  <html lang="en" />
</svelte:head>

<main>
  <h1>PNW Current map</h1>
</main>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>
<svelte:window on:resize={resizeMap} />

<div class="map" style="height:100%;width:100%" use:mapAction />

<style>
  .map :global(.marker-text) {
    width: 100%;
    text-align: center;
    font-weight: 600;
    background-color: #444;
    color: #eee;
    border-radius: 0.5rem;
  }

  .map :global(.map-marker) {
    width: 30px;
    transform: translateX(-50%) translateY(-25%);
  }
</style>
