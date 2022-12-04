// to do
// maybe make boards look nicer (water box, transparent, etc?)
// maybe fix end screen
// clean code & rename variables
// zoom in?
// maybe change colour of end screen winner (green) loser (red) ?

// Notes: When loaded, the FIRST player selecting a team HAS TO SELECT team 1 (team 1 will have to be the first team selected for any player)
// If nobody has selected a team yet, the first selected team must be team1 (from either player), then team2 can be selected (if this does not occur it will cause issues with starting the game)

// Background music
const MUSICFILE     = '/uploads/aaroncrawford/Sea_Shanty.mp3';
MUSICFILE.volume    = 0.2; // Changing volume of music
AB.backgroundMusic( MUSICFILE ); // Adding background music to world

// Hit and miss sound effects used when using the attack board
const MissSounds    = "/uploads/aaroncrawford/MissSound.mp3";
var MissSound       = new Audio(MissSounds);

const HitSounds = "/uploads/aaroncrawford/HitSound.mp3";
var HitSound    = new Audio(HitSounds);

// Default camera controls
ABWorld.drawCameraControls  = false; // Controls for camera
AB.drawRunControls          = false; // Controls for the steps and run

// Time in game (how many runs in the game)
AB.maxSteps     = 10000;
AB.clockTick    = 100;

// Textures and tiles
const skycolor      = 'lightyellow'; // CAN REMOVE?        
// const boxcolor = '/uploads/hazekat2/water.jpg' ;
// const boxcolor = '/uploads/hazekat2/capy2.jpg' ;
const boxcolor      = '/uploads/aaroncrawford/tile.png'; // Default board tile colour/pattern
// const newboxcolor = '/uploads/thomashazekamp/transparent.jpg';
const targetbox     = '/uploads/aaroncrawford/target_tile.png'; // Target tile
const skullbox      = '/uploads/aaroncrawford/tile2.png'; // Tile used to show affermative hit /MAYBE CHANGE VARIABLE NAME?
const missbox       = '/uploads/aaroncrawford/tile3.png'; // Tile used to show missed hit
const  LIGHTCOLOR   = 0xffffff ; // MIGHT BE ABLE TO REMOVE?
const SKYCOLOR 	    = 0x009933;	// MIGHT BE ABLE TO REMOVE?
const red           = SKYCOLOR; // MIGHT BE ABLE TO REMOVE

const gridsize 		= 8; // Number of squares per grid side	   
const squaresize 	= 400; // Size of square in pixels
var positioning1    = []; // Players board
var positioning2    = []; // Attack board
const MAXPOS 		= gridsize * squaresize; // Length of one side in pixels 
const skyboxConst			= MAXPOS * 3 ;
ABHandler.GROUNDZERO		= true;
const maxRadiusConst 		= MAXPOS * 10  ;

const startRadiusConst	 	= MAXPOS * 0.8 ;	
const startRadius           = 5500; // Distance from centre we start the camera at

const maxRadius     = startRadius * 500; // Maximum distance from camera we render things 


var GRID1 	= new Array(gridsize); // Horizontal grid (Used for boats)
var GRID2 	= new Array(gridsize); // Vertical grid (Used as the attack board)

var tile_texture; // Default tile texture
var b1z, b1x;

var keep = [0, 7]; // Used to keep the attack grid co-ordinates

// Keeping score of both players
var p1score = 0;
var p2score = 0;

var alreadyHit      = []; // Co-ordiantes of already hit enemy boats 
var alreadyMissed   = []; // Co-ordinates of already missed attack board positions
var myturn; // Know if p1 or p2 turn


// the object is a cube (each dimension equal): 

AB.newSplash ( splashScreenStartMenu() ); // Shows the menu page, first thing that loads into the world
 
function initSkybox() 
{

// x,y,z positive and negative faces have to be in certain order in the array 
 
// mountain skybox, credit:
// http://stemkoski.github.io/Three.js/Skybox.html

 // var materialArray = [
 	//( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/adrian/trees.jpg" ), side: THREE.BackSide } ) ),
 	//( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture("/uploads/adrian/trees.jpg" ), side: THREE.BackSide } ) ),
 	//( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/adrian/sky.jpeg" ), side: THREE.BackSide } ) ),
 	//( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/adrian/grass.jpg" ), side: THREE.BackSide } ) ),
 	//( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/adrian/trees.jpg" ), side: THREE.BackSide } ) ),
 	//( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/adrian/trees.jpg" ), side: THREE.BackSide } ) ),
 //	];
  // 
    var materialArray = [
        ( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0001.bmp" ), side: THREE.BackSide } ) ),
        ( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0004.bmp" ), side: THREE.BackSide } ) ),
        ( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0003.bmp" ), side: THREE.BackSide } ) ),
        ( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0006.bmp" ), side: THREE.BackSide } ) ),
        ( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0005.bmp" ), side: THREE.BackSide } ) ),
        ( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture("/uploads/seanhutchinson/skyrender0002.bmp"), side: THREE.BackSide } ) ),
    ];
  
    // Used for the background cube
    var skyGeometry = new THREE.BoxGeometry ( skyboxConst, skyboxConst, skyboxConst );	
    var skyMaterial = new THREE.MeshFaceMaterial ( materialArray );
    var theskybox = new THREE.Mesh ( skyGeometry, skyMaterial );
    threeworld.scene.add( theskybox ); // Adding the cube (so we are in the cube)
}

// New run of the world            
AB.world.newRun = function() {

    
    AB.socketStart(); // Starts web sockets

    BOXHEIGHT = squaresize;
    threeworld.init3d ( startRadiusConst, maxRadiusConst, SKYCOLOR  );
    var thelight = new THREE.DirectionalLight ( LIGHTCOLOR, 3 );
  	threeworld.scene.add(thelight);
 
    
    initSkybox(); // Calls function to add cube around us
    initScene(); // Calls function to add scene
    AB.runReady = false;
    


};
	
function initScene()
{
    
    var color = new THREE.Color();
 	ABWorld.init3d ( startRadius, maxRadius, skycolor );
 	
 	var manager = new THREE.LoadingManager();
	var loader = new THREE.OBJLoader( manager );
	
    // Build boats
    loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat1 );
    loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat2 );
    loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat3 );
    loader.load( "/uploads/aaroncrawford/fishing-boat.obj", buildboat4 );
    
    
    // Load default boxes
    var loader1 = new THREE.TextureLoader();
    
    loader1.load ( boxcolor, function ( boxcolor )  		
	{
		boxcolor.minFilter  = THREE.LinearFilter;
		tile_texture = boxcolor;
		if ( asynchFinished() )	GridMaker();	
	});
	
	
	// Load target boxes
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
    // Text displaying whos turn it is
    if(myturn)
    {
        whosTurn = '<span style="color:green"> It is your turn!</span>';
    }
    else
    {
        whosTurn = '<span style="color:red">It is the other players turn!</span>';
    }
    
    // Text showing in controls window
    AB.msg ( 
    ` 
    <h3> Please wait until the other player has selected start before choosing your team!</h3>
    <p>You may have to double/spam click when selcting your team</p>
      <button onclick='Team1();'  class=ab-largenormbutton > Team1 </button>  
    <button onclick='Team2();'  class=ab-largenormbutton > Team2 </button> <h2>
    <h1>Controls:</h1>
    <ol>
        <li>Use arrow keys to move around the attack board (when it is your go)</li>
        <li>Press enter to hit the current position</li>
        <li>Use mouse 1 (left click) to move the camera angle</li>
    </ol>` 
    + '<h2>' + 'You have ' + '<span style="color:green">' + p1score + ' hit(s) </span>' + ' on their boat(s)' 
    + '<br>' + 
    'They have ' + '<span style="color:red">' + p2score + ' hit(s) </span>' + ' on your boat(s)' + '</h2>' 
    + '<h3><u>' + whosTurn + '</u></h3>');
    
    // Data to share with other player
    var data = [positioning1, p1score, myturn];
    
    // Game ends if one of the players has hit all loctions of the boats
    if (p1score == 12 || p2score == 12)
    { // If you win the game will end
        AB.abortRun = true;
    }
    
    // Used to check what key the user has pressed & used
    document.onkeydown = checkKey;
        
    function checkKey(e)
    {
    
        e = e || window.event;
        
        // If its is the current players turn
        if(myturn) {
            // Each key will check that it is still on the board & will update the box colour to show the user exactly where they are situated with their positioning
            // Will replace the current box with a normal box, & change the next box to the target box. Depending on up, down, right, left
            
            if (e.keyCode == '38')
            {
                // up arrow
                if (keep[1] < 7)
                {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0], keep[1] + 1);
                }
            }
            
            else if (e.keyCode == '40')
            {
                // down arrow
                if (keep[1] > 0)
                {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0], keep[1] - 1);
                }
            }
            
            else if (e.keyCode == '37')
            {
                // left arrow
                if (keep[0] > 0)
                {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0] - 1, keep[1]);
                }
            }
            
            else if (e.keyCode == '39')
            {
                // right arrow
                if (keep[0] < 7)
                {
                    ReplaceTarget(keep[0], keep[1]);
                    keep = TargetMaker(keep[0] + 1, keep[1]);
                }
            }
            
            else if (e.keyCode == '13') 
            {
                // Enter key
                temp = myturn;
                CheckHit(keep, positioning2); // Checks if the current entered position is a hit or not
                
                if (!myturn)
                { // Updating data to send to other player
                    var data = [positioning1, p1score, temp];
                    
                    if(AB.socket) // If the socket has loaded & connected
                    {
                        if(AB.socket.connected)
                        {
                            AB.socketOut(data); // Sends players boats positioning, current players score & turn
                        }
                    }
                }
            }
        }
    }
};


// ******************************************************************************** LEFT HERE ON CLEAN UP!!!! *****************************************************************************


function Team1()
{
    // Sending data to other player
    var data = [positioning1, p1score, false]; // The false is being sent to palayer 2 to indicate it is not their turn
    
    if(AB.socket)
    {
        if(AB.socket.connected)
        {
            AB.socketOut(data); // Sends players boats positioning & current players score & turn
        }
    }
    console.log("YOU HAVE SELECTED TEAM 1");
    // alert("You have selected Team 1");
}
function Team2()
{
    // Sending data to other player
    var data = [positioning1, p1score, true]; // The true is being sent to player 1 to indicate it is their turn
    
    if(AB.socket)
    {
        if(AB.socket.connected)
        {
            AB.socketOut(data); // Sends players boats positioning & current players score
        }
    }
}

function CheckHit(keep, pos)
{
    // Checks if the current box is a hit on the opponents board
    
    test = false;
    test2 = false;
    
    for (let i = 0; i < alreadyHit.length; i++)
    {
        if(keep[0] == alreadyHit[i][0] && keep[1] == alreadyHit[i][1])
        {
            test = true;
        }
    }
    
    if (!test)
    {
        if (keep[0] == pos[0][0])
        { // boat 1 (vertical boat)
            
            if (keep[1] == (pos[0][1] - 1) || keep[1] == (pos[0][1] + 1) || keep[1] == (pos[0][1]))
            {
                alreadyHit.push(keep);
                HitConfirm(keep[0], keep[1]);
                test2 = true;
                console.log("HIT boat 1");
                p1score += 1;
                HitSound.play();
                myturn = false;
            }
        }
        if (keep[0] == pos[1][0])
        { // boat 2 (vertical boat)
            
            if (keep[1] == (pos[1][1] - 1) || keep[1] == (pos[1][1] + 1) || keep[1] == (pos[1][1]))
            {
                alreadyHit.push(keep);
                HitConfirm(keep[0], keep[1]);
                test2 = true;
                console.log("HIT boat 2");
                p1score += 1;
                HitSound.play();
                myturn = false;
            }
        }
        if (keep[1] == pos[2][1])
        { // boat 3 (horizontal boat)
            
            if (keep[0] == (pos[2][0] - 1) || keep[0] == (pos[2][0] + 1) || keep[0] == (pos[2][0]))
            {
                alreadyHit.push(keep);
                HitConfirm(keep[0], keep[1]);
                test2 = true;
                console.log("HIT boat 3");
                p1score += 1;
                HitSound.play();
                myturn = false;
            }
        }
        if (keep[1] == pos[3][1])
        { // boat 3 (horizontal boat)
            
            if (keep[0] == (pos[3][0] - 1) || keep[0] == (pos[3][0] + 1) || keep[0] == (pos[3][0]))
            {
                alreadyHit.push(keep);
                HitConfirm(keep[0], keep[1]);
                test2 = true;
                console.log("HIT boat 4");
                p1score += 1;
                HitSound.play();
                myturn = false;
            }
        }
        if (!test2)
        {
            alreadyMissed.push(keep);
            MissedTarget(keep[0], keep[1]);
            MissSound.play();
            myturn = false;
        }
    }
}

function MissedTarget(x, y)
{
    var loader4 = new THREE.TextureLoader();
    
    loader4.load ( missbox, function ( missbox )  		
	{
		missbox.minFilter  = THREE.LinearFilter;
		miss_texture = missbox;
		if ( asynchFinished() )
		{
		    shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
            thecube  = new THREE.Mesh( shape );
            thecube.material = new THREE.MeshBasicMaterial( { map: miss_texture } );
            			
            thecube.position.copy ( translate2(x, y) ); 
            ABWorld.scene.add(thecube);
		}	
	});
}

function ReplaceTarget(x, y)
{
    test1 = false;

    for (let i = 0; i < alreadyMissed.length; i++)
    {
        if(x == alreadyMissed[i][0] && y == alreadyMissed[i][1])
        {
            test1 = true;
        }
    }

    test = false;
    
    for (let i = 0; i < alreadyHit.length; i++)
    {
        if(x == alreadyHit[i][0] && y == alreadyHit[i][1])
        {
            test = true;
        }
    }

    if(!test && !test1) // Recovering the original cube
    {
        shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
        thecube  = new THREE.Mesh( shape );
        thecube.material = new THREE.MeshBasicMaterial( { map: tile_texture } );
        			
        thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
        ABWorld.scene.add(thecube);
        
    } 
    else if (test && !test1) // Adding hit target cube
    {

        shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
        thecube  = new THREE.Mesh( shape );
        thecube.material = new THREE.MeshBasicMaterial( { map: skull_texture } );
        			
        thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
        ABWorld.scene.add(thecube);
    } 
    else // Adding miss target cube
    {
        shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
        thecube  = new THREE.Mesh( shape );
        thecube.material = new THREE.MeshBasicMaterial( { map: miss_texture } );
        			
        thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
        ABWorld.scene.add(thecube);
    }
}


function TargetMaker(x, y)
{ // Created the target cube used to know what position you want to attack on the attack board

    shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
    thecube  = new THREE.Mesh( shape );
    thecube.material = new THREE.MeshBasicMaterial( { map: target_texture } );
    			
    thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
    ABWorld.scene.add(thecube);
    return [x, y];
    
}

function HitConfirm(x, y)
{ // Adding the hit confirm cube to show that postition is hit
    
    var loader3 = new THREE.TextureLoader();
    
    loader3.load ( skullbox, function ( skullbox )  		
	{
		skullbox.minFilter  = THREE.LinearFilter;
		skull_texture = skullbox;
		if ( asynchFinished() )
		{
		    shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
            thecube  = new THREE.Mesh( shape );
            thecube.material = new THREE.MeshBasicMaterial( { map: skull_texture } );
            			
            thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
            ABWorld.scene.add(thecube);
		}	
	});
    
}

function GridMaker()
{ // Created the two grids
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
}

function buildboat1( object )
{ // Building boat 1

	object.scale.multiplyScalar ( 100 ); // make 3d object n times bigger
	object.traverse( paintBoat );
	boat1 = object;
	threeworld.scene.add( boat1);
	
	positioning1.push(drawBoat1(boat1)); // Adding the position of boat to list of positions
}

function buildboat2( object )
{ // Building boat 2

	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
	object.traverse( paintBoat );
	boat2 = object;
	threeworld.scene.add( boat2);
	
	positioning1.push(drawBoat2(boat2)); // Adding the position of boat to list of positions
}

function buildboat3( object )
{ // Building boat 3

	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
	object.traverse( paintBoat );
	boat3 = object;
	boat3.rotateY(1.6);
	threeworld.scene.add( boat3);
	
	positioning1.push(drawBoat3(boat3)); // Adding the position of boat to list of positions
}

function buildboat4( object )
{ // Building boat 4

	object.scale.multiplyScalar ( 100 );    	  // make 3d object n times bigger
	object.traverse( paintBoat );
	boat4 = object;
	boat4.rotateY(1.6);
	threeworld.scene.add( boat4);
	
	positioning1.push(drawBoat4(boat4)); // Adding the position of boat to list of positions
}

function paintBoat ( child )
{ // Used to add a texture to boats
	if ( child instanceof THREE.Mesh )
	{
      	child.material.map = THREE.ImageUtils.loadTexture( "/uploads/aaroncrawford/wood.jpg" );
	}
}

function drawBoat1()		// given e1i, e1j, draw it
{ // Choosing the position of boat
 
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
{// Choosing the position of boat

    b1i = getRandomPositionVerticleX();
    b1j = getRandomPositionVerticleZ();
    
    if (b1i == positioning1[0][0])
    { // Checking that position is not already taken
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
{ // Choosing the position of boat
 
    b1j = getRandomPositionHorizontalZ();
    b1i = getRandomPositionHorizontalX();
    
    if (b1i >= positioning1[0][0] - 1 && b1i <= positioning1[0][0] + 1 || b1i >= positioning1[1][0] - 1 && b1i <= positioning1[1][0] + 1)
    { // Checking that positioning is not already taken
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
{ // Choosing the position of boat
 
    b1j = getRandomPositionHorizontalZ();
    b1i = getRandomPositionHorizontalX();
    if (b1i >= positioning1[0][0] - 1 && b1i <= positioning1[0][0] + 1 || b1i >= positioning1[1][0] - 1 && b1i <= positioning1[1][0] + 1 || b1i >= positioning1[2][0] - 2 && b1i <= positioning1[2][0] + 2)
    { // Checking that position is not already taken
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

function getRandomPositionVerticleZ()
{ // Get random pos on Z on vertical

    min = Math.ceil(-1);
    max = Math.floor(4);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomPositionVerticleX()
{ // Get random pos on X on vertical

    min = Math.ceil(0);
    max = Math.floor(7);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomPositionHorizontalZ()
{ // Get random pos on Z horizontal

    min = Math.ceil(-2);
    max = Math.floor(5);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomPositionHorizontalX()
{ // Get random pos on X horizontal

    min = Math.ceil(1);
    max = Math.floor(6);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function asynchFinished()		 
{ // Function to check if the textures have loaded

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

AB.world.endRun = function()
{
    AB.newSplash ( splashScreenEndMenu() ); // Calling end screen pop
    
    const time = 10000; // time in milliseconds when the page reload occurs
    
    // Timer to refresh page after time ms
    setTimeout(function() {
        location.reload();
    }, time);
};

function splashScreenStartMenu() 
{ // Rules on the start screen

    var description = 
    `<h1>Rules:</h1>
    <ul>
        <li>Both players must select a team before they can begin the game</li>
        <li>Players will take turns</li>
        <li>First player to get 12 hits wins the game</li>
    </ul>
    NOTE: Both players need to select start before choosing a team!<br>`;
    return description;
}

function splashScreenEndMenu()
{
    // End screen text for winner and loser
    var end_message;
    
    if(p1score == 12)
    {
        end_message = "<h1 style='text-align: center'>WINNER WINNER CHICKEN DINNER!</h1> <h3 style='text-align: center'>The game is over</h3>";
    }
    else
    {
        end_message = "<h1 style='text-align: center'>Mission Failed We'll Get'em Next Time!</h1> <h3 style='text-align: center'>The game is over</h3>";
    }
    return ( end_message );
}

AB.splashClick ( function ()        
{ // Occurs when we click start on start pop up

    AB.runReady = true;
    AB.removeSplash();			// remove splash screen
});

AB.socketIn = function (data){
    positioning2 = data[0];              // Socket functionality (p2 score)
    p2score = data[1];
    myturn = data[2];
   // console.log(myturn + '4');
};

AB.socketUserlist = function ( array )
{ // Used to get number of users to check if the match is full

    console.log(array.length);
    console.log(array);
    if (array.length > 2) {
        AB.splashHtml(fullMatch());
    }
};

function fullMatch()
{ // Screen for when the match is full

    var text;
    
    text = '<h1>The game is currently full, please try again later</h1>';
    text = text + '<button onclick=\'refreshButton();\'  class=ab-largenormbutton > Try again </button>';
    return text;
}

function refreshButton()
{ // Used to refresh end screen page
    location.reload();
}
