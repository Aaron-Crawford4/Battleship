//to do
// generate 4 boats
// only load boats when user selects team
// work on attack board

ABWorld.drawCameraControls = false;
const skycolor          = 'lightyellow';           
const boxcolor          = '/uploads/aaroncrawford/tile.png' ;

const gridsize 		= 8;							// number of squares along side of world	   
const squaresize 	= 400;// size of square in pixels
const positioning = [];
const MAXPOS 		= gridsize * squaresize;		// length of one side in pixels 
ABHandler.GROUNDZERO		= true;
//const objectsize    = 300;                  // size of object   

const startRadius   = 4500;                 // distance from centre we start the camera at

const maxRadius     = startRadius * 500;     // maximum distance from camera we render things 


var GRID1 	= new Array(gridsize);
var GRID2 	= new Array(gridsize);
var tile_texture;
var b1z, b1x;
//window.boatPositions = [];

// the object is a cube (each dimension equal): 

function loadResources()		// asynchronous file loads - call initScene() when all finished 
{
    var manager = new THREE.LoadingManager();
	var loader = new THREE.OBJLoader( manager );

    loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat1 );
    loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat2 );
    
    //console.log(positioning);
    
    var loader1 = new THREE.TextureLoader();
    
    loader1.load ( boxcolor, function ( thetexture )  		
	{
		thetexture.minFilter  = THREE.LinearFilter;
		tile_texture = thetexture;
		if ( asynchFinished() )	initScene();		// if all file loads have returned 
	});
}

function buildboat1( object )
{
	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
	//object.traverse( paintEnemy );
	boat1 = object;
	threeworld.scene.add( boat1);
	positioning.push(drawBoat1(boat1));
	//console.log(positioning);
}

function buildboat2( object )
{
	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
	//object.traverse( paintEnemy );
	boat2 = object;
	threeworld.scene.add( boat2);
	positioning.push(drawBoat2(boat2));
	//console.log(positioning);
}

/*function paintEnemy ( child )
{
	if ( child instanceof THREE.Mesh )
	{
      	child.material.map = THREE.ImageUtils.loadTexture( "/uploads/geoghen4/wool.jppg" );
	}
}*/

function drawBoat1()		// given e1i, e1j, draw it
{
 
    b1j = getRandomPositionZ();
    b1i = getRandomPositionX();
    var b1x = translateBoats ( b1i * squaresize );  // left to right
    var b1z = translateBoats ( b1j * squaresize );  // z looking flat away from cam
    var b1y =   ( 1.2 * squaresize );

    boat1.position.x = b1x;
    boat1.position.y = b1y;
    boat1.position.z = b1z;
   
    b1j = 5 - b1j;
   
    return [b1i, b1j];
}
  
function drawBoat2()		// given e1i, e1j, draw it
{
    b1i = getRandomPositionX();
    //console.log(positioning);
    while (b1i == positioning[0][0])
    {
        b1i = getRandomPositionX();
    }
    
    b1j = getRandomPositionZ();
    while (b1j > positioning[0][1] - 1 && b1j < positioning[0][1])
    {
        b1j = getRandomPositionZ();
    }
    var b2x = translateBoats ( b1i * squaresize );  // left to right
    var b2z = translateBoats ( b1j * squaresize );  // z looking flat away from cam
    var b2y =   ( 1.2 * squaresize );

    boat2.position.x = b2x;
    boat2.position.y = b2y;
    boat2.position.z = b2z;
   
    b1j = 5 - b1j;
   
    return [b1i, b1j];
}

function getRandomPositionZ() {
  min = Math.ceil(-1);
  max = Math.floor(4);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomPositionX() {
  min = Math.ceil(-0);
  max = Math.floor(7);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//console.log(getRandomPosition())

function asynchFinished()		 
{
	if ( tile_texture )   return true; 
	else return false;
}	

function translate1 ( i, j )			
{
	var v = new THREE.Vector3();
	j -= 2;
	v.y = 0;	
	v.x = ( i * squaresize ) - ( MAXPOS/2 );   		 
	v.z = ( j * squaresize ) - ( MAXPOS/2 );   	
	
	return v;
}

function translate2 ( i, j )			
{
	var v = new THREE.Vector3();
	v.y = ( j * squaresize ) - ( MAXPOS/2 ) + 2000;	
	v.x = ( i * squaresize ) - ( MAXPOS/2 );   		 
	v.z = -4000;  	
	
	return v;
}

function translateBoats ( x )			
{
	return ( x - (MAXPOS/2));
}

function initScene()		// all file loads have returned 
{
	 
	// set up GRID as 2D array
	// GRID = new Array(gridsize);
	// now make each element an array 
	 
	 for ( i = 0; i < gridsize ; i++ ) 
		GRID1[i] = new Array(gridsize);		 


	// set up walls
	 
	 for ( i = 0; i < gridsize ; i++ ) 
	  for ( j = 0; j < gridsize ; j++ ) 
		if ( ( i<=gridsize-1 ) || ( j<=gridsize-1 ) )
		{
			GRID1[i][j] = true;		 
			shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
			thecube  = new THREE.Mesh( shape );
			thecube.material = new THREE.MeshBasicMaterial( { map: tile_texture } );
			
			thecube.position.copy ( translate1(i,j) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
			ABWorld.scene.add(thecube);
		}
		else 
   			GRID1[i][j] = false;
   			
//------------------------------------------------------------------------------------
   			
   	 for ( i = 0; i < gridsize ; i++ ) 
		GRID2[i] = new Array(gridsize);		 


	// set up walls
	 
	 for ( i = 0; i < gridsize ; i++ ) 
	  for ( j = 0; j < gridsize ; j++ ) 
		if ( ( i<=gridsize-1 ) || ( j<=gridsize-1 ) )
		{
			GRID2[i][j] = true;		 
			shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
			thecube  = new THREE.Mesh( shape );
			thecube.material = new THREE.MeshBasicMaterial( { map: tile_texture } );
			
			thecube.position.copy ( translate2(i,j) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
			ABWorld.scene.add(thecube);
		}
		else 
   			GRID2[i][j] = false;
   	AB.runReady = true; 
   	
   	AB.msg ( ` <hr> <p> Multi-user game. Pick a side. Instructions....... Drag the camera. <p>
  	        <button onclick='Team1();'  class=ab-largenormbutton > Team 1 </button>  
            <button onclick='Team2();'  class=ab-largenormbutton > Team 2 </button> <p> ` );	
}

// Define what the World does at the start of a run: 

AB.world.newRun = function() 
{
    AB.runReady = false; 
    // start a 3D scene: 
    ABWorld.init3d ( startRadius, maxRadius, skycolor ); 

    // add the object to the scene:
    //ABWorld.scene.add ( theobject );
    loadResources();
};
	
	/*AB.world.newRun = function()
	{
		// Code for Three.js initial drawing of objects.
		// Should include one of:
	 	// ABWorld.init2d ( arguments ); 	
	 	// ABWorld.init3d ( arguments ); 	
	};


	AB.world.nextStep = function()		 
	{
		// Code for Three.js re-drawing of objects.  		
	};


	AB.world.endRun = function()
	{
	};*/

