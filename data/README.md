# Data for the Final Project

### Why this Topic?

Since a young age while growing up in Switzerland, I have been fascinated by trains. The ability to step onto them in one part of the country and, a couple of hours later, exit them to find yourself in surrounded by a different language, nature, and other local specialties is obviously a large part of the railway romantics that has captured many over the decades.

Switzerland is known for having one of the best railways systems in the world and growing up there was definitely a treat in that regard. Yet, despite being very good, the National Railway Company also has its flaws. 

For one, despite being considered a sustainable way of travelling, trains consume lots of energy. Hence, there is also a need to tailor rail service to passenger demand. Especially during the Covid pandemic, when travel/commute demand was down, the National Railway Company did not decrease their service a lot. Thus, I want to investigate by how much the passenger demand has decreased and if the National Railway Company's response was adequate to it.

I will mention, however, that the intention is not to necessarily critique the response as maintaining a high level of rail service during the pandemic was critical despite the lack of demand. That's because it is considered "critical infrastructure" that many rely on daily. Rather, it is supposed to be an analysis of the National Railway Company's response to a decrease in demand and compare it to other countries.

### Datasets

I have three datasets, one at the Swiss and one at the European level:
- **trains_switzerland.csv:** many key metrics from the National Railway Company regarding their operations and environmental impact
  - Source: Swiss National Railway Company, Statistics Portal (though custom request had to be made), Bern (CH), [link](https://reporting.sbb.ch/en/home?sv_lang=3&sv_lang_change=true)
  - Timeframe: 1903 to 2021 but most data is only available from 2010 onwards, which is sufficient as our analysis will center around the pandemic
  - Potential data points: million train-km, million passenger-km, energy consumption (kWh/100 Pkm), greenhouse gas emissions (g/100 Pkm)
  - Concerns: Missing data and potential changes in reporting standards
  - Source Type: primary as I will use it to analyse the offer and demand of rail service in Switzerland through the pandemic years
  
- **trains_europe.csv:** rail service metrics per year for countries in Europe (with additional information about a country's size and population)
  - Source: Rail Strategy Report (2017-2021), Independent Regulator's Group - Rail, Zagreb (HR), [link](https://www.irg-rail.eu/irg/documents/market-monitoring) ([size](https://data.worldbank.org/indicator/AG.LND.TOTL.K2) and [population](https://data.worldbank.org/indicator/SP.POP.TOTL) information from the World Bank)
  - Timeframe: 2016 to 2020 with very little missing data
  - Potential data points: million train-km, billion passenger-km per year for 31 countries
  - Concerns: measuring discrepancies between this dataset and the one from the National Railway company, inconsistent measuring between the countries, and 1-2 missing years for the Czech Republic, Ireland, and Serbia
  - Source Type: secondary, as I will use it to contrast the Swiss National Railway Company's response to the pandemic with other countries in Europe

- **infrastructure_europe.csv:** Trail rail route-km per countries in Europe (with additional information about a country's size)
  - Source: The World Bank Data (2022), World Bank Group, Washington, D.C. (US), [link](https://data.worldbank.org/indicator/IS.RRS.TOTL.KM) ([size](https://data.worldbank.org/indicator/AG.LND.TOTL.K2))
  - Timeframe: 2019
  - Potential data points: rail-km
  - Concerns: some missing data
  - Source Type: Secondary, as I will use it to introduce the topic

### Potential Plots

With the prior dataset, I hope to display service metrics and contrast them with the demand and emissions/energy consumption. I think an overlapping linechart or barchart with the demand above and the emissions/energy consumption below the x-axis could work well.

To compare the pandemic response with other countries, I would like to create a map displaying the train-km and passenger-km metrics in an appealing way.

Then, undoubtably, these two types of graphs will reveal patterns that will prompt discussions and further questions that can be investigated with other graphs! :grin:
