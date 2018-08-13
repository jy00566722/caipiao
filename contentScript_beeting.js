//处理中奖信息,本文件

//获取用户最近10期投注信息
function search_order(){
	return new Promise(function(resolve,reject){
			let n = new Date();
			let sTime_ = n.getFullYear()+'-'+('00'+(n.getMonth()+1)).substr(-2)+'-'+('00'+n.getDate()).substr(-2)+' 00:00:00';
			let eTime_ = n.getFullYear()+'-'+('00'+(n.getMonth()+1)).substr(-2)+'-'+('00'+(n.getDate()+1)).substr(-2)+' 23:59:59';
		
		
			$.ajax({
			"type":"POST",
			"url":'http://jya.xinw188.com/yx/u/api/game-lottery/search-order',
			"data":{
				sTime:sTime_,
				eTime:eTime_,
				lotteryType:1,
				page:0,
				size:15
				},
			"datatype":'json'
			}).success((d,t)=>{
				
				if(d.code ==0){
					resolve(d);
				}else{
					console.log(d);
					reject(new Error("获取用户投注信息失败"));
				}

				}).error((x,t,e)=>{
				console.log(e);
				reject(new Error("获取用户投注信息失败"));
				});
})}


//获取用户所有的投注信息(storage中的)
function get_betting(){
	return new Promise(function(resolve,reject){
		chrome.storage.local.get(["bet_record"],function(result){
			
			resolve(result.bet_record);
		})
	})
}

//定期处理用户投注信息调用函数  是否中奖，奖金，赢亏的处理
function do_betting(){
		if(lottery_0 == '' ||multiple_0==0 ||bei_model==''||bei_num==0){
		console.log('do_betting:未按开始按钮初始化.');
		return;
	}
	Promise.all([search_order(),get_betting()]).then(function(result){
		//console.log(result);
		let order_list = result[0];
		let bet_list = result[1];
		if(bet_list[lottery_0].length==0){
			//console.log('do_betting:还没有投注信息,本次不能计算投注结果');
			return;
		}
		if(order_list.data.totalCount ==0){
			//console.log('do_betting:还没有订单信息，本次不能计算投注结果');
			return;
		}
		if(order_list.data.list[0].statusRemark=='未开奖'){
			//console.log('do_betting:有订单处于未开奖状态,先不处理开奖信息，等待下一次');
			return;
		}
		if(bet_list[lottery_0][0].status=='未投注'){
			//console.log('do_betting:有记录还没有投注,本次不计算中奖信息');
			return;
		}
		if(bet_list[lottery_0][0].status=='已派奖'){
			//console.log('do_betting:最后一期计算完毕，本次不用计算');
			return;
		}
		if(bet_list[lottery_0][0].status=='未中奖'){
			//console.log('do_betting:最后一期计算完毕，本次不用计算');
			return;
		}
		
		if(bet_list[lottery_0][0].status=='未开奖'){
			let b_issue = bet_list[lottery_0][0].issue;
			let lottery_info = {
				"GD11Y":'广东11选5',
				"SH11Y":'上海11选5',
				"SD11Y":'山东11选5',
				"JX11Y":'江西11选5'
			}
			let b_lottery = lottery_info[lottery_0];
			let money =0;
			let winMoney =0;
			let status = '';
			let bad_times =0;
				order_list = result[0].data.list;
			for(let i = 0;i<order_list.length;i++){
				if(order_list[i].lottery ==b_lottery && order_list[i].issue==b_issue){
					money = order_list[i].money;
					winMoney = order_list[i].winMoney;
					status = order_list[i].statusRemark;
				}
			}
			let winOrloss = (winMoney - money).toFixed(3);
			
			
			
			//处理连续未中信息  
			
			if(bei_model=='bad_model'){
						if(status=='已派奖'){
							bad_times=0;
						}else if(status=='未中奖'){	   
									if(bet_list[lottery_0].length>1){
											let c_issue = bet_list[lottery_0][1].issue;
											let c_bad_times = bet_list[lottery_0][1].bad_times;
											if(c_issue.substr(0,9)+('00'+(parseInt(c_issue.substr(-2))+1)).substr(-2) == b_issue){
														bad_times = c_bad_times +1;
													}
											if(bad_times==bei_num){
												bad_times=0;//归0
											}
									}else{
										bad_times=1;
									}
								
						} 
			}else if(bei_model=='continuous_model'){
						if(bet_list[lottery_0].length>1){
							let c_issue = bet_list[lottery_0][1].issue;
							let c_bad_times = bet_list[lottery_0][1].bad_times;
							if(c_issue.substr(0,9)+('00'+(parseInt(c_issue.substr(-2))+1)).substr(-2) == b_issue){
										bad_times = c_bad_times +1;
									}
							if(bad_times==bei_num){
								bad_times=0;//归0
							}
					}else{
						bad_times=1;
					}	

			}else{
				console.log("倍投模式是什么啊?")
			}	
			bet_list[lottery_0][0].money = money;
			bet_list[lottery_0][0].winMoney = winMoney;
			bet_list[lottery_0][0].status = status;
			bet_list[lottery_0][0].bad_times = bad_times;
			bet_list[lottery_0][0].winOrloss = winOrloss;
			
			
			chrome.storage.local.set({"bet_record":bet_list},function(){
				console.log('do_betting:%c计算开奖信息成功%c,等待生成下一期投注内容','color:green','color:black');
			})
			
		}
			
	})
}
