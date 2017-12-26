
import {CubeShow} from './app/cube-show';

window.onload = () => {
    var showElement = document.getElementById("app-content");
    var show = new CubeShow(showElement);
    show.start();
}