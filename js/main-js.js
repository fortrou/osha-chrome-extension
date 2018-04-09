function authorization(login, password, need_hash) {
	var param_login = login || $("input[name=login]").val();
	var param_password = password || $("input[name=password]").val();
	var param_need_hash = need_hash || 0;
	$.ajax({
		url : 'http://online-shkola.com.ua/api/index.php' ,
		method : 'POST' ,
		dataType : 'json' , 
		data : {
				 login	   : param_login,
				 password  : param_password,
				 need_hash : param_need_hash,
				 flag	   : '1'
				} ,
		success : function (data) {
			if(data['authorized'] == 'fine') {
				check_accountHasAdded(data['login'] + '-+-'+data['password']);
				
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
				$(".workspace").hide(500);
				$(".workspace-" + level + " .avatar").attr('src', 'http://online-shkola.com.ua/upload/avatars/' + avatar);
				$(".workspace-" + level).show(500);
			}
		}
	});
}
function check_accountHasAdded(account_value) {
	chrome.storage.local.get('user_accounts', function(data) {
		var id_acc = 0;
		var accounts = [];
		var account_data = account_value.split('-+-');
		if(data.user_accounts != undefined && data.user_accounts.length) {
			accounts = data.user_accounts.split('--|--');
			for(var id in accounts) {
				var local_data = accounts[id].split('-+-');
				if(local_data[0] == account_data[0]) {
					id_acc = 1;
				}
			}
		} 
		console.log(id_acc)
		if(id_acc == 0) {
			add_accountToList(account_value);
		}
	});
}
function add_accountToList(account_value) {
	chrome.storage.local.get('user_accounts', function(data) {
		var accounts = [];
		if(data.user_accounts != undefined && data.user_accounts.length) {
			accounts = data.user_accounts.split('--|--');
		}
		accounts.push(account_value);
		var new_accounts = accounts.join('--|--');
		console.log(new_accounts);
		chrome.storage.local.set({'user_accounts' : new_accounts});
		get_accountsAll();
	});
}
function get_accountsAll() {
	var accounts;
	chrome.storage.local.get('user_accounts', function(data) {
		accounts = data.user_accounts;
		var logins = [];
		if(accounts != undefined && accounts.length) {
			accounts = accounts.split('--|--');
			for(var id in accounts) {
				login = accounts[id].split('-+-')[0];
				logins.push('<input type="button" class="change-profile" data-login="' + login + '" value="' + login + '">');
			}
		}
		if(logins.length) {
			var login_list = logins.join('');
			$("#profiles").empty().append(login_list);
			$( document ).ready(function() {
				$("#profiles .change-profile").click(function(){
					set_account($(this).attr("data-login"))
				})
			})
		}
	});
}

function set_account(account_value) {
	chrome.storage.local.get('user_accounts', function(data) {
		var account_params;
		accounts = data.user_accounts;
		accounts = accounts.split('--|--');
		for(var id in accounts) {
			var local_data = accounts[id].split('-+-');
			if(local_data[0] == account_value) {
				account_params = accounts[id];
				account_params = account_params.split('-+-');
				authorization(account_params[0], account_params[1], 1);
			}
		}
	})
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
function get_sentHomework(homeworks, page) {
	$.ajax({
		url : 'http://online-shkola.com.ua/api/index.php' ,
		method : 'POST' ,
		dataType : 'json' , 
		data : {
				 login	   : $("input[name=current-login]").val(),
				 id 	   : $("input[name=current-id]").val(),
				 homeworks : homeworks,
				 page 	   : page,
				 flag	   : '3'
				} ,
		success : function (data) {
			if(homeworks == 1) {
				$(".workspace-" + $("input[name = current-level]").val() + " .main-bar").empty().append(data['content']);
				$(".workspace-" + $("input[name = current-level]").val() + " .main-bar").append(data['pages']);
				$(".homework-data").hide(10);
				$( document ).ready(function() {
					$(".homework-block").click(function(){
						$(".homework-data").hide(10);
						$(this).children('.homework-data').show(100);
					})
					$(".homeworks-navigation li").click(function(){
						var page = $(this).attr("data-page");
						get_sentHomework(1, page);
					})
				})
			}
		}
	});
}
$( document ).ready(function() {
	$(".chat-ico").click(function(){
		get_chatData(1);
	})
	$(".homeworks-ico").click(function(){
		get_sentHomework(1, 1);
	})
	
	$(".workspace").hide(10);
	get_accountsAll();
    $("input[name=authorization]").click(function(){
    	authorization();
    })
    $("#profile-change input").click(function(){
		$(".workspace").hide(500);
		$("input[name=login]").val('');
		$("input[name=password]").val('');
		$(".authorization-form").show(500);

    })
});