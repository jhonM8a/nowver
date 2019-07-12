# nowver DB

## Usage

```js
const setupDatabase = require("nowver-db");

setupDatabase(config)
  .then(db => {
    const { Agent, Metric } = db;
  })
  .catch(err => console.error(err));
```
