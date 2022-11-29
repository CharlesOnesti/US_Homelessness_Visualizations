### About Our Data 
We got our datasets from the U.S. Department of Housing and Urban Development’s official website. We then process and clean our data with R and RStudio. All our datasets and cleaner files are stored in the data folder in our project repository.

The structure for the data folder is as follows:

```
data    
├── map_category /* years: 2007-2020 */ 
|   |
│   └── state_2007.csv 
│   └── state_2008.csv 
│   └── ...
│   └── state_2020.csv 
├── scripts 
|   |
│   └── category_map_cleaner.Rmd 
│   └── dot_pie_cleaner.Rmd
├── governors_usa.csv <-- You are here  
├── race_gender_2021.csv 
├── state_counts_2007_2020.csv 

```
The `map_category` folder stores data for homelessness categories (individuals, families, veterans, and total homeless population) across all US states for the years between 2007-2020. All the data in this folder is used for the category map and the radar map showing the top 5 states with the most homelessness.

The `script` folder stores our R markdown files documenting our data cleaning process.

The `governors_usa.csv` file stores data on governor's name and their contact information for all states. This is used in our contact map section. 

The `race_gender_2021.csv` file stores data on gender (female, male, others) and race (White, Black, Hispanic/Latino, Others)

The `state_counts_2007_2020.csv` file stores data on the number of people in different types of housing (emergency shelter, transitional housing, unsheltered)

