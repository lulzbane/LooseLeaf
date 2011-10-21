var render = {};

(function() {

var post = [
'<%= post.user %>',
'<%= post.user2 %>',
'<div class="content">',
'  <div class="page-header clearfix">',
'    <h1><a href=""><%= post.title %></a> <small>Supporting text or <a href="#">tagline</a></small></h1>',
'    <ul class="info">',
'      <li class="icon"><img src="<%= post.user.icon %>" alt="<%= post.user.username %>" /></li>',
'      <li class="timeago" title="<%= post.created_at %>"><%= $.timeago(post.created_at) %></li>',
'    </ul>',
'  </div>',
' <%= JSON.stringify(post.user) %>',
'  <div class="row">',
'    <div class="span10">',
'    <%= post.body %>',
'    </div>',
'  </div>',
'</div>',
''].join('\n');

var ejs = require('ejs');
render.post = ejs.compile(post);

})();

