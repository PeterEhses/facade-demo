class dropBoi {
  constructor( parent, target, uploader) {
    this.target = document.getElementById(target);
    this.reader = new FileReader();
    this.dropArea = document.getElementById( parent );

    [ 'dragenter', 'dragover', 'dragleave', 'drop' ].forEach( eventName => {
      this.dropArea.addEventListener( eventName, this.preventDefaults, false )
    }, this );
    [ 'dragenter', 'dragover' ].forEach( eventName => {
      this.dropArea.addEventListener( eventName, this.highlight, false )
    }, this );
    [ 'dragleave', 'drop' ].forEach( eventName => {
      this.dropArea.addEventListener( eventName, this.unhighlight, false )
    }, this );
    this.dropArea.addEventListener( 'drop', function (e){this.handleDrop(e)}.bind(this), false )
    if(uploader){
      this.uploader = document.getElementById( uploader );
      this.uploader.onchange = function (e){this.handleUpload(e)}.bind(this)
    }
  }
  highlight( e ) {
    this.classList.add( 'highlight' )


  }
  unhighlight( e ) {
    this.classList.remove( 'highlight' )
  }
  handleUpload(e){
    let file = e.target.files[0];
    this.handleFile( file );
  }

  handleDrop( e ) {
    let dt = e.dataTransfer;

    let file = dt.files[0];
    this.handleFile( file );
  }

  handleFile(file){
    this.reader.readAsDataURL(file)
    this.reader.onload = function(){
      this.target.style["background-image"] = "url('"+this.reader.result+"')";
      // let img = document.createElement("img");
      // img.src = this.reader.result;
      // this.dropArea.appendChild(img);
    }.bind(this)
  }

  preventDefaults( e ) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy';
  }
}

const dropBG = new dropBoi( "bgForm", "p5container", "bgFileElem")

const dropOL = new dropBoi( "olForm", "p5overlay", "olFileElem")

const dropVID = new dropBoi( "viForm", "", "viFileElem")
dropVID.handleFile = function(file){
  let filereader = new FileReader();
  filereader.readAsDataURL(file);
  filereader.onload = function(){
    myp5.vidLoad(filereader.result);
  }
}
