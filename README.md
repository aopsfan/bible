### Setup

Clone the project, install dependencies, and convert old data:

    git clone https://github.com/aopsfan/bible.git
    npm install
    cd bible/convert
    ./convertKJV.sh
    cd ..

Now, run the app:

    node app.js

In the CLI, you can lookup passages with syntax like `read John.1:1`, `read John.3:16-20`, or `read Psalms.1:1-3:8`.
