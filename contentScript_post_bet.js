function post_bet(){
		if(lottery_0 == '' ||multiple_0==0 ||bei_model==''||bei_num==0){
		console.log('post_bet:未按开始按钮初始化.');
		return;
	}
	get_bet().then(function(bet_record){
		//console.log(bet_record);
		//console.log(bet_record[lottery_0][0]);
		
		if(bet_record[lottery_0][0].bet_status=='待投注'){
			let info = bet_record[lottery_0][0];
			//投
			a_post(info).then(function(post_result){
				if(post_result.code==0){
					bet_record[lottery_0][0].bet_status = '已投注';
					bet_record[lottery_0][0].bet_time = time_str();
					bet_record[lottery_0][0].status = '未开奖';
					chrome.storage.local.set({"bet_record":bet_record},function(){
						console.log('post_bet:%c投注成功%c,更新投注状态成功,等待开奖','color:green','color:black');
					});
					
				}else if(post_result.code==1){
					//投注出现错误  需要收集错误信息来分别处理
					//do_something
					console.log('post_bet:投注失败了');
					
				}
			}).catch(function(e){
				console.log(e);
			})
		}else{
			//console.log('post_bet:没有"未投注"状态的记录...');
		}
	}).catch(function(e){
		console.log(e);
	})
}


function get_bet(){
	return new Promise(function(resolve,reject){
		chrome.storage.local.get(["bet_record"],function(result){
			//console.log('从storage中取出的记录');
			//console.log(result);
			
			resolve(result.bet_record);
		})
	})
}

//投注函数
function a_post(info){
	return new Promise(function(resolve,reject){
				//console.log('a_post调用...');
				let post_data = [{
				lottery:lottery_0,
				issue:info.issue,
				method:'rx5ds',
				content:info.content,
				model:info.model,
				multiple:info.multiple,
				code:info.code,
				compress:false
			}];
			$.ajax({
				"type":"POST",
				"url":'http://jya.xinw188.com/yx/u/api/game-lottery/add-order',
				"data":{
					text:JSON.stringify(post_data)
					},
				"datatype":'json'
				}).success((d,t)=>{
					console.log(d);
					if(d.code==0){
						return resolve(d);
					}else{
						//投注失败，通知用户//再投
						//console.log(d);
						resolve(d);
					}
					}).error((x,t,e)=>{
					console.log(e);
						reject(new Error('post_bet:投注失败'));
					});
});
}