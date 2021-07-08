'use strict';
import './css/style.css'
import * as htmlContent from './index.html'
import './FileDrag'
import './Overlay'
import './AudioPlayer'
import { $ } from './Helper';
import { dragover_handler, drop_handler } from './FileDrag';

document.getElementById("app").innerHTML = htmlContent

let playlist = $("#playlist")
playlist.addEventListener("dragover", (ev) => dragover_handler(ev))
playlist.addEventListener("drop", (ev) => drop_handler(ev))