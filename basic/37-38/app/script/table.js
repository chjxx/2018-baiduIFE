const TITLE = { // 给原数据某些属性加中文
  region: '地区',
  product: '商品'
};

export default class Table{
  constructor(id){
    this.$container = document.querySelector(id);
    this.$tips = this.$container.querySelector('.tips');
    this.$content = this.$container.querySelector('.wrapper');
    this.$tips.innerText = '请输入纯数字!!'
    this.$content.innerHTML = `选项不足!`;
    this.handler = [];
  }
  render(data){
    let self = this;

    if(!data){
      this.$content.innerHTML = `选项不足!`;
    }else{
      this.$content.innerHTML = `<table>
        <thead><tr>${generateTitel(data.title)}</tr></thead>
        <tbody>${generateBody(data.body)}</tbody>
      </table>`;
      this.$table = this.$content.querySelector('table');
      this.emit('rendered', this);
      this.addEvent();
    }
  }
  addEvent(){
    let self = this;
    let partten = /^[1-9][0-9]*$/;
    let previousInnerText;

    this.$table.addEventListener('mouseover', e =>{
      self.emit('mouseover', e, self);
    });

    this.$table.addEventListener('mouseout', e =>{
      self.emit('mouseout', e, self);
    });

    this.$table.addEventListener('click', e =>{
      if(e.target.tagName === 'I'){
        let $i = e.target;
        let $span = $i.parentNode.querySelector('span');

        if($i.classList.contains('edit')){
          $span.focus();
        }else if($i.classList.contains('finish')){
          $span.blur();
        }
      }
    });

    this.$table.addEventListener('focus', e =>{
      let $span = e.target;
      let $i = $span.parentNode.querySelector('i');

      if($i.classList.contains('edit')){
        $i.classList.remove('edit');
        $i.classList.add('finish');
      }

      previousInnerText = $span.innerText.trim();// 有bug
    }, true);

    this.$table.addEventListener('blur', e =>{
      let $span = e.target;
      let innerText = $span.innerText.trim();

      if(!partten.test(innerText)){
        $span.focus();
        showTips(self.$tips, 3000);
      }else{
        let $i = e.target.parentNode.querySelector('i');
        if($i.classList.contains('finish')){
          $i.classList.remove('finish');
          $i.classList.add('edit');
        }
        if(previousInnerText !== $span.innerText.trim()){ // 有bug
          let $tr = searchParent(e.target, 'TR');
          let $trData = self.getRowData($tr);

          self.emit('changed', $trData, self);

          function searchParent($elm, tagName){
            if($elm){
              if($elm.tagName !== tagName){
                let $parentNode = $elm.parentNode;
                return searchParent($parentNode, tagName);
              }else{
                return $elm;
              }
            }
          }
        }
      }
    }, true);

    this.$table.addEventListener('keydown', e =>{
      if(e.key === 'Enter' || e.key === 'Escape'){
        let $span = e.target;
        $span.blur();
        e.preventDefault()
      }
    })
  }
  watch(type, ...funcs){
    if(!this.handler[type]){
      this.handler[type] = [];
    }
    this.handler[type].push(...funcs);
  }
  emit(type, ...args){
    if(this.handler[type]){
      this.handler[type].forEach(func => func(...args))
    }
  }
  getRowData($tr){
    let self = this;
    let $tds = $tr.querySelectorAll('td');
    let chunk = extractData($tds);
    let category = getCategory($tr, $tds.length);

    let data = {
      category: category,
      chunk: chunk
    };

    return data

    if(data) bar.render(data);

    function extractData($items){
      if($items.length){
        return Array.from($items).reduce((data, $item) =>{
          let num = Number.parseFloat($item.innerText.trim());

          data.push(Number.isNaN(num) ? 0 : num);

          return data;
        }, []);
      }
    }

    function getCategory($tr, tdLength){
      let $titles = self.$table.querySelectorAll('thead th');
      let maxTitleLength = $titles.length;
      let dataLength = $tr.querySelectorAll('td').length;
      let category = roll($tr, dataLength);

      return category;

      function roll($tr, prevLength, categoryData = []){
        let trLength = $tr.children.length;

        if(trLength > prevLength){
          let t = trLength - prevLength;

          for(let i = 1; i <= t; i++){
            categoryData.unshift($tr.children[t - i].innerText.trim());
          }
        }

        if(maxTitleLength === trLength){

          return categoryData.reduce((category, text, idx) =>{
            let title = $titles[idx].innerText.trim();
            category.push([title, text]);

            return category;
          }, []);

        }else{
          return roll($tr.previousElementSibling, trLength, categoryData);
        }
      }
    }
  }
  getTableData(){
    let $trItems = this.$table.querySelectorAll('tbody tr');

    return Array.from($trItems).map($tr => this.getRowData($tr), this);
  }
}

function generateTitel(data){
  return data.reduce((innerHTML, next) => innerHTML + `<th>${next}</th>`, '');
}

function generateBody(data){

  return roll({data: data, root: true});

  function roll({data, root, head}){
    if(data instanceof Array){
      return data.reduce((sumStr, next, idx) =>{
        head = root ? true : (idx === 0 ? false : true);
        return sumStr + roll({data: next, head: head})
     }, '');
    }else{
      if(head){
        if(data.options instanceof Array){
          return `<tr><th rowspan="${data.options.length}">${data.val}</th>${roll({data: data.options})}</tr>`;
        }else if(data.sale instanceof Array){
          return `<tr><th>${data.val}</th>${data.sale.reduce((str, next) => `${str}<td><span contentEditable='true'>${next}</span><i class="edit"></i></td>`, '')}</tr>`;
        }
      }else{
        if(data.options instanceof Array){
          return `<th rowspan="${data.options.length}">${data.val}</th>${roll({data: data.options})}`;
        }else if(data.sale instanceof Array){
          return `<th>${data.val}</th>${data.sale.reduce((str, next) => `${str}<td><span contentEditable='true'>${next}</span><i class="edit"></i></td>`, '')}`;
        }
      }
    }
  }
}

function showTips($elm, circle = 5000){
  let last = new Date();

  return requestAnimationFrame(function main(){
    let now = new Date();
    let opacity = 1 - (now - last) / circle;
    if($elm.style.display !== 'block'){
      $elm.style.display = 'block';
    }

    $elm.style.opacity = opacity;

    if(opacity <= 0){
      $elm.style.display = 'none';
    }else{
      requestAnimationFrame(main);
    }
  });
}