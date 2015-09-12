var ImgsContent = React.createClass({
	getInitialState: function() {  
		return { 
		};  
	},		
	componentDidMount:function(){
		return;
	},
	render:function(){
		var outHtml = null;
		var imgs = [];

		if(this.props.srcs!=undefined){
			for (var prop in this.props.srcs) {
				var src =  this.props.srcs[prop];
				imgs.push(<li className="item"><a href={src} className="fresco" data-fresco-group="shared_options"><img data-src={src} /></a></li>);
			}
		}
		outHtml = <ol className="pic-list">{imgs}</ol>;

		return outHtml;
	}
});

//[1]
//主元件 
var PageContent = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			contentData:{IContext:[]}
		};  
	},		
	componentDidMount:function(){

		jqGet(gb_approot + 'api/GetAction/GetActiveContentWWW',{id:gb_id})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({contentData:data});
			$(window).lazyLoadXT({ visibleOnly: false, edgeY: 200 });
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});

		return;
	},
	render:function(){

		var outHtml = (
		<div>
			<h3><em>{moment(this.state.contentData.活動日期).format('YYYY-MM-DD')}</em>{this.state.contentData.標題}</h3>
			{
				this.state.contentData.IContext.map(function(itemData,i) {
					var subOutHtml = 
					<div key={i}><h4 id={itemData.流水號}>{itemData.標題}</h4>
						<ImgsContent key={i} srcs={itemData.imgsrc} />
					</div>;
					return subOutHtml;
				}.bind(this))
			}
		</div>
			);

		return outHtml;
	}
});

//元件嵌入 div id:PageContent
var comp = React.render(<PageContent contextUrl={gb_approot + 'api/GetAction/GetActiveContentWWW?id='} />,document.getElementById('PageContent'));