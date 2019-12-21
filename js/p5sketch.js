var keystoner;
const s = ( sketch ) => {
  let xRange = document.getElementById("xRange");
  let yRange = document.getElementById("yRange");
  let xOffset = document.getElementById("xOffset");
  let yOffset = document.getElementById("yOffset");
  let video;
  let vidSize;
  let multx;
  let multy;
  let vid = "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6c/Polar_orbit.ogv/Polar_orbit.ogv.360p.vp9.webm";
  xRange.oninput = function(){
    sketch.setMatrix(xRange.value, yRange.value, xOffset.value, yOffset.value);
    sketch.vidLoad(vid);
  }
  yRange.oninput = function(){
    sketch.setMatrix(xRange.value, yRange.value, xOffset.value, yOffset.value);
    sketch.vidLoad(vid);
  }
  xOffset.oninput = function(){
    sketch.setMatrix(xRange.value, yRange.value, xOffset.value, yOffset.value);
  }
  yOffset.oninput = function(){
    sketch.setMatrix(xRange.value, yRange.value, xOffset.value, yOffset.value);
    //console.log(xOffset.value, yOffset.value);
  }
  let parent = document.getElementById('p5container');
  let position = parent.getBoundingClientRect();
  //console.log(position)
  let x = 100;
  let y = 100;
  let cnv;
  let mat_x = 50;
  let mat_y = 50;
  let mat_gap_x = 10;
  let mat_gap_y = 10;
  let cellwidth = 5;
  let cellheight = 5;
  let noiseScale = 4;

  sketch.setup = () => {
    cnv = sketch.createCanvas(parent.offsetWidth, parent.offsetHeight);
    cnv.id("p5Canvas");
    sketch.setMatrix(xRange.value, yRange.value, xOffset.value, yOffset.value);
    //sketch.colorMode(sketch.HSB, 360, 255, 255);
    keystoner = new Keystoner("p5Canvas");
    //sketch.vidLoad('./vid/file_example_MOV_480_700kB.mov');
    //sketch.vidLoad("./vid/big-buck-bunny_trailer.webm");
    sketch.vidLoad(vid);
    updateScale();
    window.onresize = updateScale;
    document.getElementById("checkKeystone").onchange = function(){keystoner.toggleShow()}
    document.getElementById("muteVideo").onchange = function(){sketch.toggleVidMute()}
  };

  sketch.draw = () => {
    sketch.clear();
    if(!keystoner.isShown){
      sketch.drawMatrix();
    } else {
      sketch.fill(180,100,255,0.2);
      sketch.stroke(300,100,255);
      sketch.strokeWeight(5);
      sketch.rect(0,0,sketch.width,sketch.height);
      sketch.strokeWeight(2);
      sketch.line(0,sketch.height/3,sketch.width,sketch.height/3);
      sketch.line(0,sketch.height/3*2,sketch.width,sketch.height/3*2);
      sketch.line(sketch.width/3, 0, sketch.width/3, sketch.height);
      sketch.line(sketch.width/3*2, 0, sketch.width/3*2, sketch.height);

    }

  };

  sketch.vidLoad = (vid) => {
    if(video){
      video.remove();
    }

    video = sketch.createVideo([vid]);
    video.loop();
    if(document.getElementById("muteVideo").checked){
      video.volume(0);
    }


    vidSize = video.size();
    video.size(mat_x,mat_y);
    video.loadPixels();
    //video.hide();
  }
  sketch.toggleVidMute = () => {
    if(video.volume()==0){
      video.volume(1);
    } else {
      video.volume(0);
    }

  }

  sketch.drawMatrix = () => {
    sketch.noStroke();
    video.loadPixels();
    for(let i = 0; i < mat_x; i++){
      for(let j = 0; j < mat_y; j++){
        //let millisval = sketch.millis();
        //let noiseval = sketch.noise(i/noiseScale,j/noiseScale, millisval/10000)
        //sketch.fill((200+millisval/30+noiseval*100)%360,155,noiseval*255,1);
        mult_x = 1;
        mult_y = mat_x;

        let r = video.pixels[((i*mult_x)+(j*mult_y))*4];
        let g = video.pixels[((i*mult_x)+(j*mult_y))*4+1];
        let b = video.pixels[((i*mult_x)+(j*mult_y))*4+2];

        sketch.fill(r,g,b,125);

        sketch.push();

        sketch.translate(i*cellwidth,j*cellheight);
        sketch.rect(0,0,cellwidth-mat_gap_x,cellheight-mat_gap_y);
        //sketch.text(i,0,cellheight/2);

        sketch.pop();
      }
    }
  }
  sketch.setMatrix = (x,y,gx,gy) => {
    mat_x = x;
    mat_y = y;
    //console.log(gx,gy);
    mat_gap_x = sketch.map(gx,0,50,0,sketch.width/mat_x);
    mat_gap_y = sketch.map(gy,0,50,0,sketch.height/mat_y);
    cellwidth = (sketch.width+mat_gap_x)/mat_x;
    cellheight = (sketch.height+mat_gap_y)/mat_y;
  }
};

let myp5 = new p5(s, "p5container");
