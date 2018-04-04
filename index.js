const imghash = require('imghash')
const hamming = require('hamming-distance')
let fs = require('fs')
let paths = require('path')
let join = paths.join

function findSync (startPath) {
    let result = []

    function finder (path) {
        let files = fs.readdirSync(path)
        files.forEach((val, index) => {
            let fPath = join(path, val)
            let stats = fs.statSync(fPath)
            if (stats.isDirectory()) finder(fPath)
            if (stats.isFile()) {
                result.push(fPath)
            }
        })

    }

    finder(startPath)
    return result
}

let fileNames = findSync('./images')//所有的图片路径

const targetImage = './compare-target.jpg'
const target = imghash.hash(targetImage)

//es6解决方案
// 让for循环中的Promise全部完成后执行某个操作
/*function compareResult (fileNames) {
    let arr = []

    function arrPush (i) {
        const compareTargetImage = fileNames[i]
        const compareTarget = imghash.hash(compareTargetImage)
        return new Promise(resolve => {
            Promise.all([target, compareTarget]).then((results) => {
                const dist = hamming(results[0], results[1])
                arr.push({
                    image: compareTargetImage,
                    similar: dist
                })
                resolve()
            })
        })
    }

    return new Promise(resolve => {
        Promise.all(fileNames.map((item, i) => arrPush(i))).then(() => {
            resolve(arr)
        })
    })

}
compareResult(fileNames).then(arr => {
    console.log(arr)
})*/
// 循环中如果后一个Promise的执行依赖与前一个Promise的执行结果(即必要等当前Promise执行完了再进行下次循环)
/*function compareResult (fileNames) {
    let arr = []

    function arrPush (i) {
        const compareTargetImage = fileNames[i]
        const compareTarget = imghash.hash(compareTargetImage)
        return new Promise((resolve,reject) => {
            Promise.all([target, compareTarget]).then((results) => {
                const dist = hamming(results[0], results[1])
                arr.push({
                    image: compareTargetImage,
                    similar: dist
                })
                resolve(dist)
            })
        })
    }
    return new Promise((resolve, reject) => {
        let i=0;
        function loopSelf () {
            arrPush (i).then(dist=>{
                i++;
                if(i===fileNames.length){
                    resolve(arr)
                    return
                }
                loopSelf()
            })
        }
        loopSelf ()
    });



}
compareResult(fileNames).then(arr=>{
    console.log(arr)
})*/

// es7解决方案
//循环中如果后一个Promise的执行依赖与前一个Promise的执行结果(即必要等当前Promise执行完了再进行下次循环)
async function compareResult(fileNames) {
    let arr = [];

    function arrPush(i) {
        const compareTargetImage = fileNames[i];
        const compareTarget = imghash.hash(compareTargetImage);
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
        let a = await arrPush(i)
        console.log(a)
    }
    return arr;
}
compareResult(fileNames).then((arr) => {
    console.log(arr.sort((a, b) => {
        return a.similar - b.similar
    }))
});



console.log(123)
