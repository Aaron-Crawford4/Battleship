//to do
// generate 4 boats - done
// only load boats when user selects team
// work on attack board

ABWorld.drawCameraControls = false; // Controls for camera
AB.drawRunControls = false; // Controls for the steps and run

const skycolor = 'lightyellow';           
const boxcolor = '/uploads/aaroncrawford/tile.png' ;
const  LIGHTCOLOR = 0xffffff ;

const gridsize 		= 8;							// number of squares along side of world	   
const squaresize 	= 400;// size of square in pixels
const positioning = [];
const MAXPOS 		= gridsize * squaresize;		// length of one side in pixels 
ABHandler.GROUNDZERO		= true;
//const objectsize    = 300;                  // size of object   

const startRadius   = 6000;                 // distance from centre we start the camera at

const maxRadius     = startRadius * 500;     // maximum distance from camera we render things 


var GRID1 	= new Array(gridsize); // Horizontal grid (Used for boats)
var GRID2 	= new Array(gridsize); // Vertical grid (Used as the attack board)
var tile_texture;
var b1z, b1x;
//window.boatPositions = [];

// the object is a cube (each dimension equal): 

function World() 
{
    AB.newSplash ( splashScreenStartMenu() ); // Shows the menu page

    var boat1, boat2;
    
    function loadResources()		// asynchronous file loads - call initScene() when all finished 
    {
        var manager = new THREE.LoadingManager();
    	var loader = new THREE.OBJLoader( manager );
    
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat1 );
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat2 );
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat3 );
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat4 );
        console.log(positioning);
        // loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat4 );
        
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
    	object.scale.multiplyScalar ( 100 ); // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat1 = object;
    	threeworld.scene.add( boat1);
    	positioning.push(drawBoat1(boat1));
    }
    
    function buildboat2( object )
    {
    	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat2 = object;
    	threeworld.scene.add( boat2);
    	positioning.push(drawBoat2(boat2));
    }
    
    function buildboat3( object )
    {
    	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat3 = object;
    	boat3.rotateY(1.6);
    	threeworld.scene.add( boat3);
    	positioning.push(drawBoat3(boat3));
    }
    
    function buildboat4( object )
    {
    	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat4 = object;
    	boat4.rotateY(1.6);
    	threeworld.scene.add( boat4);
    	positioning.push(drawBoat4(boat4));
    }
    
    function paintBoat ( child )
    {
    	if ( child instanceof THREE.Mesh )
    	{
          	child.material.map = THREE.ImageUtils.loadTexture( "/uploads/aaroncrawford/wood.jpg" );
    	}
    }
    
    function drawBoat1()		// given e1i, e1j, draw it
    {
     
        b1j = getRandomPositionVerticleZ();
        b1i = getRandomPositionVerticleX();
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
        b1i = getRandomPositionVerticleX();
        b1j = getRandomPositionVerticleZ();
        
        if (b1i == positioning[0][0]) {
            while (5 - b1j >= positioning[0][1] - 2 && 5 - b1j <= positioning[0][1] + 2)
            {
                b1j = getRandomPositionVerticleZ();
            }
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
    
    function drawBoat3()		// given e1i, e1j, draw it
    {
     
        b1j = getRandomPositionHorizontalZ();
        b1i = getRandomPositionHorizontalX();
        if (b1i >= positioning[0][0] - 1 && b1i <= positioning[0][0] + 1 || b1i >= positioning[1][0] - 1 && b1i <= positioning[1][0] + 1) {
            while(5 - b1j >= positioning[0][1] - 1 && 5 - b1j <= positioning[0][1] + 1 || 5- b1j >= positioning[1][1] - 1 && 5 - b1j <= positioning[1][1] + 1) {
                b1j = getRandomPositionHorizontalZ();
            }
        }
        var b3x = translateBoats ( b1i * squaresize );  // left to right
        var b3z = translateBoats ( b1j * squaresize );  // z looking flat away from cam
        var b3y =   ( 1.2 * squaresize );
    
        boat3.position.x = b3x;
        boat3.position.y = b3y;
        boat3.position.z = b3z;
       
        b1j = 5 - b1j;
       
        return [b1i, b1j];
    }
    
    function drawBoat4()		// given e1i, e1j, draw it
    {
     
        b1j = getRandomPositionHorizontalZ();
        b1i = getRandomPositionHorizontalX();
        if (b1i >= positioning[0][0] - 1 && b1i <= positioning[0][0] + 1 || b1i >= positioning[1][0] - 1 && b1i <= positioning[1][0] + 1 || b1i >= positioning[2][0] - 2 && b1i <= positioning[2][0] + 2) {
            while(5 - b1j >= positioning[0][1] - 1 && 5 - b1j <= positioning[0][1] + 1 || 5- b1j >= positioning[1][1] - 1 && 5 - b1j <= positioning[1][1] + 1 || 5 - b1j == positioning[2][1]) {
                b1j = getRandomPositionHorizontalZ();
            }
        }
        var b4x = translateBoats ( b1i * squaresize );  // left to right
        var b4z = translateBoats ( b1j * squaresize );  // z looking flat away from cam
        var b4y =   ( 1.2 * squaresize );
    
        boat4.position.x = b4x;
        boat4.position.y = b4y;
        boat4.position.z = b4z;
       
        b1j = 5 - b1j;
       
        return [b1i, b1j];
    }
    
    function getRandomPositionVerticleZ() {
        min = Math.ceil(-1);
        max = Math.floor(4);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function getRandomPositionVerticleX() {
        min = Math.ceil(0);
        max = Math.floor(7);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function getRandomPositionHorizontalZ() {
        min = Math.ceil(-2
        );
        max = Math.floor(5);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function getRandomPositionHorizontalX() {
        min = Math.ceil(1);
        max = Math.floor(6);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
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
        		{
           			GRID1[i][j] = false;
        		}
       			
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
        		{
           			GRID2[i][j] = false;
        		}
        
       	// AB.runReady = true;
       	
       	AB.msg ( `<hr><p>Multi-user game. Pick a side. Instructions....... Drag the camera.<p>
      	        <button id="Team1" class=ab-largenormbutton > Team 1 </button>  
                <button onclick=Team2() class=ab-largenormbutton > Team 2 </button><p>`);

        
        // Used when clicking Team1 button
        var team1 = document.getElementById("Team1");
        team1.addEventListener("click", function()
        {
            AB.abortRun = true; // just testing cases
            console.log("this worked!");
        });
    }
    
    // AB.newSplash ( splashScreenMenu() );
    
    // Define what the World does at the start of a run: 
    this.newRun = function() 
    {
        // AB.newSplash ( splashScreenMenu() );
        
        AB.runReady = false; 
        // start a 3D scene: 
        threeworld.init3d ( startRadius, maxRadius, skycolor ); 
        
        var ambient = new THREE.AmbientLight();
        threeworld.scene.add( ambient );
    
    	var thelight = new THREE.DirectionalLight ( LIGHTCOLOR, 3 );
    	thelight.position.set ( startRadius, startRadius, startRadius );
    	threeworld.scene.add(thelight);
        
        loadResources();
    };
    
    // Function used to input description of the game
    function splashScreenStartMenu() 
    {
        var description = "Please select a team as soon as you start, you will get 4 boats which will randomly spawn on your board.<br>";
        // var team1 = "<button onclick='Team1();'  class=ab-largenormbutton > Team 1</button>"; NOTE: This can be removed if cannot add team buttons/remove the default start button
        // var team2 = "<button onclick='Team2();'  class=ab-largenormbutton > Team 2</button>";
        return ( description );
    }
    
    this.endRun = function()
    {
        AB.newSplash ( splashScreenEndMenu() );
    };
    
    function splashScreenEndMenu()
    {
        var end_message = "The game is over<br>";
        end_message = end_message + "The winner was: ";
        return ( end_message );
    }
    
    AB.splashClick ( function() 
    {
        AB.runReady = true;
        AB.removeSplash();
    });
}
