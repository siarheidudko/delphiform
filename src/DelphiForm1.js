/** Delphi Form v1.0.1
 * 
 *
 * Copyright (c) 2018-present, 
 * by Siarhei Dudko (admin@sergdudko.tk).
 *
 * LICENSE MIT.
 */
 
"use strict"

import _ from 'lodash';
import React from 'react';

module.exports = class DelphiForm1 extends React.PureComponent{
  
	constructor(props, context){
		super(props, context);
		this.state = {
			StoreArr: [], //полученные uid элементов
			ObjSearch: {}, //полученный объект uid->name, где name в верхнем регистре
			SearchArr: [], //найденные (отображаемые в левом окне) элементы
			SelectedArr: [], //выбранные (отображаемые в правом окне) элементы
			SearchStr: "" //строка поиска
		};
	}
	
	componentWillMount(){ //загружаем первоначальное состояние компонента
		try{
			let self = this;
			if(typeof(self.props.store) === 'object'){
				let this_StoreArr = [],
				this_store = {SelectedArr:[], ObjSearch:{}},
				StoreArrobject = _.clone(self.props.store);				
				if(typeof(self.props.selected) === 'object'){
					for(let i = 0; i < self.props.selected.length; i++){
						if(typeof(self.props.store[self.props.selected[i]]) !== 'undefined'){
							this_store['SelectedArr'].push(_.clone(self.props.selected[i]));
						}
					}
				}				
				for(let key in StoreArrobject){
					this_store['ObjSearch'][key] = StoreArrobject[key].toUpperCase();
					if(this_store['SelectedArr'].indexOf(key) === -1){
						this_StoreArr.push(key);
					}
				}
				this_store['StoreArr'] = _.clone(this_StoreArr);
				this_store['SearchArr'] = _.clone(this_StoreArr);
				self.setState(this_store);
			}			
		} catch(e){
			window.console.log(e);
		};
	}
	
	componentWillReceiveProps(nextProps){ //при обновлении пропсов перезагружаем состояние компонента
		try{
			let self = this;
			if(typeof(nextProps.store) === 'object'){
				let this_StoreArr = [],
				this_store = {SelectedArr:[], ObjSearch:{}},
				StoreArrobject = _.clone(nextProps.store);				
				if(typeof(nextProps.selected) === 'object'){
					for(let i = 0; i < nextProps.selected.length; i++){
						if(typeof(nextProps.store[nextProps.selected[i]]) !== 'undefined'){
							this_store['SelectedArr'].push(_.clone(nextProps.selected[i]));
						}
					}
				}				
				for(let key in StoreArrobject){
					this_store['ObjSearch'][key] = StoreArrobject[key].toUpperCase();
					if(this_store['SelectedArr'].indexOf(key) === -1){
						this_StoreArr.push(key);
					}
				}
				this_store['StoreArr'] = _.clone(this_StoreArr);
				this_store['SearchArr'] = _.clone(this_StoreArr);
				if(typeof(self.props.callback) === 'function'){
					self.callback = self.props.callback;
				}
				self.setState(this_store);
			}			
		} catch(e){
			window.console.log(e);
		};
	}
      
	componentDidMount() { //при монтировании компонента привязываем функцию обратного вызова
		let self = this;
		if(typeof(self.props.callback) === 'function'){
			self.callback = self.props.callback;
		}
		self.callback(_.clone(self.state.SelectedArr));
	}
	
	componentWillUpdate(nextProps, nextState) { //при обновлении компонента выбрасываем отобраные uid в функцию обратного вызова
		let self = this;
		if (!_.isEqual(nextState.SelectedArr, self.state.SelectedArr)) {
			self.callback(_.clone(nextState.SelectedArr));
		}
	}
	
	onClickHandler(e){
		let self = this;
		let tempstore = JSON.parse(JSON.stringify(self.state));
		switch(e.target.id){
			case 'add':
				if(tempstore['SelectedArr'].indexOf(e.target.name) === -1){
					tempstore['SelectedArr'].push(e.target.name);
				}
				let index_Store = tempstore['StoreArr'].indexOf(e.target.name);
				if(index_Store !== -1){
					tempstore['StoreArr'].splice(index_Store, 1);
				}
				let index_Search = tempstore['SearchArr'].indexOf(e.target.name);
				if(index_Search !== -1){
					tempstore['SearchArr'].splice(index_Search, 1);
				}
				break;
			case 'del':
				let index_Selected = tempstore['SelectedArr'].indexOf(e.target.name);
				if(index_Selected !== -1){
					tempstore['SelectedArr'].splice(index_Selected, 1);
				}
				if(tempstore['StoreArr'].indexOf(e.target.name) === -1){
					tempstore['StoreArr'].push(e.target.name);
				}
				if(tempstore['SearchArr'].indexOf(e.target.name) === -1){
					tempstore['SearchArr'] = _.clone(self.SearchHandler(_.clone(tempstore['StoreArr']), tempstore['SearchStr']));
				}
				break;
		}
		if(!_.isEqual(self.state, tempstore)){
			self.setState(tempstore);
		}
	}
	
	onChangeHandler(e){
		let self = this;
		let tempstore = JSON.parse(JSON.stringify(self.state));
		switch(e.target.name){
			case 'SearchStr':
				tempstore['SearchStr'] = e.target.value;
				tempstore['SearchArr'] = _.clone(self.SearchHandler(_.clone(tempstore['StoreArr']), e.target.value));
				break;
		}
		if(!_.isEqual(self.state, tempstore)){
			self.setState(_.clone(tempstore));
		}
	}
	
	SearchHandler(store, string){  //формирование результатов поиска
		let self = this,
		returnArray = _.clone(store);		
		if(typeof(store) === 'object'){
			if(typeof(string) === 'string'){
				if(string.length > 1){
					returnArray = [];
					for(let i = 0; i < store.length; i++){
						if(self.state.ObjSearch[store[i]].indexOf(string.toUpperCase()) !== -1){
							returnArray.push(store[i]);
						}
					}
				}
			}
		}		
		return returnArray;		
	}
	
	callback(data){
		window.console.log(data);
	}
      
  	render() {
		let DelphiForm = new Array;
		let DelphiFormLeft = new Array;
		let DelphiFormRight= new Array;		
		for(let i = 0; i < this.state.SearchArr.length; i++){
			DelphiFormLeft.push(<div  title={this.props.store[this.state.SearchArr[i]]}><input type="button" className="DelphiForm1Button" onClick={this.onClickHandler.bind(this)} id='add' name={_.clone(this.state.SearchArr[i])} value={this.props.store[this.state.SearchArr[i]]} /></div>);
		}		
		for(let i = 0; i < this.state.SelectedArr.length; i++){
			DelphiFormRight.push(<div  title={this.props.store[this.state.SelectedArr[i]]}><input type="button" className="DelphiForm1Button" onClick={this.onClickHandler.bind(this)} id='del' name={_.clone(this.state.SelectedArr[i])} value={this.props.store[this.state.SelectedArr[i]]} /></div>);
		}
		
		let DelphiFormString = <input type="text" className="DelphiForm1SearchInp" name="SearchStr" onChange={this.onChangeHandler.bind(this)} value={this.state.SearchStr} />;		
		DelphiForm.push(<div className="DelphiForm1SearchString">{DelphiFormString}</div>);
		DelphiForm.push(<div className="DelphiForm1Search">Позиции для отбора<div className="DelphiForm1SearchDiv">{DelphiFormLeft}</div></div>);
		DelphiForm.push(<div className="DelphiForm1Filtr">Отобранные позиции<div className="DelphiForm1FiltrDiv">{DelphiFormRight}</div></div>);			
		return (
			<div className="DelphiForm1">
				<div className="DelphiForm1Name">{this.props.name}</div>
				{DelphiForm}
			</div>
		);
	}
};