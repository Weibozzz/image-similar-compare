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
//循环中如果后一个Promise的执行依赖与前一个Promise的执行结果(即必要等当前Promise执行完了再进行下次循环)
//es6解决方案
/*function compareResult (fileNames) {
    let arr = [];
    let j = 0;
    function arrPush(compareTarget, compareTargetImage) {
        return new Promise(resolve => {
            Promise.all([target, compareTarget]).then((results) => {
                const dist = hamming(results[0], results[1]);
                arr.push({
                    image: compareTargetImage,
                    similar: dist
                });
                resolve(dist);
            })
        })
    }
    for (let i = 0; i < fileNames.length; i++) {
        const compareTargetImage = fileNames[i];
        const compareTarget = imghash.hash(compareTargetImage);
        arrPush(compareTarget, compareTargetImage).then((dist)=>{
            if(dist!==undefined){
                j++;
                arrPush(compareTarget, compareTargetImage)
                
            }
        })
    }
    console.log(j)
    // return arr;
}
compareResult(fileNames)*/
// es7解决方案
/*async function compareResult(fileNames) {
    let arr = [];

    function arrPush(compareTarget, compareTargetImage) {
        return new Promise(resolve => {
            Promise.all([target, compareTarget]).then((results) => {
                const dist = hamming(results[0], results[1]);
                arr.push({
                    image: compareTargetImage,
                    similar: dist
                });
                resolve();
            })
        })
    }

    for (let i = 0; i < fileNames.length; i++) {
        const compareTargetImage = fileNames[i];
        const compareTarget = imghash.hash(compareTargetImage);
        await arrPush(compareTarget, compareTargetImage)
    }
    return arr;
}
compareResult(fileNames).then((arr) => {
    console.log(arr.sort((a, b) => {
        return a.similar - b.similar
    }))
});*/
async function compareResult(fileNames) {
    let arr = [];

    function arrPush(i) {
        const compareTargetImage = fileNames[i];
        const compareTarget = imghash.hash(compareTargetImage);
        console.log(i)
        return new Promise(resolve => {
            Promise.all([target, compareTarget]).then((results) => {
                const dist = hamming(results[0], results[1]);
                arr.push({
                    image: compareTargetImage,
                    similar: dist
                });
                resolve();
            })
        })
    }

    new Promise(function(resolve){
        resolve();
    }).then(()=>{
        for (let i = 0; i < fileNames.length; i++) {
            arrPush(i)
        }
    }).then(()=>{
        console.log(arr)
        return arr;
    })

}
compareResult(fileNames)
console.log(123)