
var MemberLoginContent = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
		};  
	},		
	componentDidMount:function(){
		return;
	},
	mClick:function(e){

	},
	d1Click:function(e){

	},
	render:function(){
		var outHtml = (
			<div>
			    <menu>
			        <button type="button" id="menu-toggle" className="md-trigger icon-menu" data-modal="menu">MENU</button>
			        <button type="button" className="md-trigger icon-switch" data-modal="login">LOGIN</button>
			        <button type="button" className="md-trigger icon-plus" data-modal="joinus">JOIN US</button>
			    </menu>
		        <div className="md-modal" id="login">
		            <div className="md-content">
		                <h3>LOGIN</h3>
		                <form>
		                    <p><label>帳號</label><input type="text" required /></p>
		                    <p><label>密碼</label><input type="password" required /></p>
		                    <ul className="text-list">
		                        <li>帳號為您的會員編號，密碼預設為出生年月日(例如610203)</li>
		                        <li>登入後請修改您的密碼，謝謝!</li>
		                    </ul>
		                    <button type="submit" className="btn">登入</button>
		                </form>
		                <button className="md-close icon-close">關閉視窗</button>
		            </div>
		        </div>
		        <div className="md-modal" id="joinus">
		            <div className="md-content">
		                <h3>JOIN US</h3>
		                <form>
		                    <p><label>姓名</label><input type="text" /></p>
		                    <p><label>聯絡電話</label><input type="text" /></p>
		                    <p><label>聯絡住址</label><input type="text" /></p>
		                    <p><label>電子信箱</label><input type="text" /></p>
		                    <p><label>興趣</label><input type="text" /></p>
		                    <button className="btn" type="submit">送出資訊</button>
		                </form>
		                <button className="md-close icon-close">關閉視窗</button>
		            </div>
		        </div>
			</div>
		);

		return outHtml;
	}
});

var compMemberLogin = React.render(<MemberLoginContent />,document.getElementById('MemberLogin'));