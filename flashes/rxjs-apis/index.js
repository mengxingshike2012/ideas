const Rx = require('rxjs');
const fs = require('fs')


var timer1 = Rx.Observable.interval(1000).take(10)
var timer2 = Rx.Observable.interval(2000).take(6)
var timer3 = Rx.Observable.interval(500).take(10)

var concurrent = 2
var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent)
// merged.subscribe(x => console.log(x))


var readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile)

var result = readFileAsObservable('./package.json', 'utf8');
result.subscribe(x => console.log(x), e => console.error(e));


const AP = Promise.reslove(5);
var r = Rx.Observable.fromPromise(AP);

r.subscribe(x => console.log(x))