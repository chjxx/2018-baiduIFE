'use strict'

// ES6
// class Restaurant{
//   constructor({cash, seat, staff}){
//     this.cash = cash;
//     this.seat = seat;
//     this.staff = staff;
//   }
//   hire(...people){
//     this.staff.push(...people);
//   }
//   fire(person){
//     if(person && this.staff.length >= 1){
//       for(let i = this.staff.length - 1; i >= 0; i--){
//         if(person.name === this.staff[i].name){
//           this.staff.splice(i, 1);
//           break;
//         }
//       }
//     }
//   }
// }

// class Staff{
//   constructor(name, salary, work){
//     this.name = name;
//     this.salary = salary;
//     this.work = work;
//   }
// }

// class Waiter extends Staff{
//   constructor(name, salary){
//     let work = function(arg){
//       if(Array.isArray(arg)){
//         order(arg);

//         function order(arg){}
//       }else{
//         serve(arg);

//         function serve(arg){}
//       }
//     };

//     super(name, salary, work);
//   }
// }

// class Cook extends Staff{
//   constructor(name, salary){
//     let work = function(){}

//     super(name, salary, work);
//   }
// }

// class Customer{
//   order(...foods){}
//   eat(){}
// }

// class Food{
//   constructor({name, cost, sale}){
//     this.name= name;
//     this.cost = cost;
//     this.sale = sale;
//   }
// }

// ES5
function Restaurant(obj){
  this.cash = obj.cash;
  this.seat = obj.seat;
  this.staff = obj.staff;
}

Restaurant.prototype.hire = function(person){
  this.staff.push(person);
}

Restaurant.prototype.fire = function(person){
  if(person && this.staff.length >= 1){
    (function(staff, person){
      for(var i = staff.length - 1; i >= 0; i--){
        if(staff[i].name === person.name){
          staff.splice(i, 1);
          break;
        }
      }
    }(this.staff, person));
  }
}

function Staff(name, salary, work){
  this.name = name;
  this.salary = salary;
  this.work = work;
}

function Waiter(name, salary){
  let work = function(arg){
    if(Array.isArray(arg)){
      order(arg);

      function order(arg){}
    }else{
      serve(arg);

      function serve(arg){}
    }
  }
  Staff.apply(this, [name, salary, work]);
}

function Cook(name, salary){
  let work = function(){}

  Staff.apply(this, [name, salary, work]);
}

function Customer(){}

Customer.prototype.order = function(food){};

Customer.prototype.eat = function(food){};

function Food(obj){
  this.name = obj.name;
  this.cost = obj.cost;
  this.sale = obj.sale;
}
