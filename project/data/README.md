# Data Folder

This folder contains all the data used for the project.

### Data Files:

- **trains_switzerland.csv:** Many key metrics from the National Railway Company regarding their operations and environmental impact
  - *Source:* Swiss National Railway Company, Statistics Portal (though custom request had to be made), Bern (CH), link
  - *Timeframe:* 1903 to 2021 but most data is only available from 2010 onwards, which is sufficient as our analysis will center around the pandemic
  - *Data points:* Train-km, passenger-km, energy consumption, total energy consumption
  - *Concerns:* Missing data and potential changes in reporting standards
- **trains_europe.csv:** Rail service metrics per year for countries in Europe (with additional information about a country's size and population)
  - *Source:* Rail Strategy Report (2017-2021), Independent Regulator's Group - Rail, Zagreb (HR), link (size and population information from the World Bank)
  - *Timeframe:* 2016 to 2020 with very little missing data
  - *Data points:* Passenger-km per capita
  - *Concerns:* Measuring discrepancies between this dataset and the one from the National Railway company, inconsistent measuring between the countries, and 1-2 missing years for the Czech Republic, Ireland, and Serbia
- **infrastructure_europe.csv:** Trail rail route-km per countries in Europe (with additional information about a country's size)
  - *Source:* The World Bank Data (2022), World Bank Group, Washington, D.C. (US), link (size)
  - *Timeframe:* 2019
  - *Data points:* Rail-km per size
  - *Concerns:* Some missing data
- **eu_shapes.json:** json shapefile of Europe for the choropleth
  - *Source:* leakyMirror on [GitHub](https://github.com/leakyMirror/map-of-europe/blob/master/TopoJSON/europe.topojson)
  - *Timeframe:* Recent
  - *Data points:* Shape of European Countries
  - *Concerns:* None, shapes seem correct
