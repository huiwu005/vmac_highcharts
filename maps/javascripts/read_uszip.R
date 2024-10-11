# this script outputs use in partial_es3.js
# data1 is used for series_data_es3 in drilldown - level 2: zip level
# data2 is used for geoids in first level - county level
library(dplyr)
library(tidyr)
library(jsonlite)

tn_zip_county_fips <- read.csv("maps/files/uszips_hc-key.csv") %>% 
filter(state_id == "TN") %>% 
select(zip,county_fips,county_fips_all,hc.key) %>% 
rename(code = zip)

data1 <- tn_zip_county_fips %>% 
select(code,county_fips) %>% unique() %>% arrange(county_fips) %>% 
group_by(county_fips) %>% 
mutate(value = row_number()) %>% ungroup() %>% 
arrange(code) %>% select(code,value)

data1$code <- as.character(data1$code)
write_json(data1,"maps/files/data1.json", pretty=TRUE)

tn_zip_county_fips_sep <- 
separate_rows(tn_zip_county_fips,3,sep = "\\|") %>% 
filter(grepl("^47",county_fips_all)) %>% 
rename(geoid = county_fips_all) %>% arrange(geoid)
write.csv(tn_zip_county_fips_sep,"maps/files/tn_zip_county_fips_sep.csv",row.names=F,quote=F)

# convert zipcode to county_fips/GEOID, then sum value.
data2 <- merge(data1,tn_zip_county_fips_sep[,c("code","geoid")],by="code",all.x=T) %>% 
select(geoid,value) %>% 
group_by(geoid) %>% 
summarise(value = sum(value)) %>% 
arrange(geoid)

write_json(data2,"maps/files/data2.json", pretty=TRUE)
