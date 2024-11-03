library(dplyr)
library(jsonlite)
library(ggvenn)

num_fmt <- function(x) format(round(as.numeric(x), 1), nsmall=0, big.mark=",")

set.seed(123)
setwd("/Users/huiwu/work_dir/My/my-first-js/core")
elig <- read.table("files/venn/elig_v3v4_20240819.txt",header=T) %>% 
head(.,200195)
mega <- read.table("files/venn/MEGAFinal.fam",sep=" ") %>% select(V2) %>% unique() 

data <- data.frame(elig = length(elig$GRID),mega = length(mega$V2))
data$megaex_v4 <- mega %>% filter(V2 %in% elig$GRID) %>% nrow()
write_json(data,"files/venn/venn_mega.json", pretty=TRUE)

# use ggvenn
x_megaex_elig <- list(
  a=c(unique(elig$GRID)),
  b=c(unique(mega$V2))
  )
names(x_megaex_elig) <- c(
  paste0("Eligiblities "," (n=",num_fmt(length(x_megaex_elig$a)),")"),
  paste0("MEGAex"," (n=",num_fmt(length(x_megaex_elig$b)),")")
  )
g_megaex_elig <- ggvenn(
  x_megaex_elig, 
  stroke_size = 0.5, 
  set_name_size = 4)

# g_megaex_elig
venn_file_prev = "files/venn/elig_megaex_v4.png"
ggsave(venn_file_prev, g_megaex_elig)

# 2. test
x_test <- list(
  a = c(1,2,3,4,5,6,12,19,20,21,22,23,24,25,26,27,31),
  b = c(11,13,14,15,16,17,18,32,33,34,40)
)
write_json(x_test,"files/venn/venn_test.json", pretty=TRUE)


# ggvenn
names(x_test) <- c(
  paste0("test1"),
  paste0("test2")
)
g_test <- ggvenn(
  x_test, 
  stroke_size = 0.5, 
  set_name_size = 4)

# g_agd_elig
test_filename = "files/venn/test.png"
ggsave(test_filename, g_test)

# 3. AGD
x_agd <- list(
  a = c(1,2,3,4,5,6,10,12,19,20,21,22,23,24,25,26,27,31),
  b = c(1,2,3,4,5,6,7,8,9,10,11,31,13,14,15,16,17,18),
  c = c(7,8,9,11,12,25,26,27,28,29,30)
)
write_json(x_agd,"files/venn/venn_agd.json", pretty=TRUE)


# ggvenn
names(x_agd) <- c(
  paste0("2024 Q1 125K "," (n=",num_fmt(length(x_agd$a)),")"),
  paste0("2024 Q2 163K "," (n=",num_fmt(length(x_agd$b)),")"),
  paste0("2023 Q3 35K "," (n=",num_fmt(length(x_agd$c)),")")
)
g_agd <- ggvenn(
  x_agd, 
  stroke_size = 0.5, 
  set_name_size = 4)

# g_agd_elig
filename = "files/venn/agd.png"
ggsave(filename, g_agd)

