/* Block comment
JavaScript example (week 2)
*/

// Inline comment

let num1 = 100; // defining an integer

function foo() {        // concept of scoping --> num2 not available outside
    let num2 = 200      // of the function
    num3 = num1 + num2  // yet, we can access global variable
    console.log(num3)
};

foo();  // calling the function

console.log(num1);
console.log(foo())

// JS also has anonymous functions
let annonfun1 = function() {     // one way
    console.log('hello');
}

let annonfun2 = () => console.log('hello');  // another way (arrow function)

let person = 'Summer';
function people(people_name) {
    console.log('Hello ' + people_name);
}
people(person);


// Arrays
let arr = ['foo', 123, ['zar', 'bar']];     // define
console.log(arr[2][0])                      // call
arr.push('car')                             // add
console.log(arr)
arr.splice(2, 1)                            // remove (index, deletecount)
console.log(arr)

// for-loops
for (let x of arr) {
    console.log(x)
};
for (let i in arr) {
    console.log(i + ' ' + arr[i])
};

// loop through each item in the array
arr.forEach((item, i) => console.log(i + ' ' + item));

// Objects
let obj1 = {
    name: 'Jill',
    age: 85,
    job: 'Cactus Hunter'
};
console.log(obj1.name)  // access attribute
console.log(obj1['job'])
obj1.job = 'Barista'    // assign attribute
obj1.pet = 'Bo'
console.log(obj1)

for (let key in obj1) {
    let value = obj1[key];
    console.log(`${key}:${value}`)
}

for (let i = 0; i < 10; i++) {   // ranges
    console.log(i)
}

x = 12

if (x > 50) {       // If-elif-else statements
    console.log('Above Average');
} else if (x > 5) {
    console.log('Below Average')
} else {
    console.log('Really Below Average')
}


// Traversing the DOM (from the HTML file, finds the example div)
let example = document.getElementById('example');

example.innerHTML += "Hello World"; // add (make sure js gets called after the div in html-file)