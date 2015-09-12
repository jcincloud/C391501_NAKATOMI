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

					<td>{this.props.itemData.標題}</td>
					<td>{'最新消息'}</td>
					<td>{moment(this.props.itemData.活動日期).format('YYYY-MM-DD')}</td>
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
	componentWillReceiveProps:function(nextProps){
		//當元件收到新的 props 時被執行，這個方法在初始化時並不會被執行。使用的時機是在我們使用 setState() 並且呼叫 render() 之前您可以比對 props，舊的值在 this.props，而新值就從 nextProps 來。
	},
	shouldComponentUpdate:function(nextProps,nextState){
		/*
		如同其命名，是用來判斷元件是否該更新，當 props 或者 state 變更時會再重新 render 之前被執行。這個方法在初始化時不會被執行，或者當您使用了 forceUpdate 也不會被執行。
		當你確定改變的 props 或 state 並不需要觸發元件更新時，在這個方法中適當的回傳 false 可以提升一些效能。

		shouldComponentUpdate: function(nextProps, nextState) {
  			return nextProps.id !== this.props.id;
		}

		如果 shouldComponentUpdate 回傳 false 則 render() 就會完全被跳過直到下一次 state 改變，此外 componentWillUpdate 和 componentDidUpdate 將不會被觸發。
		當 state 產生異動，為了防止一些奇妙的 bug 產生，預設 shouldComponentUpdate 永遠回傳 true ，不過如果您總是使用不可變性(immutable)的方式來使用 state，並且只在 render 讀取它們那麼你可以複寫 shouldComponentUpdate
		或者是當效能遇到瓶頸，特別是需要處理大量元件時，使用 shouldComponentUpdate 通常能有效地提升速度。
		*/

		//console.log('next',nextState.fieldData['活動日期']);

		return true;//$('#活動日期').val()!=this.state.fieldData['活動日期'];
	},
	componentWillUpdate:function(nextProps,nextState){
		/*
			當收到 props 或者 state 立即執行，這個方法在初始化時不會被執行，使用時機通常是在準備更新之前。
			注意您不能在這個方法中使用 this.setState()。如果您需要在修改 props 之後更新 state 請使用 componentWillReceiveProps 取代
		*/
	},
	componentDidUpdate:function(prevProps, prevState){
		/*
			在元件更新之後執行。這個方法同樣不在初始化時執行，使用時機為當元件被更新之後需要執行一些操作。
		*/
	},
	componentWillUnmount:function(){
		//元件被從 DOM 卸載之前執行，通常我們在這個方法清除一些不再需要地物件或 timer。
	},
	handleSubmit: function(e) {
		e.preventDefault();
		if(this.state.edit_type==1){
			jqPost(gb_approot + 'api/Document',this.state.fieldData)
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

			this.state.fieldData.內容 = CKEDITOR.instances.editor1.getData();

			jqPut(gb_approot + 'api/Document',this.state.fieldData)
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

		jqDelete(gb_approot+'api/Document?' + ids.join('&'),{})			
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

		return jqGet(gb_approot + 'api/Document',parms);
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
		CKEDITOR.replace( 'editor1', {});
	},
	updateType:function(id){
		jqGet(gb_approot + 'api/Document',{id:id})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({edit_type:2,fieldData:data.data});

			CKEDITOR.replace( 'editor1', {});

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
											<label for="">年度</label> { }
											<select name="" id="" className="form-control input-sm">
												<option value="">2015</option>
												<option value="">2014</option>
											</select>
										</div> { }
										<div className="form-group">
											<label>標題</label> { }
											<input type="text" className="form-control input-sm" 
											value={searchData.title}
											onChange={this.changeGDValue.bind(this,'title')}
											placeholder="請輸入關鍵字..." />
										</div>
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
										<th className="col-xs-4">標題</th>
										<th className="col-xs-1">分類</th>
										<th className="col-xs-3 ordered">
											<a href="#">{/* 預設:無排序(不用class)，由大到小class="desc"，由小到大class="asc" */}
												日期
												<i className="fa-caret-up"></i>
												<i className="fa-caret-down"></i>
											</a>
										</th>
										<th className="col-xs-1 ordered">
											<a className="desc" href="#">{/* 預設:無排序(不用class)，由大到小class="desc"，由小到大class="asc" */}
												排序
												<i className="fa-caret-up"></i>
												<i className="fa-caret-down"></i>
											</a>
										</th>
										<th className="col-xs-1 ordered">
											<a className="asc" href="#">{/* 預設:無排序(不用class)，由大到小class="desc"，由小到大class="asc" */}
												狀態
												<i className="fa-caret-up"></i>
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
					<form className="form-horizontal" onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label className="col-xs-1 control-label">標題</label>
							<div className="col-xs-5">
								<input type="text" 
								className="form-control"	
								value={fieldData.標題}
								onChange={this.changeFDValue.bind(this,'標題')}
								maxLength="16"
								required />
							</div>
						</div>
						<div className="form-group has-feedback">
							<label className="col-xs-1 control-label">日期</label>
							<div className="col-xs-5">
								<InputDate id="news_date" name="活動日期" onChange={this.changeFDValue} value={this.state.fieldData.活動日期} />
								<i className="fa-calendar form-control-feedback"></i>
							</div>
						</div>

						<div className="form-group">
							<label className="col-xs-1 control-label">排序</label>
							<div className="col-xs-5">
									<input type="number" 
									className="form-control"	
									value={fieldData.排序}
									onChange={this.changeFDValue.bind(this,'排序')}
									required />
							</div>
							<small className="help-inline col-xs-5">數字愈大排在愈前面</small>
						</div>

						<div className="form-group">
							<label className="col-xs-1 control-label">狀態</label>
							<div className="col-xs-3">
								<div className="radio-inline">
	                                <label>
										<input type="radio" 
										name="is_open"
										value={true}
										checked={fieldData.顯示狀態Flag===true} 
										onChange={this.changeFDValue.bind(this,'顯示狀態Flag')}
											/>
	                                    <span>顯示</span>
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
							<label className="col-xs-1 control-label">附件</label>
							<div className="col-xs-7">
								<MasterDocFileUpload 
									FileKind="File1" 
									MainId={fieldData.流水號}
									url_upload={gb_approot + 'Sys_Active/Document/aj_FUpload'}
									url_list={gb_approot + 'Sys_Active/Document/aj_FList'}
									url_delete={gb_approot + 'Sys_Active/Document/aj_FDelete'} />
							</div>
						</div>

						<div className="form-group">
							<label className="col-xs-1 control-label">內容</label>
							<div className="col-xs-8">
								<textarea type="date" id="editor1" className="form-control" rows="10"
								value={fieldData.內容}
								onChange={this.changeFDValue.bind(this,'內容')} />
							</div>
						</div>

						<div className="form-action">
							<div className="col-xs-4 col-xs-offset-2">
								<button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button>
								<button className="col-xs-offset-1" type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
							</div>
						</div>
					</form>
				</div>
			);
		}else{
			outHtml=(<span>No Page</span>);
		}

		return outHtml;
	}
});

var MasterDocFileUpload = React.createClass({
	getInitialState: function() {  
		return {
			filelist:[],
			url_upload:null,
			url_list:null,
			url_delete:null,
			FileKind:null,
			MainId:0
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
		jqPost(this.props.url_delete,{
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
		jqPost(this.props.url_list,{
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
			var btn = document.getElementById('upload-btn-' + this.props.MainId);
			var r_this = this;
		  	var uploader = new ss.SimpleUpload({
		        button: btn,
		        url: this.props.url_upload,
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
				<input type="file" id={'upload-btn-' + this.props.MainId} />
			</div>
			<p className="help-block">
			{
				this.state.filelist.map(function(itemData,i) {
					var  subOutHtml =
					<span className="img-upload" key={i}>
						<button type="button" className="close" onClick={this.deleteFile.bind(this,itemData.FileName)}>&times;</button>
						<span>檔名</span>
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