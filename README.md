# Don’t Look Away Now — The Crisis of Homelessness in the United States

## Background and Motivation 
There are at least half a million homeless people in the United States. As residents of the world’s 
largest economy with 23 trillion USD, we can do better. 

Using data from federal- and state-level organizations' official websites, we hope to present the problem of 
homelessness through interactive 
visualizations. Through interacting with our website, users will have an understanding of how big the problem is,
how it has evolved in the past decade, and what are some constructive actions they can take to help. 


## About Our Data  
This repository contains all the data and code for visualizing homelessness
in the U.S. between 2007 - 2020. The datasets on homelessness (which includes fields on gender, race, housing situations, and homelessness categories) are 
retrieved 
from the U.S. Department of Housing and Urban Development’s official 
<a href="https://www.hud.gov/">website</a>. We also consult other sources for information 
on specialized terms and definitions, past policies and budget dedicated to homelessness, and 
the housing burden in the U.S. For more detailed information on our sources, scroll down to see the `references` section below. 

In addition to references where we retrieve raw datasets, 
you can find the our detailed `DATA_GUIDE.md`, our cleaner files, 
and our processed data in the `data` folder. See 
the `Project Structure` section below on how our project is set up.

## Project Structure 

Our core project structure is as follows: 

```
├── .idea
├── css /* styling */
├── data /* data guide, datasets, cleaner files */ 
├── img /* images */
|
├── js /* code for visualizations */
├── LICENSE
├── README.md  
├── index.html /* main page */

```
All the files in each folder are code contributions made by our team 
members with the exception of the following referenced files (see the `libraries` in our `Tech Stack` section for more details):
```
/* Files retrieved from referenced sources - see Tech Stack section 
for more information on libraries used */

├── ...
├── css
│   ├── bootstrap.min.css 
│   └── fullpage.css
│   └── nouislider.css
|
├── ...
├── js
│   ├── fullpage.js
│   ├── nouislider.js
├── ...


```

## Helpful URLs
- <a href="https://drive.google.com/file/d/1MFdEPUjgHYdupsBSMJVsC1PsUoeRIljK/view?usp=sharing">Screencast Video</a>

- <a href="https://charlesonesti.github.io/US_Homelessness_Visualizations/">Github Webpage</a>
- <a href="https://docs.google.com/document/d/1SKUV3RnabXFBrdPKYr70lonRGwcH8bHzALpNjXKVNEs/edit?usp=sharing">Process Book</a>

## Tech Stack

- <b>Programming languages</b>: JavaScript, HTML, CSS, R
- <b>DCE</b>: WebStorm, RStudio 
- <b>Libraries</b>: d3.js (TOPOJSON, GEOJSON, albersUSA, d3-time), fullpageJS, NoUISlider, Bootstrap

## References
<li>The U.S. Department of
Housing and Urban Development (2022). 2007-2021 Point in Time Estimates of Homelessness by State</li>
<li>The U.S. Department of
Housing and Urban Development (2022). 2007-2021 Housing Inventory Count By State</li>
<li>Bureau of Economic Analysis (2021). Gross Domestic Product in the US </li>
<li>Lopez, German. Homeless in America (July 15, 2022). The New York Times</li>
<li>
National Association of Counties (May 14, 2018). Affordable Housing Federal Programs and Legislation.
</li>
<li>
United to End Homelessness (2022). Types of Housing Support for the Homeless
<li>New York City Independent Budget Office (March 2022). Adams Increases Funds for Homeless Shelters, But More Needed for Shelters & Other Programs
</li>
<li>
The California Legislature's Nonpartisan Fiscal and Policy Advisor (2022). The Governor’s Homelessness Plan 2022-2023
</li>
<li>
Coventry, K. What’s In the Approved Fiscal Year 2021 Budget for Homeless Services? (October 2, 2020). DC Fiscal Policy Institute
</li>
<li>
Statista Research Department (2022). Estimated rate of homelessness in the United States in 2020, by state (per 10,000 population)
</li>
<li>
Joint  Center for Housing Studies of Harvard University (2022). Renter Cost Burdens, States
</li>
