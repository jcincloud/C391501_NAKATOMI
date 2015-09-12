//[1]
//主元件 
var PageContent = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			contentData:{}
		};  
	},		
	componentDidMount:function(){

		jqGet(gb_approot + 'api/GetAction/GetNewsContentWWW',{id:gb_id})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({contentData:data});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});

		return;
	},
	render:function(){
		var context = null;
		if(this.state.contentData.內容!=undefined){
			context = this.state.contentData.內容.replace(replace_br,'<br />');
		}

		var outHtml = (
		<div>
			<article>
				<div className="date">
					<span>{moment(this.state.contentData.活動日期).format('DD')}</span>
					<span>{moment(this.state.contentData.活動日期).format('MMMM')}</span>
					<span>{moment(this.state.contentData.活動日期).format('YYYY')}</span>
				</div>

				<h3>{this.state.contentData.標題}</h3>
				<fieldset>
					<legend>活動資訊</legend>
					<div className="editor" dangerouslySetInnerHTML={{__html:context}}></div>
				</fieldset>
			</article>
			{/*
			<section className="download">
				<h6>相關檔案下載:</h6>
				<a href="" target="_blank">文件一</a>
				<a href="" target="_blank">文件二</a>
				<a href="" target="_blank">文件三</a>
				<a href="" target="_blank">文件四</a>
				<a href="" target="_blank">文件五</a>
			</section>
			*/}
		</div>
			);

		return outHtml;
	}
});

//元件嵌入 div id:PageContent
var comp = React.render(<PageContent dataUrl={gb_approot + 'api/GetAction/GetNewsWWW'} contextUrl={gb_approot + 'News/News_content?id='} />,document.getElementById('PageContent'));