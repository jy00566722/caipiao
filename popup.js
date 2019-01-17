var botton_1 =  document.getElementById('button_1');
var lottery_1 =  document.getElementById('lottery');
var model_1 =  document.getElementById('model');
var multiple_1 =  document.getElementById('multiple');
var botton_2 =  document.getElementById('button_2');
var botton_3 =  document.getElementById('button_3');
var bei_num_1 =  document.getElementById('bei_num');
//var bei_model = document.getElementsByName('bei_model');


	

function sendMessageToContentScript(message, callback)
{	
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}

//获取radio的值
	function getRadioValue(radioName)
{
			var radios = document.getElementsByName(radioName);
			if(!radios)
			return '';
			for (var i = 0; i < radios.length; i++)
			{
				if (radios[i].checked)
				return radios[i].value;
			}
			return '';
}

//开始按钮
botton_1.onclick = function(){
	let bei_model_1 = getRadioValue("bei_model");
	
	get_code().then(function(code_1){
		//console.log('code:'+code_);
		let bet_record = {
			"GD11Y":[],
			"SH11Y":[],
			"SD11Y":[],
			"JX11Y":[]
		};
		let bet_info = {
				creat_time:'',//投注内容生成时间
				issue:'',//期号
				bet_number:0, //本注总数量
				content:'',//投注内容
				model:model_1.value,//投注金额单位 
				multiple:multiple_1.value,//投注金额数字
				code:code_1,//返利代码
				money:0,//本注投注金额
				bet_status:'-1',//投注状态  -1第一次按钮写进，未准备好的投注
				bet_time:'',//投注时间
				status:'',//开奖状态
				winMoney:0,//奖金
				winOrloss:0,//赢亏、
				bad_times:0  //本期之前连续5次未中奖次数 默认为0
			}
		bet_record[lottery_1.value].push(bet_info);
			chrome.storage.local.set({"bet_record":bet_record},function(){
		
		
					sendMessageToContentScript({
							cmd:'go',
							lottery:lottery_1.value,
							multiple:multiple_1.value,
							bei_num :bei_num_1.value,
							bei_model:bei_model_1
							}, function(response){
								console.log('来自content的回复：'+response)
							});
				});
			})
		}
		
botton_2.onclick= function(){
	sendMessageToContentScript({
				cmd:'stop'
	},function(response){
		console.log('来自content的回复：'+response);
	})
}
botton_3.onclick= function(){
	sendMessageToContentScript({
				cmd:'status'
	},function(response){
		console.log('来自content的回复：'+response);
	})
}

//获取code值，投注的时候要用
function get_code(){
	return new Promise(function(resolve,reject){
		chrome.cookies.getAll({"domain":"ya.jyang288.com","name":"USER_BDATA_CODE"},function(f_cookies){
							console.log(f_cookies);
							resolve(f_cookies[0].value);

        });
		});
}