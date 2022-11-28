/* jshint esversion: 6 */
/* jshint strict: false */

const express = require('express');
const fs = require('fs');

module.exports = {
    staticAssets(app) {
        app.use(express.static(__dirname + '/../assets/'));
        app.use(express.static(__dirname + '/../node_modules/navigo/lib/'));
        app.use(express.static(__dirname + '/app/'));
    },
    serveFile(filepath) {
        return (req, res) => {
            const content = fs.readFileSync(filepath).toString('utf-8');
            res.header('Content-Type', 'text/html');
            res.send(content);
        };
    },
};