let postfixList = ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'];

window.onload = function(){
  let $input = document.querySelector('#email-input');
  let $ul = document.querySelector('#email-sug-wrapper');
  let sugCtrl = new SugCtrl('#email-sug-wrapper');

  $input.addEventListener('input', (e) => { //没有输入值则不会触发，事件对象没有keycode属性
    let inputVal = $input.value.trim();
    let headVal, footVal;
    let idx = inputVal.indexOf('@');

    sugCtrl.clearList();

    if(idx !== -1 ){ // 有@就分成前后部分
      footVal = inputVal.slice(idx + 1);
      headVal = inputVal.slice(0, idx);
    }else{
      headVal = inputVal;
    }

    if(headVal === '') return; // 无论footVal有没有，headVal没有则不处理

    sugCtrl.updateList(headVal, footVal); // 更新提示
  });

  $input.addEventListener('keydown', (e) => { // 事件对象有keycode属性
    let key = ['ArrowDown', 'ArrowUp', 'Enter'];
    let keyIdx = key.indexOf(e.key);

    if(keyIdx !== -1 && $ul.children.length !== 0){
      if(keyIdx === 0){
        sugCtrl.next();
      }else if(keyIdx === 1){
        sugCtrl.previous();
      }else if(keyIdx === 2){
        let text = sugCtrl.getSelectedItem().innerText; //
        sugCtrl.clearList();
        $input.value = text;
      }
      e.preventDefault();
    }
  });

  $ul.addEventListener('click', (e) => {
    if(e.target.tagName === 'LI'){
      let text = e.target.innerText;
      sugCtrl.clearList();
      $input.value = text;
      $input.focus();
    }
  });
};

class SugCtrl{
  constructor(id){
    this.$container = document.querySelector(id);
    this.$liItems = this.$container.getElementsByTagName('li');
  }
  getSelectedItem(){
    return this.$container.querySelector('.selected');
  }
  getSelectedItemIdx(){
    return Array.from(this.$liItems).indexOf(this.getSelectedItem());
  }
  turnTo(idx){
    let $seldItem = this.getSelectedItem();

    if($seldItem){
      $seldItem.className = '';
    }

    this.$liItems[idx].className = 'selected';
  }
  next(){
    let idx = this.getSelectedItemIdx();

    this.turnTo((idx + 1) % this.$liItems.length);
  }
  previous(){
    let idx = this.getSelectedItemIdx();
    this.turnTo((idx - 1 + this.$liItems.length) % this.$liItems.length);
  }
  updateList(headVal, footVal){
    let notMatch = true;

    headVal = translate(headVal); // 转义字符串中的特殊字符

    this.$container.innerHTML = postfixList.reduce((sum, next) => {
      if(notMatch === true){
        if(footVal !== undefined && next.indexOf(footVal) === 0){
          sum = ''; //清除之前拥有的
          notMatch = false;
        }
        sum += `<li>${headVal + '@' + next}</li>`;
      }else{
        if(next.indexOf(footVal) === 0){
          sum += `<li>${headVal + '@' + next}</li>`;
        }
      }

      return sum;
    }, '');

    this.turnTo(0);

    function translate(innerText){
      innerText = innerText.replace(/&/g, '&amp;');
      innerText = innerText.replace(/</g, '&lt;');
      innerText = innerText.replace(/>/g, '&gt;');
      return innerText;
    }
  }
  clearList(){
    this.$container.innerHTML = '';
  }
}