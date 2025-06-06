import { Index } from "flexsearch";

// create a simple index which can store id-content-pairs
const index = new Index({
    // use forward when you want to match partials
    // e.g. match "flexsearch" when query "flex"
    tokenize: "forward"
});

// some test data
const data = [
    'cats abcd efgh ijkl mnop qrst uvwx cute',
    'cats abcd efgh ijkl mnop qrst cute',
    'cats abcd efgh ijkl mnop cute',
    'cats abcd efgh ijkl cute',
    'cats abcd efgh cute',
    'cats abcd cute',
    'cats cute'
];

// add data to the index
data.forEach((item, id) => {
    index.add(id, item);
});

// perform query
const result = index.search("cute cat");

// display results
result.forEach(i => {
    console.log(data[i]);
});
