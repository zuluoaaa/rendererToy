
function loadTexture(img,width,height){
    return new Promise(resolve => {
        let fn = ()=>{

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.height = height;
            canvas.width = width;
            ctx.drawImage(img,0,0,width,height);
            resolve(ctx.getImageData(0,0,width,height))
        }

        img.onload = ()=>{
            fn();
        }
        setTimeout(()=>{
            fn();
        },3000)
    })

}

function convertTextureVer(verColors,textures){
    const newVers = [];
    for(let i=0;i<3;i++){
        newVers[i] = [
            Number((1-verColors[i][0]) * textures.width),
            Number((1-verColors[i][1]) * textures.height)
        ]
    }
    return newVers
}

function getColorByThreeVer(verColors,textures,bc,light){
    let textureVal = [];
  
    let v0Color =  getPxColor(verColors[0][0],verColors[0][1],textures);
    let v1Color =  getPxColor(verColors[1][0],verColors[1][1],textures);
    let v2Color =  getPxColor(verColors[2][0],verColors[2][1],textures);

    for(let i=0;i<3;i++){

        textureVal[i] =  bc[0] * v0Color[i] + bc[1] * v1Color[i] + bc[2] * v2Color[i];
        textureVal[i] *= light;
        textureVal[i] = Math.round(textureVal[i]);
    }

    textureVal.push(255);
    return textureVal;
}

function getTextureVal(textureVers,bc,textures,light){
  let colors = [];
  let x=0,y=0;
  
  for(let i=0;i<3;i++){
    x += textureVers[i][0] * bc[i];
    y += textureVers[i][1] * bc[i];
  }
  x = parseInt(x);
  y = parseInt(y);
  let key = Math.floor(y * textures.width + x) * 4;
  
  let data = textures.data;
  colors = [
      Math.round(data[key]*light),
      Math.round(data[key+1]*light),
      Math.round(data[key+2]*light),
      data[key+3]
  ];
 
  return colors;
}

function getPxColor(x,y,imageData){

    let index = Math.floor(y * imageData.height * imageData.width + x * imageData.width) * 4;

    let rgba = [
        imageData.data[index],
        imageData.data[index+1],
        imageData.data[index+2],
        imageData.data[index+3],
    ];


    return rgba;
}