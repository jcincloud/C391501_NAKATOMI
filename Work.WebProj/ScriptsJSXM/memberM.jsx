var GridRow = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
		};  
	},
	delCheck:function(i,chd){
		this.props.delCheck(i,chd);
	},
	modify:function(){
		this.props.updateType(this.props.primKey);
	},
	render:function(){
		return (

				<tr>
					<td className="text-center"><GridCheckDel iKey={this.props.ikey} chd={this.props.itemData.check_del} delCheck={this.delCheck} /></td>
					<td className="text-center"><GridButtonModify iKey={this.props.ikey} modify={this.modify}/></td>

					<td>{this.props.itemData.姓名}</td>
					<td>{this.props.itemData.行動電話}</td>
					<td>{moment(this.props.itemData.入會日期).format('YYYY-MM-DD')}</td>
					<td>{this.props.itemData.排序}</td>
					<td>{this.props.itemData.顯示狀態Flag ? '顯示':'隱藏'}</td>
				</tr>
			);
		}
});

//表單登錄
var GirdForm = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return {
			gridData:{rows:[],page:1},
			fieldData:{},
			searchData:{title:null},
			edit_type:0,
			checkAll:false
		};  
	},
	getDefaultProps:function(){
		return{	
			fdName:'fieldData',
			gdName:'searchData'

		};
	},	
	componentWillMount:function(){
		//在輸出前觸發，只執行一次如果您在這個方法中呼叫 setState() ，會發現雖然 render() 再次被觸發了但它還是只執行一次。
	},
	componentDidMount:function(){
		//只在客戶端執行一次，當渲染完成後立即執行。當生命週期執行到這一步，元件已經俱有 DOM 所以我們可以透過 this.getDOMNode() 來取得 DOM 。
		//如果您想整和其他 Javascript framework ，使用 setTimeout, setInterval, 或者是發動 AJAX 請在這個方法中執行這些動作。
		this.queryGridData(1);
	},
	handleSubmit: function(e) {
		e.preventDefault();

		this.state.fieldData.會員產品 = this.refs.subGridForm.getGridData();
		if(this.state.edit_type==1){
			jqPost(gb_approot + 'api/Member',this.state.fieldData)
			.done(function(data, textStatus, jqXHRdata) {
				if(data.result){
					tosMessage(null,'新增完成',1);
					this.updateType(data.id);
				}else{
					alert(data.message);
				}
			}.bind(this))
			.fail(function( jqXHR, textStatus, errorThrown ) {
				showAjaxError(errorThrown);
			});
		}		
		else if(this.state.edit_type==2){

			jqPut(gb_approot + 'api/Member',this.state.fieldData)
			.done(function(data, textStatus, jqXHRdata) {
				if(data.result){
					tosMessage(null,'修改完成',1);
				}else{
					alert(data.message);
				}
			}.bind(this))
			.fail(function( jqXHR, textStatus, errorThrown ) {
				showAjaxError(errorThrown);
			});
		};
		return;
	},
	deleteSubmit:function(e){

		if(!confirm('確定是否刪除?')){
			return;
		}

		var ids = [];
		for(var i in this.state.gridData.rows){
			if(this.state.gridData.rows[i].check_del){
				ids.push('ids='+this.state.gridData.rows[i].流水號);
			}
		}

		if(ids.length==0){
			tosMessage(null,'未選擇刪除項',2);
			return;
		}

		jqDelete(gb_approot+'api/Member?' + ids.join('&'),{})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				tosMessage(null,'刪除完成',1);
				this.queryGridData(0);
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	handleSearch:function(e){
		e.preventDefault();
		this.queryGridData(0);
		return;
	},
	delCheck:function(i,chd){

		var newState = this.state;
		this.state.gridData.rows[i].check_del = !chd;
		this.setState(newState);
	},
	checkAll:function(){

		var newState = this.state;
		newState.checkAll = !newState.checkAll;
		for (var prop in this.state.gridData.rows) {
			this.state.gridData.rows[prop].check_del=newState.checkAll;
		}
		this.setState(newState);
	},
	gridData:function(page){

		var parms = {
			page:0
		};

		if(page==0){
			parms.page=this.state.gridData.page;
		}else{
			parms.page=page;
		}

		$.extend(parms, this.state.searchData);

		return jqGet(gb_approot + 'api/Member',parms);
	},
	queryGridData:function(page){
		this.gridData(page)
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data});
		}.bind(this))
		.fail(function(jqXHR, textStatus, errorThrown) {
			showAjaxError(errorThrown);
		});
	},
	insertType:function(){
		this.setState({edit_type:1,fieldData:{}});
	},
	updateType:function(id){
		jqGet(gb_approot + 'api/Member',{id:id})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({edit_type:2,fieldData:data.data});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	noneType:function(){
		this.gridData(0)
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({edit_type:0,gridData:data});
		}.bind(this))
		.fail(function(jqXHR, textStatus, errorThrown) {
			showAjaxError(errorThrown);
		});
	},
	changeFDValue:function(name,e){
		this.setInputValue(this.props.fdName,name,e);
	},
	changeGDValue:function(name,e){
		this.setInputValue(this.props.gdName,name,e);
	},
	setInputValue:function(collentName,name,e){

		var obj = this.state[collentName];
		if(e.target.value=='true'){
			obj[name] = true;
		}else if(e.target.value=='false'){
			obj[name] = false;
		}else{
			obj[name] = e.target.value;
		}
		this.setState({fieldData:obj});
	},
	render: function() {
		var outHtml = null;

		if(this.state.edit_type==0)
		{
			var searchData = this.state.searchData;

			outHtml =
			(
				<div>
					<ul className="breadcrumb">
						<li><i className="fa-list-alt"></i> {this.props.MenuName}</li>
					</ul>
					<h3 className="title">
						{this.props.Caption}
					</h3>
					<form onSubmit={this.handleSearch}>
						<div className="table-responsive">
							<div className="table-header">
								<h5 className="table-title">搜尋<strong>這裡是關鍵字</strong>的結果:</h5>
								<div className="table-filter">
									<div className="form-inline">
										<div className="form-group">
											<label>姓名</label> { }
											<input type="text" className="form-control input-sm" 
											value={searchData.name}
											onChange={this.changeGDValue.bind(this,'name')}
											placeholder="請輸入關鍵字..." />
										</div> { }
										<button className="btn-primary btn-sm" type="submit"><i className="fa-search"></i> 搜尋</button>
									</div>
								</div>
							</div>
							<table>
								<thead>
									<tr>
										<th className="col-xs-1 text-center">
											<label className="cbox">
												<input type="checkbox" checked={this.state.checkAll} onChange={this.checkAll} />
												<i className="fa-check"></i>
											</label>
										</th>
										<th className="col-xs-1 text-center">修改</th>
										<th className="col-xs-3">姓名</th>
										<th className="col-xs-3">行動電話</th>
										<th className="col-xs-2">入會日期</th>
										<th className="col-xs-1">排序</th>
										<th className="col-xs-1 ordered">
											<a href="">
												狀態
												<i className="fa-caret-up"></i> { }
												<i className="fa-caret-down"></i>
											</a>
										</th>
									</tr>
								</thead>
								<tbody>
									{
										this.state.gridData.rows.map(function(itemData,i) {
										return <GridRow 
													key={i}
													ikey={i}
													primKey={itemData.流水號} 
													itemData={itemData} 
													delCheck={this.delCheck}
													updateType={this.updateType}								
											/>;
										}.bind(this))
									}
								</tbody>
							</table>
						</div>
						<GridNavPage 
						StartCount={this.state.gridData.startcount}
						EndCount={this.state.gridData.endcount}
						RecordCount={this.state.gridData.records}
						TotalPage={this.state.gridData.total}
						NowPage={this.state.gridData.page}
						onQueryGridData={this.queryGridData}
						InsertType={this.insertType}
						UpdateType={this.insertType}
						deleteSubmit={this.deleteSubmit}
						/>
					</form>
				</div>
			);
		}
		else if(this.state.edit_type==1 || this.state.edit_type==2)
		{
			var fieldData = this.state.fieldData;

			outHtml=(
						<div>
							<ul className="breadcrumb">
								<li><i className="fa-list-alt"></i> {this.props.MenuName}</li>
							</ul>
							<h4 className="title">{this.props.Caption} 基本資料維護</h4>
							<div className="item-box">
								<form className="form-horizontal" onSubmit={this.handleSubmit}>

									<div className="item-title">
										<ul className="widget">
						                    <li data-toggle="tooltip" title="收合/展開">
						                    	<a className="text-default" data-toggle="collapse" href="#profile">
						                    		<i className="fa-chevron-down"></i>
						                    	</a>
						                    </li>
						                </ul>
										<h5>個人基本資料</h5>
									</div>
									<div className="panel-body">
										<div id="profile" className="panel-collapse collapse in">
											<div className="form-group">
												<label className="col-xs-1 control-label">姓名</label>
												<div className="col-xs-2">
													<input type="text" 
													className="form-control"	
													value={fieldData.姓名}
													onChange={this.changeFDValue.bind(this,'姓名')}
													maxLength="16"
													required />
												</div>
												<label className="col-xs-1 control-label">性別</label>
												<div className="col-xs-1">
													<select className="form-control" value={fieldData.SEX} onChange={this.changeFDValue.bind(this,'SEX')}>
														<option value="先生">男</option>
														<option value="小姐">女</option>
													</select>
												</div>
												<label className="col-xs-1 control-label">主行業</label>
												<div className="col-xs-3">
													<input type="text" 
													className="form-control"	
													value={fieldData.主行業}
													onChange={this.changeFDValue.bind(this,'主行業')}
													maxLength="16"
													 />
												</div>
												<label className="col-xs-1 control-label">副行業</label>
												<div className="col-xs-2">
													<input type="text" 
													className="form-control"	
													value={fieldData.副行業}
													onChange={this.changeFDValue.bind(this,'副行業')}
													maxLength="16"
													 />
												</div>
											</div>
											<div className="form-group">
												<label className="col-xs-1 control-label">公司電話</label>
												<div className="col-xs-3">
													<input type="tel" 
													className="form-control"	
													value={fieldData.公司電話}
													onChange={this.changeFDValue.bind(this,'公司電話')}
													maxLength="16"
													 />
												</div>
												<label className="col-xs-1 control-label">住家電話</label>
												<div className="col-xs-3">
													<input type="tel" 
													className="form-control"	
													value={fieldData.住家電話}
													onChange={this.changeFDValue.bind(this,'住家電話')}
													maxLength="16"
													 />
												</div>
												<label className="col-xs-1 control-label">行動電話</label>
												<div className="col-xs-3">
													<input type="tel" 
													className="form-control"	
													value={fieldData.行動電話}
													onChange={this.changeFDValue.bind(this,'行動電話')}
													maxLength="16"
													 />
												</div>
											</div>
											<div className="form-group">
												<label className="col-xs-1 control-label">傳真</label>
												<div className="col-xs-3">
													<input type="tel" 
													className="form-control"	
													value={fieldData.傳真}
													onChange={this.changeFDValue.bind(this,'傳真')}
													maxLength="16"
													 />
												</div>
												<label className="col-xs-1 control-label">Email</label>
												<div className="col-xs-3">
													<input type="email" 
													className="form-control"	
													value={fieldData.Email}
													onChange={this.changeFDValue.bind(this,'Email')}
													 />
												</div>
												<label className="col-xs-1 control-label">網站</label>
												<div className="col-xs-3">
													<input type="text" 
													className="form-control"	
													value={fieldData.網站}
													onChange={this.changeFDValue.bind(this,'網站')}
													 />
												</div>
											</div>
											<div className="form-group">
												<label className="col-xs-1 control-label">地址</label>
												<div className="col-xs-1">
													<input type="text" 
													className="form-control"	
													value={fieldData.區號}
													onChange={this.changeFDValue.bind(this,'區號')}
													 />
												</div>
												<div className="col-xs-10">
													 <input type="text" 
													className="form-control"	
													value={fieldData.地址}
													onChange={this.changeFDValue.bind(this,'地址')}
													 />
												</div>
											</div>
											<div className="form-group">
												<label className="col-xs-1 control-label">個人照片</label>
												<div className="col-xs-5">
													<MasterFileUpload 
														FileKind="Photo1" 
														MainId={fieldData.流水號}
														Name="Photo1"
														/>
												</div>
												<label className="col-xs-1 control-label">公司照片</label>
												<div className="col-xs-5">
													<MasterFileUpload 
														FileKind="Photo2" 
														MainId={fieldData.流水號}
														Name="Photo2"
														/>
												</div>
											</div>
											<div className="form-group">
												<div className="col-xs-12">
													<ul className="nav nav-tabs nav-left" role="tablist">
									                    <li className="active"><a href="#tab1" role="tab" data-toggle="tab"><strong>公司簡介</strong></a></li>
									                    <li><a href="#tab2" role="tab" data-toggle="tab"><strong>服務項目</strong></a></li>
								                	</ul>
													<div className="tab-content tab-left">
									                    <div className="tab-pane active" id="tab1">
									                        <textarea type="date" className="form-control" rows="3"
									                        			value={fieldData.公司簡介}
									                        			onChange={this.changeFDValue.bind(this,'公司簡介')} />
									                    </div>
									                    <div className="tab-pane" id="tab2">
									                        <textarea type="date" className="form-control" rows="3"
									                        			value={fieldData.服務項目}
									                        			onChange={this.changeFDValue.bind(this,'服務項目')} />
									                    </div>
									                </div>
								                </div>
											</div>
										</div>
									</div>

									<div className="item-title">
										<ul className="widget">
						                    <li data-toggle="tooltip" title="收合/展開">
						                    	<a className="text-default" data-toggle="collapse" href="#info">
						                    		<i className="fa-chevron-down"></i>
						                    	</a>
						                    </li>
						                </ul>
										<h5>會員資料</h5>
									</div>
									<div className="panel-body">
										<div id="info" className="panel-collapse collapse in">
											<div className="form-group">
												<label className="col-xs-1 control-label">會內職稱</label>
												<div className="col-xs-3">
													<input type="text" 
													className="form-control"	
													value={fieldData.會內職稱}
													onChange={this.changeFDValue.bind(this,'會內職稱')}
													 />
												</div>
												<label className="col-xs-1 control-label">會員分類</label>
												<div className="col-xs-3">
													<select className="form-control" value={fieldData.會員分類編號} onChange={this.changeFDValue.bind(this,'會員分類編號')}>
														<option value="1">見習會友</option>
														<option value="2">一般會友(YB)</option>
														<option value="3">超齡會友(OB)</option>
														<option value="4">見習未通過</option>
														<option value="5">見習已通過 尚未入會</option>											
														<option value="6">顧問</option>
														<option value="7">已故會友</option>
													</select>
												</div>
												<label className="col-xs-1 control-label">入會日期</label>
												<div className="col-xs-3">
													<span className="has-feedback">
														<InputDate id="enter_date" name="入會日期" onChange={this.changeFDValue} value={this.state.fieldData.入會日期} />
														<i className="fa-calendar form-control-feedback"></i>
													</span>
												</div>
											</div>
											<div className="form-group">
												<label className="col-xs-1 control-label">排序</label>
												<div className="col-xs-1">
														<input type="number" 
														className="form-control"	
														value={fieldData.排序}
														onChange={this.changeFDValue.bind(this,'排序')}
														required />
												</div>
												<small className="help-inline col-xs-2">數字大在前面</small>
												<label className="col-xs-1 control-label">狀態</label>
												<div className="col-xs-4">
													<div className="radio-inline">
						                                <label>
															<input type="radio" 
															name="is_open"
															value={true}
															checked={fieldData.顯示狀態Flag===true} 
															onChange={this.changeFDValue.bind(this,'顯示狀態Flag')}
																/>
						                                    <span>顯示在中壢青商網站</span>
														</label>
						                            </div>
													<div className="radio-inline">
						                                <label>
															<input type="radio" 
															name="is_open"
															value={false}
															checked={fieldData.顯示狀態Flag===false} 
															onChange={this.changeFDValue.bind(this,'顯示狀態Flag')}
																/>
							                                <span>隱藏</span>
														</label>
													</div>
												</div>
											</div>
											
											<div className="form-group">
												<label className="col-xs-1 control-label">社團經歷</label>
												<div className="col-xs-11">
													<textarea type="date" className="form-control" rows="3"
									                        	value={fieldData.社團經歷}
									                        	onChange={this.changeFDValue.bind(this,'社團經歷')} />
												</div>
											</div>
										</div>
									</div>

									<div className="panel-footer">
                    					<button type="submit" className="btn-primary col-xs-offset-1"><i className="fa-check"></i> 儲存</button> { }
                    					<button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                					</div>

								</form>
							</div>


								
							
							{/*次表單*/}
							<SubGirdForm
							MainId={fieldData.流水號} 
							handleSubmit={this.handleSubmit} 
							noneType={this.noneType} 
							ref="subGridForm" />
						</div>);
		}else{
			outHtml=(<span>No Page</span>);
		}

		return outHtml;
	}
});

//明細列表
var SubGirdForm = React.createClass({
	mixins: [React.addons.LinkedStateMixin,SortableMixin], 
	getInitialState: function() {  
		return {
			gridData:[],
			refreshFileList:false
		};  
	},
	getDefaultProps:function(){
		return{	
			fdName:'fieldData',
			gdName:'searchData'
		};
	},
	componentDidMount:function(){
		this.queryGridData();
		//Sortable.create(simpleList, { /* options */ });
	},
	handleSubmit: function(e) {
		e.preventDefault();
		this.props.handleSubmit(this.state.gridData,e);
		return;
	},
	deleteSubmit:function(e){

		if(!confirm('確定是否刪除?')){
			return;
		}

		var ids = [];
		for(var i in this.state.gridData){
			if(this.state.gridData.rows[i].check_del){
				ids.push('ids='+this.state.gridData[i].流水號);
			}
		}

		if(ids.length==0){
			tosMessage(null,'未選擇刪除項',2);
			return;
		}

		jqDelete(gb_approot+'api/Product?' + ids.join('&'),{})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				tosMessage(null,'刪除完成',1);
				this.queryGridData(0);
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	getGridData:function(){
		return this.state.gridData;
	},
	handleSearch:function(e){
		e.preventDefault();
		this.queryGridData(0);
		return;
	},
	gridData:function(){
		var parms = {
			main_id:this.props.MainId
		};

		return jqGet(gb_approot + 'api/Product',parms);
	},
	queryGridData:function(){
		this.gridData()
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data});
		}.bind(this))
		.fail(function(jqXHR, textStatus, errorThrown) {
			showAjaxError(errorThrown);
		});
	},
	changeFDValue:function(name,e){
		this.setInputValue(this.props.fdName,name,e);
	},
	changeGDValue:function(name,e){
		this.setInputValue(this.props.gdName,name,e);
	},
	setInputValue:function(collentName,name,e){

		var obj = this.state[collentName];
		if(e.target.value=='true'){
			obj[name] = true;
		}else if(e.target.value=='false'){
			obj[name] = false;
		}else{
			obj[name] = e.target.value;
		}
		this.setState({fieldData:obj});
	},
	setSubInputValue:function(i,name,e){
		var obj = this.state.gridData[i];
		if(e.target.value=='true'){
			obj[name] = true;
		}else if(e.target.value=='false'){
			obj[name] = false;
		}else{
			obj[name] = e.target.value;
		}
		this.setState({fieldData:obj});
	},
	creatNewData:function(){

		var data = {
			流水號:0,
			會員流水號:this.props.MainId,
			產品名稱:null,
			產品特色:null,
			價格:0,
			價格說明:null,
			活動日期: moment(Date()).format('YYYY-MM-DD'),
			顯示狀態Flag:true,
			排序:0,
			edit_state:0
		};
		var newState = this.state;
		newState.gridData.push(data);
		this.setState(newState);
	},
	deleteItem:function(i){
		var newState = this.state;
		var data = newState.gridData[i];

		if(data.edit_state==0){
			newState.gridData.splice(i,1);
			this.setState(newState);
		}else{
			jqDelete(gb_approot+'api/product?ids=' + data.流水號,{})
			.done(function(data, textStatus, jqXHRdata) {
				if(data.result){
					newState.gridData.splice(i,1);
					this.setState(newState);
				}else{
					tosMessage(null,data.message,1);
				}
			}.bind(this))
			.fail(function(jqXHR, textStatus, errorThrown) {
				showAjaxError(errorThrown);
			});
		}
	},
	handleSort: function (evt) { 
		var newState = this.state;
		var n = newState.gridData.length;
		for (var i in newState.gridData) {
			newState.gridData[i].排序=n;
			n--;
		}
		newState.refreshFileList = true;
		this.setState(newState);
		this.setState({refreshFileList:false});
		//this.reloadFileList();
	},
	sortableOptions: {
        ref: "SortForm",
        model:'gridData',
        group: "shared",
        handle: ".panel-title",
        ghostClass: "ghost"
    },
    reloadFileList:function	(){
		//console.log(this.refs.reloadFileList.length);
		//this.refs.reloadFileList.reloadFileList();
	},
	render: function() {
		var outHtml = null;
		var fieldData = this.state.fieldData;
		
		outHtml=
		(
			<div>
				<hr className="expanded" />
				<h4 className="title">
					產品明細資料維護 { }
					<button className="btn-link text-success" type="button" onClick={this.creatNewData}>
						<i className="fa-plus-circle"></i> 新增明細資料
					</button>
				</h4>
				<div className="alert alert-warning" role="alert">
					<button type="button" className="close" data-dismiss="alert"><span aria-hidden="true">×</span></button>
					<ul className="list-order">
						<li>點選 <strong className="fa-bars"></strong> 並<strong>拖曳</strong>，可修改排列順序。</li>
						<li>點選 <strong className="fa-chevron-up"></strong> 可收合表單。</li>
						<li>點選 <strong className="fa-chevron-down"></strong> 可展開表單。</li>
					</ul>
				</div>
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="panel-group" ref="SortForm">
					{
						this.state.gridData.map(function(itemData,i) {
							return <SubGirdField key={i} ikey={i} fieldData={itemData} 
							SetSubInputValue={this.setSubInputValue} 
							DeleteItem={this.deleteItem}
							refreshFileList={this.state.refreshFileList}
							/>;
						}.bind(this))
					}
					</div>
					<div className="form-action">
						<div className="col-xs-11 col-xs-offset-1">
							<button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                    		<button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
						</div>
					</div>
				</form>
			</div>
		);
		return outHtml;
	}
});
//明細表單
var SubGirdField = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return {
			fieldData:this.props.fieldData
		};  
	},
	getDefaultProps:function(){
		return{
		};
	},
	componentDidMount:function(){
	},
	componentWillReceiveProps:function(nextProps){
		this.state.fieldData = nextProps.fieldData;
	},
	changeFDValue:function(name,e){
		this.props.SetSubInputValue(this.props.ikey,name,e);
	},
	deleteItem:function(i){
		if(this.props.fieldData.edit_state==1){
			if(confirm('此筆資料已存在，確認是否刪除?')){
				this.props.DeleteItem(i);
			}
		}else{
			this.props.DeleteItem(i);
		}
	},
	reloadFileList:function	(){
		this.refs.reloadFileList.createFileUpLoadObject();
		this.refs.reloadFileList.getFileList();
	},
	render: function() {

		var outHtml = null;
		var fieldData = this.state.fieldData;
		outHtml = (
		<div className="panel">
			<div className="panel-heading">
				<h4 className="panel-title draggable">
					<a data-toggle="collapse" href={'#item-' + this.props.ikey}>
						<i className="fa-bars"></i>
						#{this.props.ikey} {fieldData.產品名稱}
						<ul className="widget">
							<li>
								<button className="btn-link text-default" title="收合/展開">
									<i className="fa-chevron-down"></i>
								</button>
							</li>
							<li>
								<button className="btn-link text-danger" title="刪除" onClick={this.deleteItem.bind(this,this.props.ikey)}>
									<i className="fa-times"></i>
								</button>
							</li>
						</ul>
					</a>
				</h4>
			</div>
			<div id={'item-' + this.props.ikey} className="panel-collapse collapse in">
				<div className="panel-body">

					<div className="form-group">
						<label className="col-xs-1 control-label">產品名稱</label>
						<div className="col-xs-2">
							<input type="text" 
							className="form-control"	
							value={fieldData.產品名稱}
							onChange={this.changeFDValue.bind(this,'產品名稱')}
							maxLength="16"
							required />
						</div>
						<label className="col-xs-1 control-label">產品特色</label>
						<div className="col-xs-2">
							<input type="text" id="editor1" className="form-control"
								value={fieldData.產品特色}
								onChange={this.changeFDValue.bind(this,'產品特色')} />
						</div>
						<label className="col-xs-1 control-label">價格</label>
						<div className="col-xs-2">
							
							<input type="number" 
							className="form-control"	
							value={fieldData.價格}
							onChange={this.changeFDValue.bind(this,'價格')}
							 />
						</div>
						<label className="col-xs-1 control-label">價格說明</label>
						<div className="col-xs-2">
							<input type="text" id="editor2" className="form-control"
								value={fieldData.價格說明}
								onChange={this.changeFDValue.bind(this,'價格說明')} />
						</div>
					</div>

					<div className="form-group">
						<label className="col-xs-1 control-label">產品圖片</label>
						<div className="col-xs-3">
							<InputFileUpload ikey={this.props.ikey} 
							MainId={fieldData.流水號} 
							FileKind="Photo2" 
							edit_state={fieldData.edit_state}
							ref="reloadFileList"
							refreshFileList={this.props.refreshFileList}
							/>
						</div>
						<label className="col-xs-1 control-label">狀態</label>
						<div className="col-xs-2">
							<div className="radio-inline">
								<label>
									<input type="radio" 
									name={'is_open' + this.props.ikey}
									value={true}
									checked={fieldData.顯示狀態Flag==true} 
									onChange={this.changeFDValue.bind(this,'顯示狀態Flag')}
									/>
									<span>顯示</span>
								</label>
							</div>
							<div className="radio-inline">
								<label>
									<input type="radio" 
									name={'is_open' + this.props.ikey}
									value={false}
									checked={fieldData.顯示狀態Flag==false} 
									onChange={this.changeFDValue.bind(this,'顯示狀態Flag')}
									/>
									<span>隱藏</span>
								</label>
							</div>
						</div>
						<label className="col-xs-1 control-label">排序</label>
						<div className="col-xs-1">
							<input type="number" 
							className="form-control"	
							value={fieldData.排序}
							onChange={this.changeFDValue.bind(this,'排序')}
							required />
						</div>
						<small className="help-inline col-xs-2">數字大在前面</small>
					</div>

				</div>
			</div>
		</div>
		);
		return outHtml;
	}
});

//明細檔案上傳
var InputFileUpload = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return {
			filelist:[]
		};  
	},
	getDefaultProps:function(){
		return{	
			ikey:0,
			MainId:0,
			edit_state:0
		};
	},
	componentDidUpdate:function(prevProps, prevState){
		if( (prevProps.edit_state==0 && this.props.edit_state==1) || this.props.refreshFileList) {
			this.createFileUpLoadObject();
			this.getFileList();
		}
	},
	componentDidMount:function(){
		if(this.props.edit_state==1){
			this.createFileUpLoadObject();
			this.getFileList();
		}
	},
	componentWillReceiveProps:function(nextProps){
		
	},
	shouldComponentUpdate:function(nextProps,nextState){
		// return (this.props.edit_state == 0 && nextProps.edit_state==1);
		return true;
	},
	changeFDValue:function(name,e){
		this.props.SetSubInputValue(this.props.ikey,name,e);
	},
	deleteFile:function(filename){
		jqPost(gb_approot+'Sys_Active/MemberData/aj_FDelete',{
			id:this.props.MainId,
			fileKind:this.props.FileKind,
			filename:filename
		})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				this.getFileList();
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	getFileList:function(){
		jqPost(gb_approot+'Sys_Active/MemberData/aj_FList',{
			id:this.props.MainId,
			fileKind:this.props.FileKind
		})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				this.setState({filelist:data.filesObject})
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	createFileUpLoadObject:function(){
			var btn = document.getElementById('upload-btn-' + this.props.ikey);
			var r_this = this;
		  	var uploader = new ss.SimpleUpload({
		        button: btn,
		        url: gb_approot + 'Sys_Active/MemberData/aj_FUpload',
		        data:{
		        	id:this.props.MainId,
		        	fileKind:this.props.FileKind
		        },
		        name: 'fileName',
		        multiple: true,
		        maxSize: 5000,
		        allowedExtensions: ['jpg', 'jpeg', 'png'],
		        accept: 'image/*',
		        responseType: 'json',
				onSubmit: function(filename, ext) {            
					if(r_this.props.MainId==0){
						alert('此筆資料未完成新增，無法上傳檔案!')
						return false;
					}
				},
				onProgress:function(pct){
					console.log('Progress',pct);
				},		
				onSizeError: function() {
		                errBox.innerHTML = 'Files may not exceed 500K.';
				},
				onExtError: function() {
		              errBox.innerHTML = 'Invalid file type. Please select a PNG, JPG, GIF image.';
				},
		        onComplete: function(file, response) {
		        	if(response.result){ 
						r_this.getFileList();
					}else{

					}
		        }
			});
	},
	render: function() {
		var outHtml = null;
		outHtml=(				
		<div>
			<div className="form-control">
				<input type="file" id={'upload-btn-' + this.props.ikey} />
			</div>
			<p className="help-block">
			{
				this.state.filelist.map(function(itemData,i) {
					var  subOutHtml =
					<span className="img-upload" key={i}>
						<button type="button" className="close" onClick={this.deleteFile.bind(this,itemData.FileName)}>&times;</button>
						<img src={itemData.RepresentFilePath} />
					</span>;
					return subOutHtml;
				},this)
			}
			</p>
		</div>
		);
		return outHtml;
	}
});

//主表單檔案上傳元平
var MasterFileUpload = React.createClass({
	getInitialState: function() {  
		return {
			filelist:[]
		};  
	},
	getDefaultProps:function(){
		return{	
		};
	},
	componentDidUpdate:function(prevProps, prevState){
		//this.getFileList();
	},
	componentDidMount:function(){
		if(this.props.MainId>1){
			this.createFileUpLoadObject();
			this.getFileList();
		}
	},
	componentWillReceiveProps:function(nextProps){
		
	},
	changeFDValue:function(name,e){
		this.props.SetSubInputValue(this.props.ikey,name,e);
	},
	deleteFile:function(filename){
		jqPost(gb_approot+'Sys_Active/MemberData/aj_FDelete',{
			id:this.props.MainId,
			fileKind:this.props.FileKind,
			filename:filename
		})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				this.getFileList();
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	getFileList:function(){
		jqPost(gb_approot+'Sys_Active/MemberData/aj_FList',{
			id:this.props.MainId,
			fileKind:this.props.FileKind
		})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				this.setState({filelist:data.filesObject})
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	createFileUpLoadObject:function(){
			var btn = document.getElementById('upload-btn-' + this.props.Name);
			var r_this = this;
		  	var uploader = new ss.SimpleUpload({
		        button: btn,
		        url: gb_approot + 'Sys_Active/MemberData/aj_FUpload',
		        data:{
		        	id:this.props.MainId,
		        	fileKind:this.props.FileKind
		        },
		        name: 'fileName',
		        multiple: true,
		        maxSize: 5000,
		        allowedExtensions: ['jpg', 'jpeg', 'png'],
		        accept: 'image/*',
		        responseType: 'json',
				onSubmit: function(filename, ext) {            
					if(r_this.props.MainId==0){
						alert('此筆資料未完成新增，無法上傳檔案!')
						return false;
					}
				},
				onProgress:function(pct){
					console.log('Progress',pct);
				},		
				onSizeError: function() {
		                errBox.innerHTML = 'Files may not exceed 500K.';
				},
				onExtError: function() {
		              errBox.innerHTML = 'Invalid file type. Please select a PNG, JPG, GIF image.';
				},
		        onComplete: function(file, response) {
		        	if(response.result){ 
						r_this.getFileList();
					}else{

					}
		        }
			});
	},
	render: function() {

		var outHtml = null;
		//var fieldData = this.state.fieldData;
		//console.log('render',this.props.ikey);
		outHtml=(				
		<div>
			<div className="form-control">
				<input type="file" id={'upload-btn-' + this.props.Name} />
			</div>
			<p className="help-block">
			{
				this.state.filelist.map(function(itemData,i) {
					var  subOutHtml =
					<span className="img-upload" key={i}>
						<button type="button" className="close" onClick={this.deleteFile.bind(this,itemData.FileName)}>&times;</button>
						<img src={itemData.RepresentFilePath} />
					</span>;
					return subOutHtml;
				},this)
			}
			</p>
		</div>
		);
		return outHtml;
	}
});