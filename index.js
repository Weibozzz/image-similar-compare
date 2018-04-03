const imghash = require('imghash');
const hamming = require('hamming-distance');
let fs = require('fs');
let paths = require('path');
let join = paths.join;

function findSync(startPath) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) {
                result.push(fPath)
            }
        });

    }
    finder(startPath);
    return result;
}

let fileNames = findSync('./images');//所有的图片路径

const targetImage = './compare-target.jpg';
const target = imghash.hash(targetImage);

function compareResult (fileNames) {
    let arr = [];

    for (let i = 0; i < fileNames.length; i++) {
        ((i)=>{
            const compareTargetImage = fileNames[i];
            const compareTarget = imghash.hash(compareTargetImage);
            Promise
                .all([target, compareTarget])
                .then((results) => {
                    const dist = hamming(results[0], results[1]);
                    console.log(`${compareTargetImage}Distance between images is: ${dist}`);
                    arr.push({
                        image:compareTargetImage,
                        similar:dist
                    })

                })
        })(i)
    }
}
console.log(compareResult(fileNames))
