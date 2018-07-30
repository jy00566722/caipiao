console.log('金洋自动投注系统开始加载...');
 
var lottery_0='';//定义好要投的站点，暂时只同时投一个站，后续再修改  var lottery_0='GD11Y';  var lottery_0='SH11Y';
var multiple_0=0;  //定义最开始的底注     var multiple_0=2;
var bei_model=''; //定义倍投模式
var bei_num = 0;  //定义连续倍投次数



//监听开始函数 从按钮接收信息 开始投注
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if(request.cmd == 'go') {
		lottery_0 = request.lottery;
		multiple_0 = parseInt(request.multiple);
		bei_model = request.bei_model;
		bei_num = parseInt(request.bei_num);
		//calc_bet();
		console.log('接收到设置信息,设置OK');
		};
	if(request.cmd =='stop'){
		lottery_0='';
		multiple_0 = 0;
		console.log('接收到停止指令,清空投注信息');
	};
    sendResponse('收到了消息,开始投注');
});

//开奖信息获取
function open_code(){
	let lottery = lottery_0;
	return new Promise(function(resolve,reject){
	$.ajax({
	"type":"POST",
	"url":'http://jya.xinw188.com/yx/u/api/game-lottery/static-open-code',
	"data":{'name':lottery,'history':'true'},
	"datatype":'json'
	}).success((d,t)=>{
			resolve(d);
		}).error((x,t,e)=>{
			console.log(t);
			console.log(e)
		reject(new Error("calc_bet:获取开奖信息出错..."));
		
	});
})}

//纯计算投注内容，等后续程序投注
function calc_bet(){
	if(lottery_0 == '' ||multiple_0==0 ||bei_model==''||bei_num==0){
		console.log('calc_bet:未按开始按钮初始化.');
		return;
	}
	Promise.all([open_code(),get_bet_record_storage()]).then(function(result){
		if(result[0].code==1){
			console.log("calc_bet:获取开奖信息出错...");
			return;
		}
		if(result[0][0].code === null){
			console.log('calc_bet:开奖中,无法计算下一注内容，稍等');
			return;
		}	
		
		if(result[1][lottery_0].length==0){
			console.log('calc_bet:记录为空，无法计算下一注信息:没有点开始按钮');
			return;
		}
		if(result[1][lottery_0][0].bet_status =='待投注'){
			console.log('calc_bet:有"待投注"记录，本次不计算投注内容');
			return;
		}
		if(result[1][lottery_0][0].status=='未开奖'){
			console.log('calc_bet:有"待开奖"记录,本次不计算投注内容');
			return;
		}
		let issue = result[0][0].issue;  //上一期开奖期号
		let issue_info = {
			"GD11Y":84,
			"SH11Y":90,
			"SD11Y":87,
			"JX11Y":84
		};
		let code = result[0][0].code;
		if(parseInt(issue.substr(-2))===issue_info[lottery_0]){
			console.log("calc_bet:已经是当天最后一期");
			return;
		}
		//计算下一注投注内容
		code = (code.split(',')).map(Number);
		let r = bei(code);  //投注内容的数组
		let bet_number = r.length;
		let content = arrToString(r);
			issue = issue.substr(0,9)+('00'+(parseInt(issue.substr(-2))+1)).substr(-2);//下期期号
		//处理奖金数字是否翻倍
		let code_ = result[1][lottery_0][0].code;//返利代码
		let model = result[1][lottery_0][0].model;//投注单位
		let bad_times = result[1][lottery_0][0].bad_times;
		let bet_status = result[1][lottery_0][0].bet_status;//上一注的投注状态
		let multiple = multiple_0*(Math.pow(2,bad_times)); //下一注投注金额的数字
		let creat_time = time_str();
		if(bet_status =='-1'){
			//console.log('calc_bet:新注:更新投注内容');
			//let multiple = result[1][lottery_0][0].multiple;
			let this_bet = result[1][lottery_0][0];
				this_bet.creat_time = creat_time;
				this_bet.issue = issue;
				this_bet.bet_number = bet_number;
				this_bet.content = content;
				this_bet.model = model;
				this_bet.multiple = multiple;
				this_bet.code = code_;
				this_bet.bet_status = '待投注';
				this_bet.status = '未投注';
				//console.log(this_bet);
				//console.log('====');
				console.log(result[1]);
				chrome.storage.local.set({"bet_record":result[1]},function(){
					console.log('calc_bet:%c生成新的待投注成功%c,准备投注','color:green','color:black');
				})
		}
			
		if(bet_status =='已投注'){
			//console.log('新注:增加1注');
			let this_bet = {};
				this_bet.creat_time = creat_time;
				this_bet.issue = issue;
				this_bet.bet_number = bet_number;
				this_bet.content = content;
				this_bet.model = model;
				this_bet.multiple = multiple;
				this_bet.code = code_;
				this_bet.bet_status = '待投注';
				this_bet.money = 0;
				this_bet.bet_time ='';
				this_bet.status='未投注';
				this_bet.winMoney = 0;
				this_bet.winOrloss = 0;
				
				
				this_bet.bad_times=0; //未计算
				
				
			result[1][lottery_0].unshift(this_bet);	
			chrome.storage.local.set({"bet_record":result[1]},function(){
				console.log('calc_bet:%c生成新的待投注成功%c,准备投注了','color:green','color:black');
				})				
		}
		
		
		
		
	}).catch(function(e){
		
		console.log(e);
	})
}

//计算投注内容
function calc_code(info){
	//console.log('calc_code调用');
	return new Promise(function(resolve,reject){
		let issue_info = {
			"GD11Y":84,
			"SH11Y":90,
			"SD11Y":87,
			"JX11Y":84
		};
		let  code = info[0].code;  //开奖号码
		let  issue = info[0].issue;
		let lottery = info[0].lottery;
		if (parseInt(issue.substr(-2))===issue_info[lottery]){
			return reject(new Error("calc_bet:已经是当天最后一期"));
		}

		    code = (code.split(',')).map(Number);
		let r = bei(code);  //投注内容的数组
		let content = arrToString(r);
		  //console.log(r);
		//期号处理，不考虑第二天的情况
		 issue = issue.substr(0,9)+('00'+(parseInt(issue.substr(-2))+1)).substr(-2);
		 //处理金额是否翻倍
		 let model = '';
		 let multiple=0;
		 
		 chrome.storage.local.get(['bad',"lottery","model","multiple","code"], function(result) {
			if (result.bad ===0){
				multiple = result.multiple;
			}else{
				multiple = result.multiple*result.bad;
			}
			model = result.model;
			code_ =  result.code;
			let info_all = {
				"lottery":lottery,
				"issue"  :issue,
				"content":content,
				"model":model,
				"multiple":multiple,
				"code":code_,
				"go_post":1,				//可以投注信号
				"betting_nums":r.length,
				"betting":1  //投注倍数，手工增加时为第一注，为1
			};
			console.log(info_all);
			//写入投注内容到storage
			chrome.storage.local.set(info_all,function(){
				resolve("go");//可以投注了
			})
        });
	})
}

//获取以前的投注内容，最后一注 获取整个bet_record结构，便于存储
function get_bet_record_storage(){
	let lottery = lottery_0;
	//console.log(lottery);
	return new Promise(function(resolve,reject){
		chrome.storage.local.get("bet_record",function(result){
			//console.log('===get storage===');
			//console.log(result.bet_record);
			/*
			if(result.bet_record[lottery].length ==0){
				console.log('记录中没有内容，不能生成新注');
				return reject(new Error('bet_record中没有记录,不能生成投注内容'));
			}
			if(result.bet_record[lottery][0].bet_status=='待投注'){
				console.log('有"未投注"的记录，本次不生成新记录');
				return reject(new Error('有投注记录还没有投注，现在不计算下一注投注内容'));
			}
			if(result.bet_record[lottery][0].status=='未开奖'){
				console.log('有"未开奖"记录，本次不生成新记录');
				return reject(new Error('有投注记录没有开奖，现在不计算下一注投注内容'));
			}
			*/
			resolve(result.bet_record);
		})
	})
}


