const bannerContentPosition = ['content-item1', 'content-item2', 'content-item3', 'content-item4'];

class Book{
  constructor(id){
    this.$container = document.querySelector(id);
    this.$contentItem = this.$container.querySelectorAll('.content-item, .content-item_selected');
    this.handler = [];
  }
  getSelectedItem(){
    return this.$container.querySelector('.content-item_selected');
  }
  getSelectedItemIdx(){
    return Array.from(this.$contentItem).indexOf(this.getSelectedItem());
  }
  turnTo(idx){
    let selectedItem = this.getSelectedItem();

    if(selectedItem){
      selectedItem.className = 'content-item';
    }

    let idxItem = this.$contentItem[idx];

    if(idxItem){
      idxItem.className = 'content-item_selected';
    }

    this.handler.forEach((fn) => {
      fn(idx);
    });
  }
  roll(circle = 3000){
    let self = this;
    this.timer = setInterval(() => {
      let selectedIdx = self.getSelectedItemIdx();
      self.turnTo(++selectedIdx % self.$contentItem.length);
    }, circle);
  }
  plugins(...fns){
    let self = this;
    fns.forEach((fn) => {fn(self)});
  }
}

function bannerControl(banner){
  let $controlBar = banner.$container.querySelector('.control');
  let $controlItem = $controlBar.querySelectorAll('.control-item, .control-item_selected');

  $controlBar.addEventListener('click', (e) => {
    if(e.target.className === 'control-item'){
      let idx = Array.from($controlItem).indexOf(e.target);
      banner.turnTo(idx);
    }
  });

  banner.handler.push(function(idx){
    let selectedItem = $controlBar.querySelector('.control-item_selected');
    let idxItem = $controlItem[idx];

    if(selectedItem){
      selectedItem.className = 'control-item';
    }

    if(idxItem){
      idxItem.className = 'control-item_selected';
    }
  });

  banner.handler.push(function(idx){
    let $content = banner.$container.querySelector('.content');
    let idxClassname = bannerContentPosition[idx];

    if(idxClassname && !$content.classList.contains(idxClassname)){
      $content.className = `content ${idxClassname}`;
    }
  });
}


function pageControl(page){
  let $controlBar = page.$container.querySelector('.control');
  let $controlItem = $controlBar.querySelectorAll('.control-item, .control-item_selected');

  $controlBar.addEventListener('click', (e) => {
    if(e.target.className === 'control-item'){
      let idx = Array.from($controlItem).indexOf(e.target);
      page.turnTo(idx);
    }
  });
  page.handler.push(function(idx){
    let selectedItem = $controlBar.querySelector('.control-item_selected');
    let idxItem = $controlItem[idx];

    if(selectedItem){
      selectedItem.className = 'control-item';
    }

    if(idxItem){
      idxItem.className = 'control-item_selected';
    }
  })
}


window.onload = function(){
  let banner = new Book('#banner');
  let page = new Book('#page');
  banner.plugins(bannerControl);
  banner.roll();
  page.plugins(pageControl);
}