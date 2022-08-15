# chart-gl

# Introduction

chart-gl is a library for displaying charts using WebGL technology.

The main purpose of the library is to display charts with a large number of points, such as waveforms.

## Example

```jsx
<Area>
  <Title align="top" style={{ color: '#fff' }}>
    Waveform
  </Title>
  <Axis domain={[0, 2000]} />
  <Axis align="left" />
  <Lines series={series} />
  <Grid refY="left" />
</Area>
```

## Demo

To examine the demos in your local build, execute:

```sh
$ npm run start
```
