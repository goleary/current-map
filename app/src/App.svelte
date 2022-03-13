<script lang="ts">
  import L from "leaflet";
  import * as markerIcons from "./markers";
  import type { StationWithPrediction } from "./types";
  let map;

  let sliderValue = 0;

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

  function createMarker(station: StationWithPrediction, index: number) {
    const prediction = station.predictions[index];
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

  let markerLayers = L.layerGroup();
  let stations = [];

  function mapAction(container) {
    map = createMap(container);

    const fetchStationData = async () => {
      const params = new URLSearchParams({
        begin_date: "20220312",
        end_date: "20220314",
        interval: "30",
      });
      const response = await fetch(
        "https://omniscient-society-production.up.railway.app/predictions?" +
          params.toString(),
        {}
      );

      stations = (await response.json()) as StationWithPrediction[];
    };
    fetchStationData();

    return {
      destroy: () => {
        map.remove();
        map = null;
      },
    };
  }
  $: if (map) {
    // TODO: probably need to remove the old layer here...?
    for (let s of stations) {
      let m = createMarker(s, sliderValue);
      markerLayers.addLayer(m);
    }
    markerLayers.addTo(map);
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
  <div>sliderValue: {sliderValue}</div>
  <input
    type="range"
    min={0}
    max={9}
    bind:value={sliderValue}
    class="slider"
    id="myRange"
  />
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
  .slider {
    width: 500px;
  }
</style>
