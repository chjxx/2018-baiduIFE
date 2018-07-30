const TITLE = { // 给原数据某些属性加中文
	region: '地区',
	product: '商品'
};

const CLASSNAME = { // 类名汇总
	title: 'tt',
	all: 'all_btn',
	allSeld: 'all_btn_seld',
	item: 'item',
	itemSeld: 'item_seld'
}

export default class Checkbox{
	constructor(id){
		this.$container = document.querySelector(id);
		this.addEventListener();
		this.handler = [];
	}
	generateElm(selData){
		this.selData = selData;
		this.$container.innerHTML = this.selData.reduce((str, next) => {
				return str + generateSelBar(next);
		}, '');

		function generateSelBar(data){
			return `<div class="${data.name}">
				<p class="${CLASSNAME.title}">${getTitle(data.name)}:</p>
				<a href="javascript:;" class="${CLASSNAME.all}" data-trigger="${CLASSNAME.allSeld}">全选</a>
				${generateItem(data.sel)}
			</div>`;

			function getTitle(name){
				return TITLE[name] ? TITLE[name] : name;
			}

			function generateItem(arr){
				return arr.reduce((str, next, idx) => {
					return str + `<a href="javascript:;" class="${CLASSNAME.item}" data-trigger="${CLASSNAME.itemSeld}">${next}</a>`;
				}, '');
			}
		}
	}
	addEventListener(){
		let self = this;
		this.$container.addEventListener('click', (e) => { // 标签换样式
			let $elm = e.target;

			if($elm.tagName === 'A'){
				let $parentElm = $elm.parentNode;
				let className = $elm.className;

				if(className.indexOf(CLASSNAME.all) !== -1){ // 如果是全选按钮
					if(className === CLASSNAME.all){ // 如果全选行未选中
						let $itemElms = $parentElm.querySelectorAll('.' + CLASSNAME.item);

						trigger($elm); // 改变全选按钮样式
						Array.from($itemElms).forEach(($itemElm) => { // 选中所有未选中选项
							trigger($itemElm);
						});

						self.runHandler('datachange', self);
					}
				}else{ // 如果是选项按钮
					if(className === CLASSNAME.itemSeld){ // 如果选项是未选中状态
						let $allSeldBtn = $parentElm.querySelector('.' + CLASSNAME.allSeld);
						let $itemSeldElms = $parentElm.querySelectorAll('.' + CLASSNAME.itemSeld);

						if($itemSeldElms.length === 1) return;

				  	trigger($elm); // 改变选项按钮样式

						if($allSeldBtn){ // 如果全选按钮有选中，则取消选中
							trigger($allSeldBtn);
						}

						self.runHandler('datachange', self);
					}else{
						trigger($elm); // 改变选项按钮样式

						let $itemElms = $parentElm.querySelectorAll('.' + CLASSNAME.item);
						let $allBtn = $parentElm.querySelector('.' + CLASSNAME.all);

						if($itemElms.length === 0){
							trigger($allBtn);
						}

						self.runHandler('datachange', self);
					}
				}
			}

			function trigger($elm){
				let className = $elm.dataset.trigger;
				$elm.dataset.trigger = $elm.className;
				$elm.className = className;
			}
		});
	}
	getSeldItems(){
		let $selLvOneElms = this.$container.querySelectorAll('div');

		return Array.from($selLvOneElms).reduce((data, $selLvOneElm) => {
			let $seldItems = $selLvOneElm.querySelectorAll('.' + CLASSNAME.itemSeld);
			let contents = Array.from($seldItems).reduce((arr, $seldItem) => {
				arr.push($seldItem.innerText.trim());
				return arr;
			}, []);

			data[$selLvOneElm.className] = contents;

			return data;
		}, {});
	}
	addHandler(type, ...funcs){
		if(!(this.handler[type] instanceof Array)){
			this.handler[type] = [];
		}
		this.handler[type].push(...funcs);
	}
	runHandler(type, self){ // 选项改变后触发.
		if(this.handler[type] instanceof Array){
			this.handler[type].forEach((func, idx) => {
				func(self);
			});
		}
	}
}
