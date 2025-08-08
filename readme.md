# My Nodejs Code
### At the moment I only have one small node js code.
```
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const PORT = 8000;

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];

```

### This basic code make my basic modules and this function
```

const toBool = [() => true, () => false];
```
### say that I have static folder and make little list of bool
### my idee is this than in my code I can check true or false in this Promise