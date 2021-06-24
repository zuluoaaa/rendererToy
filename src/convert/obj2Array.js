const  fs = require("fs");

const data = fs.readFileSync('african_head.obj');
const dataArray = (data.toString()).split("\n");

const output = {};

const verts = [];
const faces = [];
const texture = [];
dataArray.forEach(item=>{
    let startChar = item[0]+item[1];
    let char = item.replace(startChar,"").trim();
    if(startChar === "f "){
        if(item.indexOf("//") > -1){
            item = item.replace(/\/\//g,"/");
        }
        let face = char.split(" ").map(item=>item.split("/").map(item=>Number(item)-1));

        faces.push([face[0][0],face[1][0],face[2][0],face[0][1],face[1][1],face[2][1]]);
    }
    else if(startChar === "v "){
        let arr = char.split(" ").map(item=>Number(item));
        verts.push(arr);
    }
    else if(startChar == "vt"){
        let arr = char.split(" ").map(item=>Number(item));
        texture.push(arr);
    }
})

output.verts = verts;
output.faces = faces;
output.texture = texture;

fs.writeFile('../share/obj.js',"var objDataArray = " + JSON.stringify(output),(err)=>{})
