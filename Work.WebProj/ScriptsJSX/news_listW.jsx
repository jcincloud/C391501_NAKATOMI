//[1]
//主元件 Tabs集合區段
var PageContent = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			gridData:{rows:[]},
			page:1,
			y:null,
			keyword:null
		};  
	},		
	componentDidMount:function(){
		this.queryData(this.state.page);
		return;
	},
	yearChange:function(event){
		this.queryDataY(event.target.value);
	},
	queryData:function(page){
		
		jqGet(this.props.dataUrl,{page:page,y:this.state.y,keyword:this.state.keyword})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data,page:page});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	queryDataY:function(y){
		jqGet(this.props.dataUrl,{page:1,y:y,keyword:this.state.keyword})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data,page:1,y:y});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	pageSelect:function(e){
		this.queryData(e.target.value);
		return false;
	},
	pageClick:function(page){
		this.queryData(page);
		return false;
	},
	pageFirst:function(){
		this.queryData(1);
		return false;
	},
	pageLast:function(){
		this.queryData(this.state.gridData.total);
		return false;
	},		
	pagePrve:function(){
		if(this.state.page > 1){
			this.queryData(this.state.page - 1);
		}else{
			this.queryData(1);
		}
		return false;
	},
	pageNext:function(){
		if(this.state.page + 1 < this.state.gridData.total){
			this.queryData(this.state.page + 1);
		}else{
			this.queryData(this.state.gridData.total);
		}
		return false;
	},
	render:function(){

		var dpage = [];

		for(var i=1;i<=this.state.gridData.total;i++){
			dpage.push(<option value={i} >{i}</option>);
		}

		var outHtml = (
		<div>
			<div className="search">
				<label>選擇查詢年度</label>
				<select onChange={this.yearChange}>
					<option value="">選擇年度</option>
					<option value="2015">2015</option>
					<option value="2014">2014</option>
					<option value="2013">2013</option>
					<option value="2012">2012</option>
					<option value="2011">2011</option>
					<option value="2010">2010</option>
					<option value="2009">2009</option>
					<option value="2008">2008</option>
				</select>
				<span>
					<input type="text" placeholder="請輸入關鍵字" valueLink={this.linkState('keyword')} />
					<button type="button" onClick={this.yearChange}>搜尋</button>
				</span>
			</div>
			<div className="table-responsive">
				<table className="news-list">
					<tr>
						<th>活動時間</th>
						<th>標題</th>
					</tr>
					{
						this.state.gridData.rows.map(function(itemData,i) {
							var subOutHtml = 
							<tr key={i}>
								<td>{moment(itemData.活動日期).format('YYYY-MM-DD')}</td>
								<td><a href={this.props.contextUrl + itemData.流水號}>{itemData.標題}</a></td>
							</tr>;
							return subOutHtml;
						}.bind(this))
					}
				</table>
			</div>
			<form>
				<ul className="pagination">
					<li><button type="button" onClick={this.pageFirst} disabled={this.state.page==1}>第一頁</button></li>
					<li><button type="button" onClick={this.pagePrve} disabled={this.state.page==1}>上一頁</button></li>
					<li>
						<select value={this.state.page} onChange={this.pageSelect}>
							{dpage}
						</select>
					</li>
					<li><button type="button" onClick={this.pageNext} disabled={this.state.page==this.state.gridData.total}>下一頁</button></li>
					<li><button type="button" onClick={this.pageLast} disabled={this.state.page==this.state.gridData.total}>最末頁</button></li>
				</ul>
				<p className="pager">
					目前位於第
					<input type="number" value={this.state.page} onChange={this.pageSelect} />
					頁，共
					<span>{this.state.gridData.total}</span>
					頁
				</p>
			</form>
		</div>
		);

		return outHtml;
	}
});

//元件嵌入 div id:PageContent
var comp = React.render(<PageContent dataUrl={gb_approot + 'api/GetAction/GetNewsWWW'} contextUrl={gb_approot + 'News/News_content?id='} />,document.getElementById('PageContent'));