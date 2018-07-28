let data = {
  TSFixed: {
    flexL: {
      styleName: 'TSF-flexL'
    },
    floatL: {
      styleName: 'TSF-floatL'
    },
    inlineL: {
      styleName: 'TSF-inlineL'
    }
  },
  LFixed: {
    flexL: {
      styleName: 'LF-flexL'
    },
    floatL: {
      styleName: 'LF-floatL'
    },
    inlineL: {
      styleName: 'LF-inlineL'
    }
  },
  RFixed: {
    flexL: {
      styleName: 'RF-flexL',
      contentBlock: ['main', 'subs']
    },
    floatL: {
      styleName: 'RF-floatL',
      contentBlock: ['main', 'subs']
    },
    inlineL: {
      styleName: 'RF-inlineL',
      contentBlock: ['main', 'subs']
    }
  },
  LRFixed: {
    flexL: {
      styleName: 'LRF-flexL',
      contentBlock: ['subs', 'main', 'aside']
    },
    floatL: {
      styleName: 'LRF-floatL',
      contentBlock: ['main', 'subs', 'aside']
    },
    inlineL: {
      styleName: 'LRF-inlineL',
      contentBlock: ['subs', 'main', 'aside']
    }
  },
  LCFixed: {
    flexL: {
      styleName: 'LCF-flexL',
      contentBlock: ['subs', 'main', 'aside']
    },
    // floatL: {
    //   styleName: 'LCF-floatL',
    //   contentBlock: ['aside', 'subs', 'main']
    // },
    inlineL: {
      styleName: 'LCF-inlineL',
      contentBlock: ['subs', 'main', 'aside']
    }
  }
};

window.onload = function(){
  let $control = document.querySelector('.control');
  let $box = document.querySelector('.box');
  let $layout = $control.querySelector('.layout');
  let $pattern = $control.querySelector('.pattern');
  let $patternes = $pattern.querySelectorAll('input');

  $control.addEventListener('click', (e) => {
    if(e.target.tagName !== 'INPUT') return; //不是单选项不处理

    if(e.target.parentElement.parentElement.className === 'layout'){ //处理点击布局选项后的模式选项
      let layoutName = e.target.id;

      handlePatternElm(layoutName, $patternes);
    }

    let selectedLayoutElm = $layout.querySelector('input:checked');
    let selectedPatternElm = $pattern.querySelector('input:checked');

    $box.innerHTML = '';

    if(selectedLayoutElm && selectedPatternElm){
      render(selectedLayoutElm.id, selectedPatternElm.id);
    }else{
      let $template = document.querySelector('#temp');
      let elm = $template.content.querySelector('.empty');
      $box.appendChild(document.importNode(elm, true));
    }

    function handlePatternElm(layoutName, $patternes){
      let layout = data[layoutName] ? data[layoutName] : {};

      Array.from($patternes).forEach(($pattern, idx) => { //遍历模式元素，调整当前布局该有的模式
        if(Object.keys(layout).indexOf($pattern.id) !== -1){
          $pattern.disabled = false;
        }else{
          $pattern.checked = false; //如果之前有选中的话就取消
          $pattern.disabled = true;
        }
      });
    }

    function render(layoutName, patternName){
      let $template = document.querySelector('#temp');
      let styleName = data[layoutName][patternName].styleName;
      let $containerT = $template.content.querySelector('#container');
      let $contentT = $containerT.querySelector('#content');
      let $subsT = $template.content.querySelector('#subs');
      let $mainT = $template.content.querySelector('#main');
      let contentBlock = data[layoutName][patternName].contentBlock;

      $contentT.className = styleName;
      $contentT.innerHTML = '';

      if(contentBlock){
        contentBlock.forEach((blockName, idx) => {
          let $elmT = $template.content.querySelector(`#${blockName}`);
          $contentT.appendChild(document.importNode($elmT, true));
        });
      }else{
        $contentT.appendChild(document.importNode($subsT, true));
        $contentT.appendChild(document.importNode($mainT, true));
      }

      Array.from($containerT.children).forEach((elmT, idx) => {
        $box.appendChild(document.importNode(elmT, true));
      });
    }
  });
}