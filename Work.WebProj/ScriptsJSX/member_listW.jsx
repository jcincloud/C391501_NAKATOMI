var MembersTd = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
		};  
	},		
	componentDidMount:function(prevProps, prevState){
	},
	render:function(){

		var outHtml = (
			<td>
				{
					this.props.MemberItem.map(function(itemData,i) {
						var subOutHtml = 
						<span>{itemData} │</span>;
						return subOutHtml;
					}.bind(this))	
				}
			</td>
			);
		return outHtml;
	}
});


//[1]
//主元件 Tabs集合區段
var PageContent = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			gridData:[],
		};  
	},		
	componentDidMount:function(prevProps, prevState){

		jqGet(gb_approot + 'api/GetAction/GetMemberWWW',{})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	render:function(){

		var outHtml = (
		<div className="table-responsive">
			<table className="pro-list">
				<tr>
					<th>入會年度</th><th>姓名</th>
				</tr>
				{
					this.state.gridData.map(function(itemData,i) {
						var subOutHtml = 
						<tr>
							<td>民國 {itemData.Key-1911} - 西元 {itemData.Key} </td>
							<MembersTd MemberItem={itemData.Item} />
						</tr>;
						return subOutHtml;
					}.bind(this))	
				}

			</table>
		</div>
			);
		return outHtml;
	}
});

//元件嵌入 div id:PageContent
var comp = React.render(<PageContent dataUrl={gb_approot + 'api/GetAction/GetActiveAllWWW'} />,document.getElementById('PageContent'));