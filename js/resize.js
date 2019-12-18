var win = document.getElementById("right");
var lay = document.getElementById("p5container");
var menu = document.getElementById("left");
var baseSize = {
    w: 1066,
    h: 800
}
var newScale = 1;
function updateScale() {
    boundWin = win.getBoundingClientRect();
    var ww = window.innerWidth-210;
    console.log(boundWin);
    var wh = boundWin.height;


    // compare ratios
    if(ww/wh < baseSize.w/baseSize.h) { // tall ratio
        newScale = ww / baseSize.w;
    } else { // wide ratio
        newScale = wh / baseSize.h;
    }

    lay.style["transform"]='scale(' + newScale + ',' +  newScale + ')';
    win.style["width"]=1066*newScale+"px";
    menu.style["width"]=window.innerWidth-(1066*newScale)+"px";
    keystoner.scale = newScale;
}
