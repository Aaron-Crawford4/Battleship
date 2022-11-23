
//to do
// team1 team2 interaction (websockets) done (ish)
// start on attack board (highlighting boxes,. moving and selecting boxes)

ABWorld.drawCameraControls = false; // Controls for camera
AB.drawRunControls = false; // Controls for the steps and run

const skycolor = 'lightyellow';           
const boxcolor = '/uploads/aaroncrawford/tile.png' ;
const targetbox = '/uploads/aaroncrawford/target_tile.png';
const  LIGHTCOLOR = 0xffffff ;

const gridsize 		= 8;							// number of squares along side of world	   
const squaresize 	= 400;// size of square in pixels
var positioning1 = [];
var positioning2 = [];
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

var keep = [0, 7]; // Used to keep the attack grid co-ordinates

// Keeping score of both players
var p1score = 0;
var p2score = 0;

// the object is a cube (each dimension equal): 

 AB.newSplash ( splashScreenStartMenu() ); // Shows the menu page

                
	AB.world.newRun = function() {

        
        AB.socketStart();
        initScene();
        AB.runReady = false;

	};
	
	function initScene(){
	    
	    var color = new THREE.Color();
	 	ABWorld.init3d ( startRadius, maxRadius, skycolor );
	 	
	 	var manager = new THREE.LoadingManager();
    	var loader = new THREE.OBJLoader( manager );
    
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat1 );
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat2 );
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat3 );
        loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat4 );
        
        var loader1 = new THREE.TextureLoader();
        
        loader1.load ( boxcolor, function ( boxcolor )  		
    	{
    		boxcolor.minFilter  = THREE.LinearFilter;
    		tile_texture = boxcolor;
    		if ( asynchFinished() )	GridMaker();	
    	});
    	
    	var loader2 = new THREE.TextureLoader();
        
        loader2.load ( targetbox, function ( targetbox )  		
    	{
    		targetbox.minFilter  = THREE.LinearFilter;
    		target_texture = targetbox;
    		if ( asynchFinished() )	TargetMaker(0, 7);	
    	});
	 	
	 	var ambient = new THREE.AmbientLight();
        ABWorld.scene.add(ambient);
	}
	
	AB.world.nextStep = function()		 
    {
        if(AB.socket){
            if(AB.socket.connected){
                AB.socketOut(positioning1, p1score); // Sends players boats positioning & current players score
            }
        }
        
        document.onkeydown = checkKey;

        function checkKey(e) {
            //console.log(keep);
        
            e = e || window.event;
        
            if (e.keyCode == '38') { // will replace the current box with a normal box, & change the next box to the target box. Depending on up, down, right, left
                // up arrow
                if (keep[1] < 7) {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0], keep[1] + 1);
                }
                // console.log('UP!!!')
            }
            else if (e.keyCode == '40') {
                // down arrow
                if (keep[1] > 0) {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0], keep[1] - 1);
                }
                // console.log('DOWN!!!')
            }
            else if (e.keyCode == '37') {
               // left arrow
               if (keep[0] > 0) {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0] - 1, keep[1]);
                }
            //   console.log('LEFT!!!')
            }
            else if (e.keyCode == '39') {
                // right arrow
                if (keep[0] < 7) {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0] + 1, keep[1]);
                }
                // console.log(keep)
                // console.log('Right!!!')
            }
            else if (e.keyCode == '13') {
                // Enter key
                // console.log(positioning2);
                // console.log(keep);
                // console.log('ENTER')
                CheckHit(keep, positioning2);
            }
        
        }
        // console.log(positioning2);
        
        
    };
    
    function CheckHit(keep, pos) {
        // Checks if the current box is a hit on the opponents board
        console.log(keep);
        console.log(pos);
        if (keep[0] == pos[0][0]) { // boat 1 (vertical boat)
            
            if (keep[1] == (pos[0][1] - 1) || keep[1] == (pos[0][1] + 1) || keep[1] == (pos[0][1])) {
                console.log("HIT");
                p1score += 1;
            }
        }
        if (keep[0] == pos[1][0]) { // boat 2 (vertical boat)
            
            if (keep[1] == (pos[1][1] - 1) || keep[1] == (pos[1][1] + 1) || keep[1] == (pos[1][1])) {
                console.log("HIT");
                p1score += 1;
            }
        }
        if (keep[1] == pos[2][1]) { // boat 3 (horizontal boat)
            
            if (keep[0] == (pos[2][0] - 1) || keep[0] == (pos[2][0] + 1) || keep[0] == (pos[2][0])) {
                console.log("HIT");
                p1score += 1;
            }
        }
        if (keep[1] == pos[3][1]) { // boat 3 (horizontal boat)
            
            if (keep[0] == (pos[3][0] - 1) || keep[0] == (pos[3][0] + 1) || keep[0] == (pos[3][0])) {
                console.log("HIT");
                p1score += 1;
            }
        }
    }
    
    function ReplaceTarget(x, y) {
        
        // var i = 0;
        // var j = 7;
        shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
        thecube  = new THREE.Mesh( shape );
        thecube.material = new THREE.MeshBasicMaterial( { map: tile_texture } );
        			
        thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
        ABWorld.scene.add(thecube);
        
    }
    
    
    function TargetMaker(x, y) {
        
        // var i = 0;
        // var j = 7;
        shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
        thecube  = new THREE.Mesh( shape );
        thecube.material = new THREE.MeshBasicMaterial( { map: target_texture } );
        			
        thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
        ABWorld.scene.add(thecube);
        return [x, y];
        
    }
    
    function HitConfirm() {
        
        var i = 0;
        var j = 7;
        shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
        thecube  = new THREE.Mesh( shape );
        thecube.material = new THREE.MeshBasicMaterial( { map: target_texture } );
        			
        thecube.position.copy ( translate2(i,j) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
        ABWorld.scene.add(thecube);
        
    }
	
	function GridMaker()
	{
    	// set up GRID as 2D array
    	// GRID = new Array(gridsize);
    	// now make each element an array 
    	 
    	for ( i = 0; i < gridsize ; i++ ) 
    		GRID1[i] = new Array(gridsize);		 
    
    
    	// set up ground grid
    	 
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
    
    
        // set up attack grid
    	 
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
            //AB.abortRun = true; // just testing cases
            console.log("this worked!");
        });
    }
	
	function buildboat1( object )
    {
    	object.scale.multiplyScalar ( 100 ); // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat1 = object;
    	threeworld.scene.add( boat1);
    	positioning1.push(drawBoat1(boat1));
    }
    
    function buildboat2( object )
    {
    	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat2 = object;
    	threeworld.scene.add( boat2);
    	positioning1.push(drawBoat2(boat2));
    }
    
    function buildboat3( object )
    {
    	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat3 = object;
    	boat3.rotateY(1.6);
    	threeworld.scene.add( boat3);
    	positioning1.push(drawBoat3(boat3));
    }
    
    function buildboat4( object )
    {
    	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
    	object.traverse( paintBoat );
    	boat4 = object;
    	boat4.rotateY(1.6);
    	threeworld.scene.add( boat4);
    	positioning1.push(drawBoat4(boat4));
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
        
        if (b1i == positioning1[0][0]) {
            while (5 - b1j >= positioning1[0][1] - 2 && 5 - b1j <= positioning1[0][1] + 2)
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
        if (b1i >= positioning1[0][0] - 1 && b1i <= positioning1[0][0] + 1 || b1i >= positioning1[1][0] - 1 && b1i <= positioning1[1][0] + 1) {
            while(5 - b1j >= positioning1[0][1] - 1 && 5 - b1j <= positioning1[0][1] + 1 || 5- b1j >= positioning1[1][1] - 1 && 5 - b1j <= positioning1[1][1] + 1) {
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
        if (b1i >= positioning1[0][0] - 1 && b1i <= positioning1[0][0] + 1 || b1i >= positioning1[1][0] - 1 && b1i <= positioning1[1][0] + 1 || b1i >= positioning1[2][0] - 2 && b1i <= positioning1[2][0] + 2) {
            while(5 - b1j >= positioning1[0][1] - 1 && 5 - b1j <= positioning1[0][1] + 1 || 5- b1j >= positioning1[1][1] - 1 && 5 - b1j <= positioning1[1][1] + 1 || 5 - b1j == positioning1[2][1]) {
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
	
// 	AB.world.endRun = function()
// 	{
// 	    AB.newSplash ( splashScreenEndMenu() );
// 	};
	
    function splashScreenStartMenu() 
    {
        var description = "Please select a team as soon as you start, you will get 4 boats which will randomly spawn on your board.<br>";
        // var team1 = "<button onclick='Team1();'  class=ab-largenormbutton > Team 1</button>"; // NOTE: This can be removed if cannot add team buttons/remove the default start button
        // var team2 = "<button onclick='Team2();'  class=ab-largenormbutton > Team 2</button>";
        
        // return ( description + team1 + team2 );
    }
    
    function splashScreenEndMenu()
    {
        var end_message = "The game is over<br>";
        end_message = end_message + "The winner was: ";
        return ( end_message );
    }
    
    AB.splashClick ( function ()        
	{		
        AB.runReady = true;
        AB.removeSplash();			// remove splash screen
	});
	
	AB.socketIn = function (s, score){
	    positioning2 = s;              // Socket functionality (p2 score)
	    p2score = score;
	};
    
    // AB.socketUserlist = function ( array ) {
    //     console.log(array.length);
    // }; 
        
