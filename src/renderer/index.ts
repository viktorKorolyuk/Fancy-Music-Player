'use strict';
import './AudioPlayer';
import { setup_player } from './AudioPlayer';
import './css/style.css';
import './FileDrag';
import { dragover_handler, drop_handler } from './FileDrag';
import { $ } from './Helper';
import * as htmlContent from './index.html';
import './Overlay';
import fwdSVG from './svg/fwd.svg';
import playSVG from './svg/play.svg';
import prevSVG from './svg/prev.svg';


let app = document.getElementById("app") as HTMLElement;
app.innerHTML = htmlContent.default;

app.addEventListener("dragover", (ev) => dragover_handler(ev));
app.addEventListener("drop", async (ev) => await drop_handler(ev));

($("#prev-btn") as HTMLElement).innerHTML = `<img src="${prevSVG}" />`;
($("#play-btn") as HTMLElement).innerHTML = `<img src="${playSVG}" />`;
($("#next-btn") as HTMLElement).innerHTML = `<img src="${fwdSVG}" />`;
setup_player();