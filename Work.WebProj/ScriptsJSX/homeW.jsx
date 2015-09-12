	//[1-1]
	//子元件 Section區段
	var SectionText = React.createClass({
		mixins: [React.addons.LinkedStateMixin], 
		getInitialState: function() {  
			return { 
				textData:[]
			};  
		},
		componentDidMount:function(){

			jqGet(this.props.dataUrl,{page:1,y:null,keyword:null})
			.done(function(data, textStatus, jqXHRdata) {
				this.setState({textData:data.rows});
			}.bind(this))
			.fail(function( jqXHR, textStatus, errorThrown ) {
				showAjaxError(errorThrown);
			});
			return;
		},
		shouldComponentUpdate:function(nextProps,nextState){
			return true;
		},
		render:function(){

			var outHtml = (
	        	<section id={this.props.sectionId}>
	            	<h4>LATEST NEWS</h4>
	            	<ul>
					{
						this.state.textData.map(function(itemData,i) {
							var subOutHtml = <li key={i}><a href={this.props.contextUrl + itemData.流水號}><em>{moment(itemData.活動日期).format('YYYY-MM-DD')}</em>{itemData.標題}</a></li>;
							return subOutHtml;
						}.bind(this))
					}
	            	</ul>
	        	</section>
				);

			return outHtml;
		}
	});

	//[1-2]
	//子元件 Section區段 圖片
	var SectionPhoto = React.createClass({
		mixins: [React.addons.LinkedStateMixin], 
		getInitialState: function() {  
			return { 
				textData:[]
			};  
		},
		componentDidMount:function(){
			jqGet(this.props.dataUrl,{page:1,y:null})
			.done(function(data, textStatus, jqXHRdata) {
				this.setState({textData:data.rows});
			}.bind(this))
			.fail(function( jqXHR, textStatus, errorThrown ) {
				showAjaxError(errorThrown);
			});
			return;
		},
		shouldComponentUpdate:function(nextProps,nextState){
			return true;
		},
		render:function(){

			var outHtml = (
	        	<section id={this.props.sectionId}>
	            	<h4>ACTIVITIES</h4>
	            	<ol className="pic-list">
					{
						this.state.textData.map(function(itemData,i) {
							var subOutHtml = 
							<li key={i}><a href={this.props.contextUrl + itemData.流水號}>
							<ImgList imgsrc={itemData.imgsrc} />
							<em>{moment(itemData.活動日期).format('YYYY-MM-DD')} {itemData.標題}</em>
							</a>
							</li>;
							return subOutHtml;
						}.bind(this))
					}
	            	</ol>
	        	</section>
				);

			return outHtml;
		}
	});	

//[1]
//主元件 Tabs集合區段
var TabTexts = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
		};  
	},
	render:function(){

		var outHtml = (
			<span>
				<SectionText sectionId="sec1" dataUrl={gb_approot + 'api/GetAction/GetNewsWWW'} contextUrl={gb_approot + 'News/News_content?id='} />
				<SectionPhoto sectionId="sec2" dataUrl={gb_approot + 'api/GetAction/GetActiveWWW'} contextUrl={gb_approot + 'Activities/Activities_content?id='} />
				<SectionText sectionId="sec3" dataUrl={gb_approot + 'api/GetAction/GetShareWWW'} contextUrl={ gb_approot + 'Doc/Doc_content?id='} />
				<SectionText sectionId="sec4" dataUrl={gb_approot+'api/GetAction/GetMeetingWWW'} contextUrl={gb_approot + 'Doc/Doc_content?id='} />
			</span>
			);

		return outHtml;
	}
});

//程式簽入 id:tabContent
var comp = React.render(<TabTexts />,document.getElementById('tabContent'));