// const Rx = require('rxjs');

// //example promise that will resolve or reject based on input
// const myPromise = (willReject) => {
//     return new Promise((resolve, reject) => {
//       if(willReject){
//         reject('Rejected!');
//     }
//     resolve('Resolved!');
//   })
// }
// //emit true, then false
// const source = Rx.Observable.of(true, false);
// const example = source
//     .mergeMap(val => Rx.Observable
//       //turn promise into observable
//       .fromPromise(myPromise(val))
//     //catch and gracefully handle rejections
//       .catch(error => Rx.Observable.of(`Error: ${error}`)))
// //output: 'Error: Rejected!', 'Resolved!'
// const subscribe = example.subscribe(val => console.log(val));

// var letters = Rx.Observable.of('a', 'b', 'c');
// var result = letters.mergeMap(x =>
//   Rx.Observable.interval(1000).map(i => x+i)
// );
// result.subscribe(x => console.log(x));


const crypto = require('crypto')
const sign = crypto.createSign('RSA-SHA256')

sign.update('just buy if you have enough money')
const privateKey = '-----BEGIN EC PRIVATE KEY-----\n' +
        'MHcCAQEEIF+jnWY1D5kbVYDNvxxo/Y+ku2uJPDwS0r/VuPZQrjjVoAoGCCqGSM49\n' +
        'AwEHoUQDQgAEurOxfSxmqIRYzJVagdZfMMSjRNNhB8i3mXyIMq704m2m52FdfKZ2\n' +
        'pQhByd5eyj3lgZ7m7jbchtdgyOF8Io/1ng==\n' +
        '-----END EC PRIVATE KEY-----\n';
const input = sign.sign(privateKey, 'hex')
console.log(input)

const verify = crypto.createVerify('RSA-SHA256')
verify.update('just buy if you have enough money')
const valid = verify.verify(privateKey, input)
console.log(valid);
