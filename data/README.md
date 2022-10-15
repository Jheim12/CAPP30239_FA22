# Data for the Final Project

### Why this Topic?

Since a young age while growing up in Switzerland, I have been fascinated by trains. The hability to step onto them in one part of the country and, a couple of hours later, exit them to find yourself in surrounded by a different langage, nature, and other local specialties is obviously a large part of the railway romantics that has captured many over the decades.

Switzerland is know for having one of the best railways systems in the world and growing up there was definitely a treat in that regard. Yet, despite being very good, the National Railway Company also has its flaws. 

For one, despite being considered a sustainable way of travelling, trains consume lots of energy. Hence, there is also a need to tailor railservice to passenger demand. Especially during the Covid pandemic, when travel/commute demand was down, the Nataional Railway Company did not decrease their service a lot. Thus, I want to investigate by how much the passenger demand has decreased and if the National Railway Company's response was adequate to it.

I will mention, however, that the intention is not to necessarily critique the response as maintaining a high level of railservice during the pandemic was critical despite the lack of demand. That's because it is considered "critical infrastructure" that many rely on daily. Rather, it is supposed to be an analysis of the National Railway Company's response to a decrease in demand and compare it to other countries.

### Datasets

I have two datasets, one at the Swiss and one at the European level:
- trains_switzerland: Many key metrics from the National Railway Company regarding their operations and environmental impact from 1903 to 2021, but most data is only available from 2010 onwards
  - Source: Swiss National Railway Company, Statistics Portal (though custom request had to be made), Bern (CH), [link](https://reporting.sbb.ch/en/home?sv_lang=3&sv_lang_change=true)
  - Timeframe: 1903 to 2021 but most data is only available from 2010 onwards, which is sufficient as our analysis will center around the pandemic
  - Potential data points: million train-km, million passenger-km, energy consumption (kWh/100 Pkm), greenhouse gass emissions (g/100 Pkm)
  - Concerns: Missing data and potential changes in reporting standards
  - Source Type: Secondary as it is collected and published by the National Railway Company, but this will be my primary dataset as I will use it to analyse the offer and demand of railservice through the pandemic years
  

- trains_europe: Million train-km (with share of passenger trains) and the billion passenger-km per country in the Schengen area from 2016 to 2020. (source: IRG - Rail)
