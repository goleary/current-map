- [ ] get direction of markers

##

data

stations are viewable here: https://tidesandcurrents.noaa.gov/map/index.html
white stations are subordinate & do not return current prediction data. Only the purple ones return data.

###

- Positive speed is flood
- Negative speed is ebb

Need a backend that can be hit with

- lat/long boundary
- time

Returns

- All Stations inside boundary
  - coordinates
  - mean ebb/flow directions
  - current speed

Later we'll probably want it to return multiple speeds
