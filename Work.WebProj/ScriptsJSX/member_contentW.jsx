
var PageContent = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			contentData:{},
			productData:[]
		};  
	},		
	componentDidMount:function(){
		jqGet(gb_approot + 'api/GetAction/GetMemberContentWWW',{id:gb_id})
		.done(function(data, textStatus, jqXHRdata) {
			jqGet(gb_approot + 'api/GetAction/GetProductWWW',{id:gb_id})
			.done(function(sub_data, textStatus, jqXHRdata) {
				this.setState({contentData:data,productData:sub_data});
			}.bind(this))
			.fail(function( jqXHR, textStatus, errorThrown ) {
				showAjaxError(errorThrown);
			});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
		return;
	},
	render:function(){

		var outHtml = (
		<div>
			<section className="float-l half">
				<h3>基本資料</h3>

				<ImgList SetClass="float-l" imgsrc={this.state.contentData.imgsrc_peoson} />

				<dl className="text-list">
					<dt>【姓　名】</dt>
					<dd>{this.state.contentData.姓名} ({this.state.contentData.點閱率})</dd>

					<dt>【青商經歷】</dt>
					<dd>{this.state.contentData.社團經歷}</dd>
				</dl>
				<a href="" className="btn">基本資料修改</a><em>(只能修改自己喔!!)</em>
			</section>

			<section className="float-r half">
				<h3>公司簡介</h3>
				<ImgList SetClass="float-l" imgsrc={this.state.contentData.imgsrc_company} />
				<h4></h4>
				<p>
					{this.state.contentData.公司簡介}
				</p>
				<h4>主要商品或服務項目</h4>
				<p>{this.state.contentData.服務項目}
				</p>
			</section>

			<section className="clear">
				<h3>產品簡介</h3>
				<div className="table-responsive">
					<table className="pro-list">
					{
						this.state.productData.map(function(itemData,i) {

							var subOutHtml =
							<tr key={i}>
							<td>
								<ImgList imgsrc={itemData.imgsrc} />
							</td>
							<td>
								<p>產品名稱： <em>{itemData.產品名稱}</em></p>
								<p>產品特色： {itemData.產品特色}</p>
								<p>參考價格：<em>{itemData.價格}</em></p>
								<p>價格說明：{itemData.價格說明}</p>
								<p>點閱率：<em>{itemData.點閱率}</em></p>
							</td>
							</tr>;
							return subOutHtml;
						})
					}
					</table>
				</div>
			</section>
		</div>
			);

		return outHtml;
	}
});

var comp = React.render(<PageContent />,document.getElementById('PageContent'));