import '../style/index.scss';
import Field from './field.js';
import {Player} from './player.js';


let footballField = Field.factory('football', {width: "1000", height: "600", contentId: '.container'});
let footballPlayer1 = Player.factory('football', {explose: 1, maxSpeed: 1, energy: 1});
let footballPlayer2 = Player.factory('football', {explose: 30, maxSpeed: 60, energy: 90});
let footballPlayer3 = Player.factory('football', {explose: 90, maxSpeed: 60, energy: 30});
let footballPlayer4 = Player.factory('football', {explose: 50, maxSpeed: 50, energy: 50});
let footballPlayer5 = Player.factory('football', {explose: 50, maxSpeed: 70});
let footballPlayer6 = Player.factory('football', {explose: 99, maxSpeed: 99, energy: 99})

footballField.addPlayer(footballPlayer1);
footballField.addPlayer(footballPlayer2);
footballField.addPlayer(footballPlayer3);
footballField.addPlayer(footballPlayer4);
footballField.addPlayer(footballPlayer5);
footballField.addPlayer(footballPlayer6);

footballPlayer1.setStartPoint(100, 100);
footballPlayer2.setStartPoint(100, 180);
footballPlayer3.setStartPoint(100, 260);
footballPlayer4.setStartPoint(100, 340);
footballPlayer5.setStartPoint(100, 420);
footballPlayer6.setStartPoint(100, 500);

let pro = async function(){
  footballPlayer1.runTo(800, 100);
  footballPlayer2.runTo(800, 180);
  footballPlayer3.runTo(800, 260);
  footballPlayer4.runTo(800, 340);
  footballPlayer5.runTo(800, 420);
  footballPlayer6.runTo(800, 500);
}

pro();