//to do
// turns ingame
// ui

const MUSICFILE = '/uploads/aaroncrawford/Sea_Shanty.mp3';
AB.backgroundMusic ( MUSICFILE );

const MissSounds = "/uploads/aaroncrawford/MissSound.mp3";
var MissSound = new Audio(MissSounds);

const HitSounds = "/uploads/aaroncrawford/HitSound.mp3";
var HitSound = new Audio(HitSounds);

ABWorld.drawCameraControls = false; // Controls for camera
AB.drawRunControls = false; // Controls for the steps and run

AB.maxSteps = 10000;
AB.clockTick = 100;

const skycolor = 'lightyellow';           
const boxcolor = '/uploads/aaroncrawford/tile.png' ;
const targetbox = '/uploads/aaroncrawford/target_tile.png';
const skullbox = '/uploads/aaroncrawford/tile2.png';
const missbox = '/uploads/aaroncrawford/tile3.png';
const  LIGHTCOLOR = 0xffffff ;
const SKYCOLOR 	= 0x009933;	
const red = SKYCOLOR;

const gridsize 		= 8;							// number of squares along side of world	   
const squaresize 	= 400;// size of square in pixels
var positioning1 = [];
var positioning2 = [];
const MAXPOS 		= gridsize * squaresize;// length of one side in pixels 
const skyboxConst			= MAXPOS * 3 ;
ABHandler.GROUNDZERO		= true;
const maxRadiusConst 		= MAXPOS * 10  ;	
//const objectsize    = 300;                  // size of object   

const startRadiusConst	 	= MAXPOS * 0.8 ;	
const startRadius   = 5500;                 // distance from centre we start the camera at

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

var alreadyHit = [];
var alreadyMissed = [];
var myturn;


// the object is a cube (each dimension equal): 

 AB.newSplash ( splashScreenStartMenu() ); // Shows the menu page
 
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
  
   var materialArray = [
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0001.bmp" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0004.bmp" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0003.bmp" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0006.bmp" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/seanhutchinson/skyrender0005.bmp" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture("/uploads/seanhutchinson/skyrender0002.bmp"), side: THREE.BackSide } ) ),
 	];
  
  
  var skyGeometry = new THREE.BoxGeometry ( skyboxConst, skyboxConst, skyboxConst );	
  var skyMaterial = new THREE.MeshFaceMaterial ( materialArray );
  var theskybox = new THREE.Mesh ( skyGeometry, skyMaterial );
  threeworld.scene.add( theskybox );						// We are inside a giant Cube
}

                
	AB.world.newRun = function() {

        
        AB.socketStart();
        // console.log(myturn + '1');

	    BOXHEIGHT = squaresize;
	    threeworld.init3d ( startRadiusConst, maxRadiusConst, SKYCOLOR  );
	    var thelight = new THREE.DirectionalLight ( LIGHTCOLOR, 3 );
	    //	 thelight.position.set ( startRadiusConst, startRadiusConst, startRadiusConst );
	  	threeworld.scene.add(thelight);
	 
	    
        initSkybox();
        initScene();
        AB.runReady = false;
        
        // console.log(myturn + '1');


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
    	
    // 	loader3.load ( skullbox, function ( skullbox )  		
    // 	{
    // 		skullbox.minFilter  = THREE.LinearFilter;
    // 		skull_texture = skullbox;
    // 		if ( asynchFinished() )	TargetMaker(0, 7);	
    // 	});
	 	var ambient = new THREE.AmbientLight();
        ABWorld.scene.add(ambient);
	}
	
	AB.world.nextStep = function()		 
    {
        if(myturn) {
            whosTurn = "It is your turn!";
        }
        else {
            whosTurn = "The other player is making their go please wait!";
        }
        // Side message bar indicating controls, points and team selection
        AB.msg ( 
        ` 
        <h3> Please wait until the other player has selected start before choosing your team!</h3>
        <p>You may have to double click when selcting your team</p>
  	    <button onclick='Team1();'  class=ab-largenormbutton > Team1 </button>  
        <button onclick='Team2();'  class=ab-largenormbutton > Team2 </button> <h2>
        <h1>Controls:</h1>
        <ol>
            <li>Use arrow keys to move around the attack board (when it is your go)</li>
            <li>Press enter to hit the current position</li>
        </ol>` 
        + '<h2>' + 'You have ' + '<span style="color:green">' + p1score + ' hit(s) </span>' + ' on their boat(s)' 
        + '<br>' + 
        'They have ' + '<span style="color:red">' + p2score + ' hit(s) </span>' + ' on your boat(s)' + '</h2>' 
        + '<h3><u>' + whosTurn + '</u></h3>');
        
        var data = [positioning1, p1score, myturn];
        
       // AB.msg ('You have hit ' + p1score + ' boats' + '<br>' + 'They have hit ' + p2score + ' boats');

        if (p1score == 12 || p2score == 12) { // If you win the game will end
            AB.abortRun = true;
        }
        console.log(myturn);
        // console.log(positioning2);

        document.onkeydown = checkKey;
            
        function checkKey(e) {
            // console.log(myturn + '2');
        
            e = e || window.event;
            if(myturn) {
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
                var data = [positioning1, p1score, myturn];
                if(AB.socket){
                    if(AB.socket.connected){
                        AB.socketOut(data); // Sends players boats positioning & current players score
                    }
                }
                myturn = false;
                alert("test");
            }
            }
            // console.log(myturn + '3');
        
        }
        // console.log(positioning2);
        
        
    };
    
    function Team1() {
        var data = [positioning1, p1score, false];
        // AB.msg ('You have hit ' + p1score + ' boats' + '<br>' + 'They have hit ' + p2score + ' boats');
        if(AB.socket){
            if(AB.socket.connected){
                AB.socketOut(data); // Sends players boats positioning & current players score
            }
        }
        console.log("YOU HAVE SELECTED TEAM 1");
        // alert("You have selected Team 1");
    }
    function Team2(){
        var data = [positioning1, p1score, true];
        // AB.msg ('You have ' + p1score + ' boats' + '<br>' + 'They have hit ' + p2score + ' boats');
        if(AB.socket){
            if(AB.socket.connected){
                AB.socketOut(data); // Sends players boats positioning & current players score
            }
        }
    }
    
    function CheckHit(keep, pos) {
        // Checks if the current box is a hit on the opponents board
        //console.log(p1score, p2score);
        // console.log(pos);
        //  console.log(alreadyHit);
        //  console.log(keep);
        // console.log(alreadyHit.some(elem => elem === keep));
        test = false;
        test2 = false;
        //console.log(alreadyHit.length);
        for (let i = 0; i < alreadyHit.length; i++) {
            if(keep[0] == alreadyHit[i][0] && keep[1] == alreadyHit[i][1]) {
                test = true;
            }
        }
        // console.log('1');
        if (!test) { // NOTE ******************************************************** if we get a hit, and continue pressing it will not add to total player score, but if we move and come back to that hit, it will add to the player score????
            // console.log('2');
            if (keep[0] == pos[0][0]) { // boat 1 (vertical boat)
                
                if (keep[1] == (pos[0][1] - 1) || keep[1] == (pos[0][1] + 1) || keep[1] == (pos[0][1])) {
                    alreadyHit.push(keep);
                    HitConfirm(keep[0], keep[1]);
                    test2 = true;
                    console.log("HIT boat 1");
                    p1score += 1;
                    HitSound.play();
                }
            }
            if (keep[0] == pos[1][0]) { // boat 2 (vertical boat)
                
                if (keep[1] == (pos[1][1] - 1) || keep[1] == (pos[1][1] + 1) || keep[1] == (pos[1][1])) {
                    alreadyHit.push(keep);
                    HitConfirm(keep[0], keep[1]);
                    test2 = true;
                    console.log("HIT boat 2");
                    p1score += 1;
                    HitSound.play();
                }
            }
            if (keep[1] == pos[2][1]) { // boat 3 (horizontal boat)
                
                if (keep[0] == (pos[2][0] - 1) || keep[0] == (pos[2][0] + 1) || keep[0] == (pos[2][0])) {
                    alreadyHit.push(keep);
                    HitConfirm(keep[0], keep[1]);
                    test2 = true;
                    console.log("HIT boat 3");
                    p1score += 1;
                    HitSound.play();
                }
            }
            if (keep[1] == pos[3][1]) { // boat 3 (horizontal boat)
                
                if (keep[0] == (pos[3][0] - 1) || keep[0] == (pos[3][0] + 1) || keep[0] == (pos[3][0])) {
                    alreadyHit.push(keep);
                    HitConfirm(keep[0], keep[1]);
                    test2 = true;
                    console.log("HIT boat 4");
                    p1score += 1;
                    HitSound.play();
                }
            }
            if (!test2){
                // console.log('3');
                alreadyMissed.push(keep);
                // console.log(keep);
                MissedTarget(keep[0], keep[1]);
                MissSound.play();
            }
        }
    }
    
    function MissedTarget(x, y) {
        var loader4 = new THREE.TextureLoader();
        
        loader4.load ( missbox, function ( missbox )  		
    	{
    		missbox.minFilter  = THREE.LinearFilter;
    		miss_texture = missbox;
    		if ( asynchFinished() ) {
    		    shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
                thecube  = new THREE.Mesh( shape );
                thecube.material = new THREE.MeshBasicMaterial( { map: miss_texture } );
                			
                thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
                ABWorld.scene.add(thecube);
    		}	
    	});
    }
    
    function ReplaceTarget(x, y) {
        
        // var i = 0;
        // var j = 7;
        test1 = false;
        // console.log(alreadyMissed);
        for (let i = 0; i < alreadyMissed.length; i++) {
            if(x == alreadyMissed[i][0] && y == alreadyMissed[i][1]) {
                test1 = true;
            }
        }
        // console.log(alreadyHit);
        // console.log([x, y]);
        test = false;
        for (let i = 0; i < alreadyHit.length; i++) {
            if(x == alreadyHit[i][0] && y == alreadyHit[i][1]) {
                test = true;
            }
        }
        // console.log(test);
        if(!test && !test1) {
            // console.log('we have not selected enter');
            shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
            thecube  = new THREE.Mesh( shape );
            thecube.material = new THREE.MeshBasicMaterial( { map: tile_texture } );
            			
            thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
            ABWorld.scene.add(thecube);
        } else if (test && !test1){
            // console.log('leaving somewhere we hit');
            shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
            thecube  = new THREE.Mesh( shape );
            thecube.material = new THREE.MeshBasicMaterial( { map: skull_texture } );
            			
            thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
            ABWorld.scene.add(thecube);
        } else {
            // console.log('leaving with missed');
            shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
            thecube  = new THREE.Mesh( shape );
            thecube.material = new THREE.MeshBasicMaterial( { map: miss_texture } );
            			
            thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
            ABWorld.scene.add(thecube);
        }
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
    
    function HitConfirm(x, y) {
        
        var loader3 = new THREE.TextureLoader();
        
        loader3.load ( skullbox, function ( skullbox )  		
    	{
    		skullbox.minFilter  = THREE.LinearFilter;
    		skull_texture = skullbox;
    		if ( asynchFinished() ) {
    		    shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
                thecube  = new THREE.Mesh( shape );
                thecube.material = new THREE.MeshBasicMaterial( { map: skull_texture } );
                			
                thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
                ABWorld.scene.add(thecube);
    		}	
    	});
        
        // shape    = new THREE.BoxGeometry ( squaresize, squaresize, squaresize );			 
        // thecube  = new THREE.Mesh( shape );
        // thecube.material = new THREE.MeshBasicMaterial( { map: target_texture } );
        			
        // thecube.position.copy ( translate2(x, y) ); 		  	// translate my (i,j) grid coordinates to three.js (x,y,z) coordinates 
        // ABWorld.scene.add(thecube);
        
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
       	
       	// AB.msg ( p1score);

        
        // Used when clicking Team1 button
        // var team1 = document.getElementById("Team1");
        // team1.addEventListener("click", function()
        // {
        //     //AB.abortRun = true; // just testing cases
        //     console.log("this worked!");
        // });
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
	
	AB.world.endRun = function()
	{
	    AB.newSplash ( splashScreenEndMenu() );
	    
	    const time = 10000;
	    
	    // timer to refresh page after time ms
	    setTimeout(function() {
            location.reload();
        }, time);
	};
	
    function splashScreenStartMenu() 
    {
        var description = 
        `<h1>Rules:</h1>
        <ul>
            <li>Both players must select a team before they can begin the game</li>
            <li>Players will take turns</li>
            <li>First player to get 12 hits wins the game</li>
        </ul>
        NOTE: Both players need to select start before choosing a team!<br>`;
        // var team1 = "<button onclick='Team1();'  class=ab-largenormbutton > Team 1</button>"; // NOTE: This can be removed if cannot add team buttons/remove the default start button
        // var team2 = "<button onclick='Team2();'  class=ab-largenormbutton > Team 2</button>";
        
        // return ( description + team1 + team2 );
         // Used when clicking Team1 button
        // var team1 = document.getElementById("Team1");
        // team1.addEventListener("click", function()
        // {
        //     //AB.abortRun = true; // just testing cases
        //     console.log("this worked!");
        // });
        return description;
    }
    
    function splashScreenEndMenu()
    {
        // End screen text for winner and loser
        if(p1score == 12) {
            end_message = "<h1 style='text-align: center'>WINNER WINNER CHICKEN DINNER!!!</h1> <h3 style='text-align: center'>The game is over</h3>";
        }
        else{
            end_message = "<h1 style='text-align: center'>Mission Failed We'll Get'em Next Time!</h1> <h3 style='text-align: center'>The game is over</h3>";
        }
        return ( end_message );
    }
    
    AB.splashClick ( function ()        
	{		
        AB.runReady = true;
        AB.removeSplash();			// remove splash screen
	});
	
	AB.socketIn = function (data){
	    positioning2 = data[0];              // Socket functionality (p2 score)
	    p2score = data[1];
	    myturn = data[2];
	   // console.log(myturn + '4');
	};
    
    // AB.socketUserlist = function ( array ) {
    //     console.log(array.length);
    // };
