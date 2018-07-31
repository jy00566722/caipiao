//contentScript测试脚本

function test3(){
		chrome.storage.local.get(null,function(result){
			console.log(result);
			let bet_record = result.bet_record;
			
	})
}

//计算总的赢亏
function winorloss(){
	chrome.storage.local.get(["bet_record"],function(result){
		let list = result.bet_record[lottery_0];
		let aMoney =0;
		let aBet=0;
		for(let i=0;i<list.length;i++){
			aMoney = aMoney + parseInt(list[i].winOrloss);
			if(list[i].bet_status=='已投注'){
				aBet++;
			}
		}
		console.log('%c========投注汇总========:','color:lime')
		console.log(`%c本轮一共连续投了%c${aBet}注`,'color:green','color:red');
		//console.log(`%c本轮连续投注总赢亏为:%c${aMoney}`,'color:green','color:red');
		console.log(`%c本轮连续投注总赢亏为:%c${aMoney.toFixed(4)}`,'color:green','color:red');
	})
}

//状态显示
function show_status(){
	chrome.storage.local.get(["bet_record"],function(result){
		let danwei = '';
		let danwei_info={
			li:'厘',
			fen:'分',
			jiao:'角',
			yuan:'元'
		};
		let lottery_info = {
			GD11Y:'广东',
			SH11Y:'上海',
			SD11Y:'山东',
			JX11Y:'江西'
		};
		let bei_m = '';
		if(bei_model=='bad_model'){
			bei_m='未中奖时翻倍';
		}else if(bei_model=='continuous_model'){
			bei_m='一直连续翻倍';
		}
		
		console.log('%c========当前自动投注的参数如下========:','color:lime');
		console.log(`%c当前投注站点:%c${lottery_info[lottery_0]}`,'color:green','color:red');
		console.log(`%c当前每注金额:%c${multiple_0}${danwei_info[result.bet_record[lottery_0][0].model]}`,'color:green','color:red');
		console.log(`%c当前的翻倍模式是:%c${bei_m}`,'color:green','color:red');
		console.log(`%c当前连续翻倍的次数:%c${bei_num}`,'color:green','color:red');
		winorloss();
		
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




