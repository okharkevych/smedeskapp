/* jshint esversion: 6 */
/* jshint strict: false */

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

require('dotenv-flow').config();

const configString = `$(document).ready((function ($) {
    'use strict';

    window.config = {
        'api': '${process.env.API_ROOT}',
        'preloaderDuration': ${process.env.PRELOADER_DURATION}
    };

})(jQuery));
`;

fs.writeFile(
    'app/config.js',
    configString,
    function (err) {
    }
);

const {staticAssets, serveFile} = require('./assets');

staticAssets(app);

app.get('*', serveFile(__dirname + '/app/app.html'));

app.listen(port, () => {
    console.log(`App started on port http://127.0.0.1:${port}`);
});