// const { parse } = require("csv-parse");
const fs = require("fs");
const readline = require("readline");

const series_data_es3 = [
  {code: '37203', value: 9},{code: '77777', value: 57},{code: '37087', value: 2},{code: '37027', value: 2},{code: '37208', value: 51},
  {code: '37210', value: 2},{code: '37204', value: 2},{code: '37206', value: 6},{code: '37212', value: 11},{code: '37215', value: 8},
  {code: '37218', value: 19},{code: '37115', value: 2},{code: '37064', value: 3},{code: '37209', value: 12},{code: '37207', value: 19},
  {code: '37228', value: 1},{code: '37219', value: 2},{code: '37388', value: 1},{code: '37864', value: 1},{code: '37334', value: 1},
  {code: '37129', value: 1},{code: '38116', value: 2},{code: '37086', value: 1},{code: '37214', value: 3},
  {code: '37216', value: 11},{code: '37402', value: 1},{code: '37213', value: 1},{code: '37122', value: 1},{code: '37069', value: 1},
  {code: '37912', value: 1},{code: '37076', value: 2},{code: '37013', value: 2},{code: '38320', value: 1},{code: '37130', value: 1},
  {code: '37066', value: 1},{code: '37211', value: 3},{code: '37217', value: 1}
]

const path = "es3/csvs/tn_zip_county_fips_sep.csv";
// Create a read stream
const readStream = fs.createReadStream(path);

// Create a readline interface
const readInterface = readline.createInterface({
  input: readStream
});

// Initialize an array to store the parsed data
const output = [];

// Event handler for reading lines
readInterface.on("line", (line) => {
  const row = line.split(",");
  output.push(row);
});

// Event handler for the end of file
readInterface.on("close", () => {
  console.log(output);
});

// Event handler for handling errors
readInterface.on("error", (err) => {
  console.error("Error reading the CSV file:", err);
});