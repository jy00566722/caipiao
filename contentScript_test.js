//contentScript测试脚本


function test1(){
	get_betting().then(function(result){
		console.log(result);
		
	})
}

function test2(){
	let betting_record={
		'GD11Y':[],
		'SH11Y':[],
		'SD11Y':[],
		'JX11Y':[]
	}
	let betting_info1 = {
	bet_time : "07-21 09:57:08",
	issue : "20180721-06",
	bet_nums : 218,
	bet_money : 0,
	bet_winmoney : 0,
	bet_result :0,
	bet_status : '未开奖'
	
}
	betting_record["GD11Y"].push(betting_info1);
	chrome.storage.local.set({"betting_record":betting_record},function(){
	console.log('写入成功');
})
}
function test3(){
		chrome.storage.local.get(null,function(result){
			console.log(result);
			let bet_record = result.bet_record;
			
	})
}

function test3a(){
		chrome.storage.local.get(["bet_record"],function(result){
			//console.log(result);
			let bet_record = result.bet_record;
				//console.log(bet_record["GD11Y"]);
				//bet_record["GD11Y"][0].bet_status = '已投注';
				//bet_record["GD11Y"][0].status = '未开奖';
				bet_record["GD11Y"][0].multiple = 2;
				
				chrome.storage.local.set({"bet_record":bet_record},function(){
					console.log('修改成功');
				})
			
	})
}
function test11(){
 return new Promise(function(resolve,reject){
	 //reject(new Error("出错了"));
	 Promise.reject('出错了哟2222');
	 //resolve('正确 了');
 })
}
 function test4(){
	 test11().then(function(a){
		 console.log(a);
		 console.log('正常了');
	 }).catch(function(e){
		 //console.log(e);
		 console.log("出错了...啊啊啊");
	 })
 }
 
//任务开始
console.log('启动系统OK,请设置投注参数:');
setTimeout(function(){
	setInterval(calc_bet,45000)
},30000);
setTimeout(function(){
	setInterval(post_bet,45000)
},50000);
setTimeout(function(){
	setInterval(do_betting,45000)
},65000);

function go_clear(){
	console.clear();
	console.log('%c金洋自动投注%c清理日志成功,还在运行中','color:green','color:black');
}
setTimeout(function(){
	setInterval(go_clear,300000);
},180000)




