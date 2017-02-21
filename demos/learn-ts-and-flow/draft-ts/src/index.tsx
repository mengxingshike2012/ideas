// import * as React from 'react';
// import * as ReactDOM from 'react-dom';

// import { Hello } from './components/Hello';

// ReactDOM.render(
//   <Hello compiler="TypeScript" framework="React" />,
//   document.getElementById('root')
// );

function sayHello(person: string) {
  return 'Hello, ' + person
}

let user = 'kkk'
document.body.innerHTML = sayHello(user)
