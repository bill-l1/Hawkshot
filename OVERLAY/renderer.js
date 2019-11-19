// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const {app, BrowserWindow, screen} = require('electron')
const path = require('path')
var axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');	
const request = require('request');	
const { ipcRenderer } = require('electron');


ipcRenderer.on('action-update-label', (event, arg) => {

                // Update the second window label content with the data sent from
                // the first window :) !
                let currcard = document.getElementById("currcard");

                currcard.innerHTML = arg.message;
                
            });