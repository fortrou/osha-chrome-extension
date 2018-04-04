function authorization() {
	$.ajax({
		url : 'http://online-shkola.com.ua/api/index.php' ,
		method : 'POST' ,
		dataType : 'json' , 
		data : {
				 login	  : $("input[name=login]").val(),
				 password : $("input[name=password]").val(),
				 flag	  : '1'
				} ,
		success : function (data) {
			if(data['authorized'] == 'fine') {
				$(".authorization-form").hide(500);
				var level = 'student';
				switch(data['level']) {
					case "1": 
						level = 'student';
						break;
					case "2": 
						level = 'teacher';
						break;
					case "4":
						level = 'admin';
						break;
				}
				$("input[name = current-level]").val(level);
				$("input[name = current-id]").val(data['id']);
				$("input[name = current-login]").val(data['login']);
				var avatar = '';
				if(data['avatar'] == '') {
					avatar = 'default.jpg';
				} else {
					avatar = data['avatar'];
				}
				$(".workspace-" + level + " .avatar").attr('src', 'http://online-shkola.com.ua/upload/avatars/' + avatar);
				$(".workspace-" + level).show(500);
			}
		}
	});
}
function get_chatData(messages) {
	$.ajax({
		url : 'http://online-shkola.com.ua/api/index.php' ,
		method : 'POST' ,
		dataType : 'json' , 
		data : {
				 login	  : $("input[name=current-login]").val(),
				 id 	  : $("input[name=current-id]").val(),
				 messages : messages,
				 flag	  : '2'
				} ,
		success : function (data) {
			if(messages == 1) {
				$(".workspace-" + $("input[name = current-level]").val() + " .main-bar").empty().append(data);
			}
		}
	});
}
$( document ).ready(function() {
	$(".chat-ico").click(function(){
		get_chatData(1)
	})	
	$(".workspace").hide(10);
    $("input[name=authorization]").click(function(){
    	authorization()
    })
});