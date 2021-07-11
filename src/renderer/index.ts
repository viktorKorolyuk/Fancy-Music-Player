'use strict';
import './css/style.css'
import * as htmlContent from './index.html'
import './FileDrag'
import './Overlay'
import './AudioPlayer'
import { $ } from './Helper';
import { dragover_handler, drop_handler } from './FileDrag';
import { setup_player } from './AudioPlayer';

let app = document.getElementById("app") as HTMLElement
app.innerHTML = htmlContent.default

let playlist = $("#playlist") as HTMLElement
playlist.addEventListener("dragover", (ev) => dragover_handler(ev))
playlist.addEventListener("drop", async (ev) => await drop_handler(ev))

setup_player()
// Problem: AudioPlayer requests playlist before it is ready