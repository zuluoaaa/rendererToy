const DEPTH = 255;

function drawLine(x1,y1,x2,y2,imageData,r,g,b,a){

    let swap = false;

    if(Math.abs(y2-y1) < Math.abs(x2-x1)){
        swap = true;
        let tx = x1;
        let ty = y1;
        x1 = y2;
        y1 = x2;
        y2 = tx;
        x2 = ty;
    }
    if(y1>y2){
        let tx = x1;
        let ty = y1;
        x1 = x2;
        y1 = y2;
        x2 = tx;
        y2 = ty;
    }

    let range = y2-y1;

    for(let y=y1;y<=y2;y++){
        let t = (y-y1)/range;
        let x = Math.round(x1+t*(x2-x1));
        if(swap){
            setPxColor(y,x,imageData,r,g,b,a)
        }else{
            setPxColor(x,y,imageData,r,g,b,a)
        }
    }
}

function drawCircle(imageData,centerX,centerY,radius){

    let ox = centerX;
    let oy = centerY;

    for(let i=0;i<=360;i++){
        let nA = Math.PI/180*i;

        let x = Math.ceil(centerX + radius * Math.sin(nA));
        let y = Math.ceil(centerY + radius * Math.cos(nA));
        drawLine(ox,oy,x,y,imageData,255,0,255,255);
        console.log(x,y)
        ox = x;
        oy = y;
    }
}

function drawTriangle(v1,v2,v3,imageData,colors){
    if(v1.y > v2.y){
        swapVec(v1,v2);
    }
    if(v1.y > v3.y){
        swapVec(v1,v3);
    }
    if(v2.y > v3.y){
        swapVec(v2,v3);
    }

    let range1 = v2.y - v1.y;
    let range2 = v3.y - v1.y;


    let w;
    for(let y=v1.y;y<=v2.y;y++){
        let a = (y-v1.y)/range1;
        let b = (y-v1.y)/range2;

        let dx1 = Math.round(v1.x + (v2.x-v1.x) * a);
        let dx2 = Math.round(v1.x + (v3.x-v1.x) * b);


        if(dx1 > dx2){
            let t = dx1;
            dx1 = dx2;
            dx2 = t;
        }
        w = dx2 - dx1;
        for(let j = dx1;j<=dx2;j++){
            setPxColor(j,y,imageData,...colors);
        }
    }


    let range3 = v3.y - v2.y;



    for(let y=v2.y;y<=v3.y;y++){
        let a = (y-v2.y)/range3;
        let b = (y-v1.y)/range2;


        let dx1 = Math.round(v2.x + (v3.x-v2.x)*a);
        let dx2 = Math.round(v1.x + (v3.x-v1.x)*b);

        if(dx1 > dx2){
            let t = dx1;
            dx1 = dx2;
            dx2 = t;
        }
        for(let j = dx1;j<=dx2;j++){
            setPxColor(j,y,imageData,...colors);
        }
    }

}

function drawTriangle2(v1,v2,v3,imageData,lights,zBuffer,textures,verColors){

    let w = imageData.width;
    let h = imageData.height;
    let minXY = [w-1,h-1];
    let maxXY = [0,0];
    let arr = [v1,v2,v3];
    const imgWH = [w-1,h-1]
    for(let i=0;i<arr.length;i++){
        let item = arr[i];

        for(let z=0;z<2;z++){
            let key;
            if(z === 0){
                key = "x"
            }else{
                key = "y";
            }

            minXY[z] = Math.max(0,Math.min(minXY[z],item[key]));
            maxXY[z] = Math.min(imgWH[z],Math.max(maxXY[z],item[key]));
        }
    }

    
    let textureVers = convertTextureVer(verColors,textures);
    for(let x = minXY[0];x<maxXY[0];x++){
        for(let y = minXY[1];y<maxXY[1];y++){


            let bc = insideTriangle(v1,v2,v3,[x,y]);

            if(bc[0]<0 || bc[1]<0 || bc[2]<0){
                continue
            }

            let z = 0;
            for(let i=0;i<3;i++){
                z += arr[i].z * bc[i];
            }

            let index = Number(x + y * imageData.width);
           
            //console.log(textureVers,x,y)
            let textureVal = getTextureVal(textureVers,bc,textures,lights);
            if(typeof zBuffer[index] === "undefined" ||  zBuffer[index] > z){
                zBuffer[index] = z;

                setPxColor(x,y,imageData,...textureVal);

            }

        }
    }
   
}

function insideTriangle(a,b,c,P){
    let s = [
        [],[]
    ];

    for(let i=2;i--;){
        let key;
        if(i === 1){
            key = "y"
        }
        else{
            key = "x";
        }

        s[i][0] = c[key] - a[key];
        s[i][1] = a[key] - b[key];
        s[i][2] = a[key] - P[i];
    }

    let u = crossProduct(s[0],s[1]);

    if(Math.abs(u[2])<1){
        return [-1,1,1];
    }
    return [1 - (u[0] + u[1]) / u[2], u[1] / u[2], u[0] / u[2]];
}

function swapVec(a,b){
    let x = a.x;
    let y = a.y;
    a.x = b.x;
    a.y = b.y;
    b.x = x;
    b.y = y;
}

function setPxColor(x,y,imageData,r,g,b,a=255){
    let data = imageData.data;
    let w = imageData.width;

    let index = (w * y + x  ) * 4;

    data[index] = r;
    data[index+1] = g;
    data[index+2] = b;
    data[index+3] = a;
}


function viewport(x,y,w,h){
    console.log(x,y,w,h,"x,y,w,h")
    return [
        w/2,0,0,x+w/2,
        0,h/2,0,y+h/2,
        0,0,DEPTH/2,DEPTH/2,
        0,0,0,1
    ]
}