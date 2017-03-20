import fs from 'fs';
import xlsx from 'node-xlsx';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import request from 'superagent';

var list = xlsx.parse('0.xlsx');
var sheet = list[0];
var tasks = sheet.data;

var host = 'http://restapi.amap.com/v3/geocode/geo';
const apikey = '87453539f02a65cd6585210fa2e64dc9';

async function _fetch(task) {
  const url = `${host}?key=${apikey}&output=JSON&city=${encodeURI(task[1])}&address=${encodeURI(task[4])}`;
  const data = await fetch(url).then(res => res.json());
  return { task, data }
}

async function main(tasks) {
  return await tasks.slice(1,3).map( task => _fetch(task))
}

main(tasks).then(arr => {
  Promise.all(arr).then(results => {
    const data = results.map((r) => {
      const { task, data } = r;
      task.push(data.geocodes[0].location);
      return task;
    })
    const buffer = xlsx.build([{name: "mySheetName", data: data}]);
    fs.writeFile('1.xlsx', buffer);
  })
})

// Promise.map(tasks.slice(1,3), (task)=> {
//   return _fetch(task);
// }).then(results => {
//   const data = results.map((r) => {
//     const { task, data } = r;
//     task.push(data.geocodes[0].location);
//     return task;
//   })
//   const buffer = xlsx.build([{name: "mySheetName", data: data}]);
//   fs.writeFile('1.xlsx', buffer);
// })
// 

// 有空请补课： generator, co , how babel transforms code

// better async / promise usage
// updated @2017.03.03   *** 记住 Promise.all 的返回结果是一个promise, async function 返回的结果也是一个promise *** 
// 要点1： async 和 await 的配套使用, 如果方法的返回结果就是唯一await的值, eg return await fetch(...), 可以省略await
// 要点2:  async 和 Promise.all 的配套使用
// const makePromise = async (then) => {
//    const data = await fetch(url).ten(res => res.json)
//    return data
// }
// const newData = await Promise.all(data.map(makePromise))
// const newData = await Promise.map(data, makePromise)




