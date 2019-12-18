class Keystoner {
  constructor( bound ) {
    var self = this;
    this.mouse_moving = false;
    this.cornerAction = false;
    this.is_clicked = false;
    this.isShown = true;
    this.scale = 1;
    this.bound = document.getElementById( bound );
    this.container = this.bound.parentElement;
    this.position = this.container.getBoundingClientRect();

    this.cornersize = 10;
    this.corners = [];
    this.defaultCorners = [];
    this.cornersDOM = [];
    this.canvasPos = {
      x: 0,
      y: 0
    };
    this.corners.push( {
      x: this.canvasPos.x,
      y: this.canvasPos.y
    } );
    this.corners.push( {
      x: this.canvasPos.x + this.bound.width,
      y: this.canvasPos.y
    } );

    this.corners.push( {
      x: this.canvasPos.x,
      y: this.canvasPos.y + this.bound.height
    } );
    this.corners.push( {
      x: this.canvasPos.x + this.bound.width,
      y: this.canvasPos.y + this.bound.height
    } );


    for ( let c = 0; c < this.corners.length; c++ ) {
      this.defaultCorners[ c ] = {
        x: 0 + this.corners[ c ].x,
        y: 0 + this.corners[ c ].y
      }
      this.cornersDOM[ c ] = document.createElement( "div" );
      this.cornersDOM[ c ].setAttribute( "id", "corner" + c );
      this.cornersDOM[ c ].setAttribute( "class", "corner" );
      this.cornersDOM[ c ].style[ "left" ] = this.corners[ c ].x + "px";
      this.cornersDOM[ c ].style[ "top" ] = this.corners[ c ].y + "px";
      this.container.appendChild( this.cornersDOM[ c ] );
    }

    this.container.addEventListener( "mousedown", function ( e ) {
      this.mouseManager( e )
    }.bind( this ) );
    this.container.addEventListener( "mousemove", function ( e ) {
      this.mouseMoving( e )
    }.bind( this ) );
    this.container.ondragstart = function() {
  return false;
};
  this.hide();
  }

  overCorner(x,y) {
    var corner = false;
    //console.log(this.corners[ 0 ].x, x, this.corners[ 0 ].y, y);
    for ( let i = 0; i < this.corners.length; i++ ) {
      if (
        x > this.corners[ i ].x - this.cornersize &&
        x < this.corners[ i ].x + this.cornersize &&
        y > this.corners[ i ].y - this.cornersize &&
        y < this.corners[ i ].y + this.cornersize
      ) {
        corner = i;
      }
    }
    return corner;

  }

  mouseManager( event ) {
    this.position = this.container.getBoundingClientRect();
    this.is_clicked = true;
    let x = event.pageX - this.position.left;
    x = x / this.scale;
    let y = event.pageY - this.position.top;
    y = y / this.scale;
    this.cornerAction = this.overCorner(x,y);
    this.mouse_moving = false;
    this.container.addEventListener( "mouseup", function _listener( ev ) {


      if ( this.mouse_moving ) {
        this.mouseDragged( ev );
      }
      this.container.removeEventListener( "mouseup", _listener );
      this.is_clicked = false;
      this.mouse_moving = false;
    }.bind( this ) )
  }

  mouseMoving( event ) {
    this.mouse_moving = true;
    if(this.is_clicked && this.isShown){


      let x = event.pageX - this.position.left;
      x = x / this.scale;
      let y = event.pageY - this.position.top;
      y = y / this.scale;
      if ( this.cornerAction !== false ) {
        this.corners[ this.cornerAction ].x = x;
        this.corners[ this.cornerAction ].y = y;
        this.cornersDOM[ this.cornerAction ].style[ "left" ] = x + "px";
        this.cornersDOM[ this.cornerAction ].style[ "top" ] = y + "px";
      }
    }
  }

  mouseDragged( event ) {
    if ( this.cornerAction !== false && this.isShown) {
      var mat = this.getTransform( this.defaultCorners, this.corners );
      console.log(this.defaultCorners);
      //console.log(mat);
      var matStr = "";
      var first = true;
      for ( let i = 0; i < 4; i++ ) {
        for ( let j = 0; j < 4; j++ ) {
          if ( first ) {
            matStr = matStr + mat[ j ][ i ];
            first = false;
          }
          else {
            matStr = matStr + ", " + mat[ j ][ i ];
          }

        }
      }
      this.bound.style['transform'] = 'matrix3d(' + matStr + ')';
      //console.log('matrix3d(' + matStr + ')');
      this.cornerAction = false;
    }
  }

  getTransform( from, to ) { // Accepts two arrays of four
    let i;
    console.assert( from.length === to.length && to.length === 4 );

    const A = []; // 8x8
    for ( i = 0; i < 4; i++ ) {
      A.push( [ from[ i ].x, from[ i ].y, 1, 0, 0, 0, -from[ i ].x * to[ i ].x, -from[ i ].y * to[ i ].x ] );
      A.push( [ 0, 0, 0, from[ i ].x, from[ i ].y, 1, -from[ i ].x * to[ i ].y, -from[ i ].y * to[ i ].y ] );
    }

    const b = []; // 8x1
    for ( i = 0; i < 4; i++ ) {
      b.push( to[ i ].x );
      b.push( to[ i ].y );
    }

    // Solve A * h = b for h
    const h = numeric.solve( A, b );

    const H = [   [ h[ 0 ],   h[ 1 ],   0,    h[ 2 ]  ],
              [   h[ 3 ],     h[ 4 ],   0,    h[ 5 ]  ],
              [   0,          0,        1,    0       ],
              [   h[ 6 ],     h[ 7 ],   0,    1 ]     ];

    // Sanity check that H actually maps `from` to `to`
    for ( i = 0; i < 4; i++ ) {
      const lhs = numeric.dot( H, [ from[ i ].x, from[ i ].y, 0, 1 ] );
      const k_i = lhs[ 3 ];
      const rhs = numeric.dot( k_i, [ to[ i ].x, to[ i ].y, 0, 1 ] );
      console.assert( numeric.norm2( numeric.sub( lhs, rhs ) ) < 1e-9, "Not equal:", lhs, rhs );
    }
    return H;
  };
  show(){
    this.isShown = true;
    for ( let c = 0; c < this.corners.length; c++ ) {
      this.cornersDOM[c].style["display"] = "block";
    }
  }
  toggleShow(){
    if(this.isShown){
      this.hide();
    } else {
      this.show();
    }
  }
  hide(){
    this.isShown = false;
    for ( let c = 0; c < this.corners.length; c++ ) {
      this.cornersDOM[c].style["display"] = "none";
    }
  }
}


function randompoint_noFrame( low, high ) {
  var min = low + 1;
  var max = high - 1;
  var random = Math.floor( Math.random() * ( +max - +min ) ) + +min;
  return random;
}
