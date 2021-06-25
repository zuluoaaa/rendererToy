function verSub(v1,v2){
    return [v1[0]-v2[0],v1[1]-v2[1],v1[2]-v2[2]]
}

function crossProduct(v1,v2){
    return [
        v1[1]*v2[2]-v1[2]*v2[1],
        v1[0]*v2[2]-v1[2]*v2[0],
        v1[0]*v2[1]-v1[1]*v2[0]
    ]
}

function normalize(v1){
    let len = Math.sqrt(v1[0]*v1[0]+v1[1]*v1[1]+v1[2]*v1[2]);
    return [
        v1[0]/len,  v1[1]/len,  v1[2]/len
    ]
}

function dot(v1,v2){
    return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
}