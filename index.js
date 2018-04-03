const imghash = require('imghash');
const hamming = require('hamming-distance');

const hash1 = imghash.hash('./images/attacked-color-curved.jpg');
const hash3 = imghash.hash('./images/attacked-padded.jpg');
const hash2 = imghash.hash('./images/attacked-noise.jpg');

Promise
  .all([hash1, hash2,hash3])
  .then((results) => {
    const dist = hamming(results[0], results[1], results[2]);
    console.log(`Distance between images is: ${dist}`);
    if (dist <= 20) {
      console.log('Images are similar');
    } else {
      console.log('Images are NOT similar');
    }
  });