const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

canvas.width = 1280;
canvas.height = 720;

let worldSpeed = 6;
let animationTimer = 0;
let waterCollected = 0;
let peopleHelped = 0;
let onPlatform = false;
let distanceTraveled = 0;
let wellVisible = false;
let gameState = "menu";
let repairingWell = false;






const playerSprite = new Image();
playerSprite.src = "sprites/player-run.png";

const treeSprite = new Image();
treeSprite.src = "sprites/tree.png";

const houseSprite = new Image();
houseSprite.src = "sprites/house.png";

const waterSprite = new Image();
waterSprite.src = "sprites/water1.png";

const wellSprite = new Image();
wellSprite.src = "sprites/well.png";

const cloudSprite = new Image();
cloudSprite.src = "sprites/cloud.png"

const grassLeftSprite = new Image();
grassLeftSprite.src = "sprites/grassleftend.png"

const grassrightSprite = new Image();
grassrightSprite.src = "sprites/grassrightend.png"

const grassmiddleSprite = new Image();
grassmiddleSprite.src = "sprites/grassmiddle.png"

const grassTileSprite = new Image();
grassTileSprite.src = "sprites/grasstile.png"

const brokenwellSprite = new Image();
brokenwellSprite.src = "sprites/brokenwell.png"

const oceanSprite = new Image();
oceanSprite.src = "sprites/oceanSprite.png"

const repairingWellSprite = new Image();
repairingWellSprite.src = "sprites/repairingWell.png"


//SFX Assets
const jumpSound = new Audio(
    "sprites/jumpSfx.mp3"
);
const coinCollect = new Audio(
    "sprites/coinCollect.mp3"
);
const Gameplay = new Audio(
    "sprites/Gameplay.mp3"
);
const completemission = new Audio(
    "sprites/completemission.mp3"
);
const menumusic = new Audio(
    "sprites/menumusic.mp3"
);

//player animation 

let currentFrame = 0;

const totalFrames = 3; // frame count

const frameWidth = 32;
const frameHeight = 32;




const clouds = [
    { x: 200, y: 100, width:100},
    { x:700, y: 50, width: 120},
];

const player ={
    x: 150,
    y: canvas.height - 170,

    width: 50,
    height: 50,

    color: "#ffcc00",

    velocityY: 0,
    onGround: true,

    // double jump feature

    jumpCount: 0

};
const houses = [
    {
        x: 500,
        y: canvas.height - 280,
        width: 150,
        height: 130
    },
    {
        x: 1200,
        y: canvas.height - 280,
        width: 150,
        height:  130 
    }
]
const trees = [

  
    {
        x:1500,
        y:canvas.height -240,
        width:100,
        height:200
    }
];

const backTrees = [
        {
        x: 300,
        y: canvas.height - 270,
        width: 30,
        height: 110
    },

    {
        x: 600,
        y: canvas.height - 270,
        width: 30,
        height: 100
    },
    {
        x: 1000,
        y: canvas.height - 270,
        width: 30,
        height: 100
    }
]

/**====GAME LISTENER */
document.addEventListener("keydown", (e) => {
    if(
    (gameState === "win" ||
     gameState === "loss") &&
    e.code === "KeyR"
    ){
        location.reload();
    }
    if(
        gameState === "menu" &&
        e.code === "Space"
    ){

        startGame();
        return;
    }

    
    if(
        gameState !== "playing"
    ){
        return;
    }
    if(
        gameState === "playing" &&
        e.code === "Space" &&
        player.jumpCount < 2
    )

    {

        if(player.jumpCount === 0){

            jumpSound.currentTime = 0;
            jumpSound.volume = 0.3; 
            jumpSound.play();

            player.velocityY = -18;

        } else {
            jumpSound.currentTime = 0;
            jumpSound.play();
            player.velocityY = -14;

        }

        player.jumpCount++;

    }

});

//WATER DROPS
const waterDrops = [

    {
        x: 1200,
        y: canvas.height - 220,
        width: 32,
        height: 32,
        collected: false
    },

    {
        x: 1800,
        y: canvas.height - 260,
        width: 32,
        height: 32,
        collected: false
    },

    {
        x: 2500,
        y: canvas.height - 220,
        width: 32,
        height: 32,
        collected: false
    },

    {
        x: 3200,
        y: canvas.height - 300,
        width: 32,
        height: 32,
        collected: false
    },


    {
        x: 1450,
        y: 330,
        width: 32,
        height: 32,
        collected: false
    },
    {
        x: 2700,
        y: 280,
        width: 32,
        height: 32,
        collected: false
    },
    {
       x: 3850,
        y: 230,
        width: 32,
        height: 32,
        collected: false 
    }

];

//PLATFORMS 
const platforms = [

    {
        x: 0,
        width: 900
    },

    {
        x: 1150,
        width: 700,
    },

    {
        x: 2200,
        width: 900 
    },

    {
        x: 3550,
        width: 800
    }

];
const floatingPlatforms = [

{
    x: 1200,
    y: 350,
    width: 164,
    height: 32,
    collected: false
},
{
    x: 2700,
    y: 300,
    width: 64,
    height: 64,
    collected: false
},
{
    x: 3850,
    y: 300,
    width: 64,
    height: 364,
    collected: false
}


];

const PLATFORM_GAP = 150;

//grass tile 
const grassTile = [
   {
       x: 0,
       y: 500,
       width: 64,
       height: 64,

   },
      {
       x: 64,
       y:500,
       width: 64,
       height: 64,

   },      
   {
       x: 128,
       y: 500,
       width: 64,
       height: 64,

   },
   {
       x: 192,
       y: 500,
       width: 64,
       height: 64,

   },
   {
       x: 256,
       y: 500,
       width: 64,
       height: 64,

   },
    {
       x: 320,
       y: 500,
       width: 64,
       height: 64,

   },
   {
       x: 384,
       y: 500,
       width: 64,
       height: 64,

   },
   {
       x: 448,
       y: 500,
       width: 64,
       height: 64,

   },
    {
       x: 512,
       y: 500,
       width: 64,
       height: 64,

   },
      {
       x: 576,
       y: 500,
       width: 64,
       height: 64,

   },
      {
       x: 640,
       y: 500,
       width: 64,
       height: 64,

   },
    {
        x: 704,
        y: 500,
        width: 64,
        height: 64,
        
    },
        {
        x: 768,
        y: 500,
        width: 64,
        height: 64,
       
    },
       
    {
        x: 832,
        y: 500,
        width: 64,
        height: 64,
       
    },
        {
        x: 896,
        y: 500,
        width: 64,
        height: 64,
       
    },
        {
        x: 960,
        y: 500,
        width: 64,
        height: 64,
       
    },    {
        x: 1024,
        y: 500,
        width: 64,
        height: 64,
       
    },    {
        x: 1088,
        y: 500,
        width: 64,
        height: 64,
       
    },    {
        x: 1152,
        y: 500,
        width: 64,
        height: 64,
       
    },    {
        x: 1216,
        y: 500,
        width: 64,
        height: 64,
       
    },    {
        x: 1280,
        y: 500,
        width: 64,
        height: 64,
       
    },
]

// broken well
const brokenWell =
    {
    x: 6000,
    y: canvas.height - 265,
    width: 150,
    height: 150
    }


function startGame(){

    distanceTraveled = 0;

    waterCollected = 0;
    peopleHelped = 0;

    wellVisible = false;
    repairingWell = false;

    worldSpeed = 6;

    player.x = 150;
    player.y = canvas.height - 200;
    player.velocityY = 0;
    player.jumpCount = 0;

    brokenWell.x = 6000;

    gameState = "playing";
}


/**==================
 * DRAW FUNCTION BELOW
 * ===================
 */


function draw(){

    // sky

    ctx.fillStyle = "#87ceeb";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    //Mountains
        ctx.fillStyle = "#83acd8";

        ctx.beginPath();
        ctx.moveTo(-40, 500);
        ctx.lineTo(250, 250);
        ctx.lineTo(500, 500);
        ctx.fill();

        ctx.fillStyle = "#84b0df";
        ctx.beginPath();
        ctx.moveTo(350, 500);
        ctx.lineTo(700, 200);
        ctx.lineTo(1050, 500);
        ctx.fill();
    
    


    // dirt background

    ctx.fillStyle = "#775331";

    ctx.fillRect(
        0,
        canvas.height - 170,
        canvas.width,
        300
    );
        ctx.fillStyle = "#5b3b1e";

        ctx.fillRect(
            0,
            canvas.height - 75,
            canvas.width,
            300
        );

        
    // ground

    platforms.forEach(platform => {
        //left platform
        ctx.drawImage(
        grassLeftSprite,
        platform.x,
        canvas.height - 140,
        64,
        64
    );


    // middle
// middle tiles

        for(
            let x = platform.x + 64;
            x < platform.x + platform.width - 64;
            x += 64
        ){

            ctx.drawImage(
                grassmiddleSprite,
                x,
                canvas.height - 140,
                64,
                64
            );

        }
    // right
    ctx.drawImage(
    grassrightSprite,
    platform.x + platform.width - 64,
    canvas.height - 140,
    64,
    64
    );

});
    


// clouds

    clouds.forEach(cloud => {

        ctx.drawImage(
            cloudSprite,
            cloud.x,
            cloud.y,
            cloud.width,
            100
        );

    });


 //back trees

        backTrees.forEach(tree => {

            ctx.drawImage(
                treeSprite,
                tree.x,
                tree.y,
                tree.width,
                tree.height
            );

        });


    houses.forEach(house => {

        ctx.drawImage(
            houseSprite,
            house.x,
            house.y,
            house.width,
            house.height
        );

    });
//grass
    grassTile.forEach(grass => {

        ctx.drawImage(
            grassTileSprite,
            grass.x,
            grass.y,
            grass.width,
            grass.height,
        )
    })

//player 

    ctx.drawImage(
    playerSprite,

    currentFrame * frameWidth,
    0,

    frameWidth,
    frameHeight,

    player.x,
    player.y,

    player.width,
    player.height
    );
    
// broken well


if(wellVisible){

    ctx.drawImage(

        repairingWell
            ? repairingWellSprite
            : brokenwellSprite,

        brokenWell.x,
        brokenWell.y,
        brokenWell.width,
        brokenWell.height
    );
}


//floating platforms 

floatingPlatforms.forEach(platform => {

    for(
        let x = platform.x;
        x < platform.x + platform.width;
        x += 64
    ){

        ctx.drawImage(
            grassmiddleSprite,
            x,
            platform.y,
            64,
            64
        );

    }

}); 



    //FOREGROUND TREES

        trees.forEach(tree => {

            ctx.drawImage(
                treeSprite,
                tree.x,
                tree.y,
                tree.width,
                tree.height
            );

        });

//WATER

    waterDrops.forEach(water => {

    if(!water.collected){

        ctx.drawImage(
            waterSprite,
            water.x,
            water.y,
            water.width,
            water.height
        );

    }
});


/**========GAME Loss CONDITION===========
 * ===================================== */


if(gameState === "loss"){

    ctx.fillStyle = "rgba(0,0,0,.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";

    ctx.font = "48px Arial";

    ctx.fillText(
        "Not Enough Water!",
        canvas.width/2 - 180,
        canvas.height/2
    );
    ctx.font = "24px Arial";

    ctx.fillText(
        "Press R to Restart",
        canvas.width/2 - 100,
        canvas.height/2 + 50
    );

    return;
    }

//HUD
    ctx.fillStyle = "white";

    ctx.font = "18px Arial";


    ctx.fillText(
        `Water: ${waterCollected}`,
        20,
        50
    );

    ctx.fillText(
        `People Helped: ${peopleHelped}`,
        20,
        90
    );

    ctx.fillStyle = "rgba(103, 194, 255, 0.42)";

    ctx.fillRect(
        10,
        10,
        220,
        90
    );

//GAME MENU

    if(gameState === "menu"){

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";

    ctx.font = "60px Arial";
    
    //Shadow Blur
    ctx.shadowColor = "#00bfff";
    ctx.shadowBlur = 20;

    ctx.fillText(
        "WORLD WATER",
        canvas.width / 2 - 220,
        200
    );

    ctx.shadowBlur = 0;

    // TItle Text
    ctx.fillText(
        "WORLD WATER",
        canvas.width/2 - 220,
        200
    );

    ctx.font = "36px Arial";

    ctx.fillText(
        "The Journey",
        canvas.width/2 - 120,
        260
    );

    ctx.font = "24px Arial";

    ctx.fillText(
        "Press SPACE to Start",
        canvas.width/2 - 120,
        380
    );

    }

/**========GAME WON CONDITION===========
 * ===================================== */

if(gameState === "win"){

    ctx.fillStyle = "rgba(0,0,0,.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";

    ctx.font = "48px Arial";

    ctx.fillText(
        "Village Water Restored!",
        canvas.width/2 - 220,
        canvas.height/2
    );
    ctx.font = "24px Arial";

    ctx.fillText(
        "Press R to Restart",
        canvas.width/2 - 100,
        canvas.height/2 + 50
    );

    return;
}




} //!!!! end of draw()!!!!!!!













/**======GAME LOOP========= */


function gameLoop(){
    console.log (gameState);

    /**====GAME LISTENER======= */
        if(
            gameState === "win" ||
            gameState === "loss"
        ){

            draw();

            requestAnimationFrame(gameLoop);

            return;
        }

        //menu Start code 
    if(gameState === "menu"){
        menumusic.loop = true;
        menumusic.volume = 0.3;
        menumusic.play();
    draw();

    requestAnimationFrame(gameLoop);

    return;
    }
    
    
//distance clause
    distanceTraveled += worldSpeed;



//broken well 
        if (distanceTraveled >= 5000 ) {

                brokenWell.x -= worldSpeed;
                wellVisible = true;
        }
   
   
//clouds 

    clouds.forEach(cloud => {
        
        cloud.x -= worldSpeed * 0.15;

        if (cloud.x < - 200){
            cloud.x = canvas.width + 200;
        }
    });

    //foreground trees 
    trees.forEach(tree => {

        tree.x -= worldSpeed * 0.70;

        if (tree.x < -300){
            tree.x = canvas.width + 300;
        }
    });
    //backTress
    backTrees.forEach(backTree => {

        backTree.x -= worldSpeed * 0.3;

        if (backTree.x < -300){
            backTree.x = canvas.width + 300;
        }
    });

    //house
    houses.forEach(house => {
 
        house.x -= worldSpeed * .3;
 
        if(house.x < -200){
 
            house.x = canvas.width + 500;
        }
    });






    //animation timer
    animationTimer++;

    if(animationTimer > 6){

    currentFrame++;

    if(currentFrame >= totalFrames){

        currentFrame = 0;

    }

    animationTimer = 0;
}


   // player 
    player.velocityY += 0.8;
    player.y += player.velocityY;
    
    onPlatform = false;

    platforms.forEach(platform => {

        const platformTop = canvas.height - 115

        if(

            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&

            player.y + player.height >= platformTop &&
            player.y + player.height <= platformTop + 20 &&

            player.velocityY >= 0

        ){

            player.y = platformTop - player.height;

            player.velocityY = 0;

            player.onGround = true;

            player.jumpCount = 0;

            onPlatform = true;

        }

});

if(!onPlatform){

    player.onGround = false;

}
        
       
   
    //WATER 

    waterDrops.forEach(water => {

        water.x -= worldSpeed     ;
    if (water.x < -50){
        water.x = canvas.width + 1000;
        water.collected = false;
    }

    if(
        !water.collected &&

        player.x < water.x + water.width &&
        player.x + player.width > water.x &&

        player.y < water.y + water.height &&
        player.y + player.height > water.y
    ){

        water.collected = true;


        coinCollect.currentTime = 0;
        coinCollect.play();
         
        waterCollected++;
        peopleHelped += 3;

        console.log("Collected!");

    }


});

// ****======WIN CONDITION======*******


if(
    wellVisible &&
    gameState === "playing" &&
    player.x < brokenWell.x + brokenWell.width &&
    player.x + player.width > brokenWell.x &&
    player.y < brokenWell.y + brokenWell.height &&
    player.y + player.height > brokenWell.y
){

    if(!repairingWell){

        if(waterCollected >= 5){
            gameState = "win";
  
            worldSpeed = 0;
            // future animation for well repair 

        }else{

            gameState = "loss";

        }
    }
}
if(
    wellVisible &&
    player.x > brokenWell.x - 20
){

    worldSpeed = 0;

    if(waterCollected >= 5){

        gameState = "win";

    }else{

        gameState = "loss";

    }

}

//platform 
platforms.forEach(platform => {

    platform.x -= worldSpeed;

    if(platform.x + platform.width < 0){

        let furthestX = 0;

        platforms.forEach(p => {

            if(p.x + p.width > furthestX){

                furthestX = p.x + p.width;

            }

        });

        platform.x = furthestX + PLATFORM_GAP;

    }

});
//floating platform 

floatingPlatforms.forEach(platform => {

    platform.x -= worldSpeed;

    if(platform.x + platform.width < 0){

        platform.x = canvas.width + 1000;

    }

});

//floating platform collisions
floatingPlatforms.forEach(platform => {
    

    const platformTop = platform.y + 25;

    if(

        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&

        player.y + player.height >= platformTop &&
        player.y + player.height <= platformTop + 20 &&

        player.velocityY >= 0

    ){

        player.y = platformTop - player.height;

        player.velocityY = 0;

        player.onGround = true;

        player.jumpCount = 0;

        onPlatform = true;

    }

});
//grass tile

/*grassTile.forEach(grassTile => {
    grassTile.x -= worldSpeed;

        if(grassTile.x + grassTile.width < 0){
 
        grassTile.x = canvas.width - 50;

    }
})*/









//player

if(player.y > canvas.height){

    player.x = 150;

    player.y = canvas.height - 200;

    player.velocityY = 0;

}

    draw();
    requestAnimationFrame(gameLoop);

}

gameLoop();