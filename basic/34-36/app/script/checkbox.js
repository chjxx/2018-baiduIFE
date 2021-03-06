const CLASSNAME = { // 类名汇总
	title: 'title',
	checkAll: 'check-all',
	checkAllChosen: 'check-all_chosen',
	option: 'option',
	optionChosen: 'option_chosen'
}

export default class Checkbox{
	constructor(id){
		this.$container = document.querySelector(id);
		this.addEventListener();
		this.handler = [];
	}
	render(optsObj){
		this.optsObj = optsObj;

		for(let prop in optsObj){
			if(optsObj.hasOwnProperty(prop)){
				this.$container.innerHTML = this.$container.innerHTML + generateOptBar(optsObj, prop);
			}
		}

		function generateOptBar(optsObj, prop){
			return `<div class="${prop}">
				<p class="${CLASSNAME.title}">${optsObj[prop].title}</p>
				<a href="javascript:;" class="${CLASSNAME.checkAll}" data-class-trigger="${CLASSNAME.checkAllChosen}">全选</a>
				${generateOpt(optsObj[prop].options)}
			</div>`;

			function generateOpt(options){
				return options.reduce((innerHTML, option) => {
					return innerHTML + `<a href="javascript:;" class="${CLASSNAME.option}" data-class-trigger="${CLASSNAME.optionChosen}">${option}</a>`;
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

				if(className.indexOf(CLASSNAME.checkAll) !== -1){ // 如果是全选按钮
					if(className === CLASSNAME.checkAll){ // 如果全选行未选中
						let $options = $parentElm.querySelectorAll('.' + CLASSNAME.option);

						trigging($elm); // 改变全选按钮样式
						Array.from($options).forEach(($option) => { // 选中所有未选中选项
							trigging($option);
						});

						self.emit('changed', self);
					}
				}else{ // 如果是选项按钮
					if(className === CLASSNAME.optionChosen){ // 如果选项是选中状态
						let $checkAllBtn = $parentElm.querySelector('.' + CLASSNAME.checkAllChosen);
						let $chosenOptions = $parentElm.querySelectorAll('.' + CLASSNAME.optionChosen);

						if($chosenOptions.length === 1) return;

				  	trigging($elm); // 改变选项按钮样式

						if($checkAllBtn){ // 如果全选按钮有选中，则取消选中
							trigging($checkAllBtn);
						}

						self.emit('changed', self);
					}else{
						trigging($elm); // 改变选项按钮样式

						let $options = $parentElm.querySelectorAll('.' + CLASSNAME.option);
						let $checkAllBtn = $parentElm.querySelector('.' + CLASSNAME.checkAll);

						if($options.length === 0){
							trigging($checkAllBtn);
						}

						self.emit('changed', self);
					}
				}
			}

			function trigging($elm){
				let className = $elm.dataset.classTrigger;
				$elm.dataset.classTrigger = $elm.className;
				$elm.className = className;
			}
		});
	}
	getChosenOptionsData(){
		let $optionBars = this.$container.querySelectorAll('div');

		return Array.from($optionBars).reduce((chosenOptionData, $optionBar) => {
			let $chosenOptions = $optionBar.querySelectorAll('.' + CLASSNAME.optionChosen);
			let contents = Array.from($chosenOptions).reduce((arr, $chosenOption) => {
				arr.push($chosenOption.innerText.trim());
				return arr;
			}, []);

			chosenOptionData[$optionBar.className] = contents;

			return chosenOptionData;
		}, {});
	}
	watch(type, ...funcs){
		if(!this.handler[type]){
			this.handler[type] = [];
		}
		this.handler[type].push(...funcs);
	}
	emit(type, self){ // 选项改变后触发.
		if(this.handler[type]){
			this.handler[type].forEach((func) => func(self));
		}
	}
}
