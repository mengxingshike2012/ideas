// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import { Hello } from './components/Hello';
// ReactDOM.render(
//   <Hello compiler="TypeScript" framework="React" />,
//   document.getElementById('root')
// );
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = [0, 1, 2];
document.body.innerHTML = sayHello(user);
