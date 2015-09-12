var ImgList = React.createClass({
	getInitialState: function() {  
		return { 
		};  
	},
	render:function(){	
		
		if(this.props.imgsrc!=undefined){
			return <img src={this.props.imgsrc} />;
		}else{
			return <img src={gb_approot + 'Content/images/Activities/no_pic.jpg'} />;
		}
	}
});


//[1]
//主元件 Tabs集合區段
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
				<table className="pro-list">
					<tr>
						<th>產品</th>
						<th>介紹</th>
					</tr>
					{
						this.state.gridData.rows.map(function(itemData,i) {

							var price = itemData.價格 == undefined ? '無':itemData.價格;

							var subOutHtml =
							<tr key={i}>
								<td><a href={gb_approot + 'Member/Member_content?id=' + itemData.mid}>
										<ImgList imgsrc={itemData.imgsrc} />
									</a>
								</td>
								<td>
									<p>產品名稱：<a href={gb_approot + 'Member/Member_content?id=' + itemData.mid}>{itemData.產品名稱}</a></p>
									<p>參考價格：<em>{price}</em></p>
									<p dangerouslySetInnerHTML={{__html:'產品特色：' + itemData.產品特色}}></p>
									<p>供應商：<a href={gb_approot + 'Member/Member_content?id=' + itemData.mid}>{itemData.姓名}</a></p>
									<p>點閱率：{itemData.點閱率}</p>
								</td>
							</tr>;

							return subOutHtml;
						}.bind(this))
					}
				</table>
			</div>

			<nav className="pager">
				<a href="#" onClick={this.pagePrve} title="上10頁">上10頁</a>
				{dpage}				
				<a href="#" onClick={this.pageNext} title="下10頁">下10頁</a>
			</nav>
		</div>
			);
		return outHtml;
	}
});

//元件嵌入 div id:PageContent
var comp = React.render(<PageContent dataUrl={gb_approot + 'api/GetAction/GetBusinessWWW'} 
	contextUrl={gb_approot + 'News/News_content?id='} />,document.getElementById('PageContent'));