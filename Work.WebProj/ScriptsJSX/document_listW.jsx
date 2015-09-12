
var PageContent = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			gridData:{rows:[]},
			page:1,
			y:null
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
		jqGet(this.props.dataUrl,{page:page,y:this.state.y})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data,page:page});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	queryDataY:function(y){
		jqGet(this.props.dataUrl,{page:1,y:y})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data,page:1,y:y});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	pageClick:function(page){
		this.queryData(page);
		return false;
	},
	pagePrve:function(){
		if(this.state.page > 10){
			this.queryData(this.state.page - 10);
		}else{
			this.queryData(1);
		}
		return false;
	},
	pageNext:function(){
		if(this.state.page+10 < this.state.gridData.total){
			this.queryData(this.state.page + 10);
		}else{
			this.queryData(this.state.gridData.total);
		}
		return false;
	},
	render:function(){

		var dpage = [];
		for(var i=1;i<=10;i++){

			var p = this.state.gridData.page - 5 + i; 

			if(p > 0 && p <= this.state.gridData.total)
			{
				if(this.state.gridData.page==p){
					dpage.push(<a key={p} href="#" className="current">{p}</a>);
				}else{
					dpage.push(<a key={p} href="#" onClick={this.pageClick.bind(this,p)}>{p}</a>);
				}
			}
		}

		var outHtml = (
		<div>
			<div className="table-responsive">
				<table className="news-list">
					<tr>
						<th>發佈時間</th>
						<th>標題</th>
					</tr>
					{
						this.state.gridData.rows.map(function(itemData,i) {
							var subOutHtml = 
							<tr>
							<td>{moment(itemData.活動日期).format('YYYY-MM-DD')}</td>
							<td><a href={this.props.contextUrl + itemData.流水號}>{itemData.標題}</a></td>
							</tr>;
							return subOutHtml;
						}.bind(this))
					}

				</table>
			</div>
			<nav className="pager">
				<a href="#" onClick={this.pagePrve} title="上10頁">上一頁</a>
				{dpage}				
				<a href="#" onClick={this.pageNext} title="下10頁">下一頁</a>
			</nav>
		</div>
			);

		return outHtml;
	}
});

var comp = React.render(<PageContent dataUrl={gb_approot + 'api/GetAction/GetShareWWW'} contextUrl={gb_approot + 'Doc/Doc_content?id='} />,document.getElementById('PageContent'));