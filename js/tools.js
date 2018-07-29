//===============工具函数=============

function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	if (k > set.length || k <= 0) {
		return [];
	}
	if (k == set.length) {
		return [set];
	}

	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}

	var combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i + 1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

function combinations(set) {
	var k, i, combs, k_combs;
	combs = [];

	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}

function arrToString(s_arr){
	let ss=''; //返回的字符串
	for(let i =0;i<s_arr.length;i++){
		for(let j =0;j<s_arr[i].length;j++){
			if(j ==s_arr[i].length-1){
				ss = ss+('0'+s_arr[i][j]).slice(-2);
			}else{
				ss = ss+('0'+s_arr[i][j]).slice(-2)+" ";
			}
		}
		ss=ss+';';
	}
	return ss.slice(0,-1);
}

//定胆过滤  
function dan(s_arr,d_arr,d_times){
	if(s_arr.length==0 || d_arr.length==0 || d_times.length ==0){return s_arr}
	let ss_arr=[]; //返回数组
	for(let i =0;i<s_arr.length;i++){
		if( d_times.indexOf(in_times(s_arr[i],d_arr)) != -1){
			ss_arr.push(s_arr[i]);
		}
	}
	return ss_arr;
}

//判断一个数组中的各元素，在另一个数组中出现几次
function in_times(s1_arr,d1_arr){
	if(s1_arr.length==0 || d1_arr.length==0){return 'error'}
	let m =0;
	for(var i = 0; i< s1_arr.length; i++){
		//console.log('当前数字:'+s1_arr[i]);
		if(d1_arr.indexOf(s1_arr[i]) != -1){
			//console.log(s1_arr[i]+'在数组中');
			m++;
		}
	}
	return m;
}

//偶数个数过滤
function f_2(s_arr,d_times){
	if(s_arr.length==0 || d_times.length == 0){return s_arr}
	
	let ss_arr =[]; //返回数组
	for(let i=0;i<s_arr.length;i++){
		//console.log('当前数组:');
		//console.log(s_arr[i]);
		let times=0;
		for(let j =0;j<s_arr[i].length;j++){
			if(!(s_arr[i][j]%2)){times++}
		}
		if(d_times.indexOf(times) != -1){ ss_arr.push(s_arr[i])};
	}
	return ss_arr;
}

//合数个数过滤
function h_2(s_arr,d_times){
	if(s_arr.length==0 || d_times.length == 0){return s_arr}
	let ss_arr =[];  //返回数组
	for(let i = 0; i<s_arr.length; i++){
		let times = 0;
		for (let j = 0;j<s_arr[i].length; j++){
			if(([4,6,8,9,10].indexOf(s_arr[i][j])) != -1){times++}
		}
		if(d_times.indexOf(times) != -1){ ss_arr.push(s_arr[i])};
	}
	return ss_arr;
}

//小数个数过滤
function xiao_2(s_arr,d_times){
	if(s_arr.length==0 || d_times.length == 0){return s_arr}
		let ss_arr =[];  //返回数组
	for(let i = 0; i<s_arr.length; i++){
		let times = 0;
		for (let j = 0;j<s_arr[i].length; j++){
			if(([1,2,3,4,5].indexOf(s_arr[i][j])) != -1){times++}
		}
		if(d_times.indexOf(times) != -1){ ss_arr.push(s_arr[i])};
	}
	return ss_arr;
}


//连号个数过滤
function lian_2(s_arr,d_times){
	if(s_arr.length==0 || d_times.length == 0){return s_arr}
	let ss_arr =[];  //返回数组
	for(let i = 0; i<s_arr.length; i++){
		let times = 0;
		for (let j = 0;j<s_arr[i].length; j++){
			if((s_arr[i][(j+1)] - s_arr[i][j]) == 1){times++}
		}
		if(d_times.indexOf(times) != -1){ ss_arr.push(s_arr[i])};
	}
	return ss_arr;
}

//按倍投方式选号:重2,3;小数2,3;连数1,2
function bei(dan1){
        let dan1_times = [2,3];
        let xiao_ = [2,3];
        let lian_ = [1,2];
        let arr11 = [1,2,3,4,5,6,7,8,9,10,11];
        let arr462 = k_combinations(arr11,5);
        let r = [];//返回数组
            r = dan(arr462,dan1,dan1_times);
            r = xiao_2(r,xiao_);
            r = lian_2(r,lian_);
            return r;
            
};
//生成到秒的时间字符串
function time_str(){
    let n = new Date();
    let s = '';
     //s = n.getFullYear()+('00'+(n.getMonth()+1)).substr(-2)+n.getDate()+'-'+n.getHours()+n.getMinutes()+n.getSeconds();
	 //s = n.getFullYear()+('00'+(n.getMonth()+1)).substr(-2)+('00'+n.getDate()).substr(-2)+'-'+('00'+n.getHours()).substr(-2)+('00'+n.getMinutes()).substr(-2)+('00'+n.getSeconds()).substr(-2);
	 s = ('00'+(n.getMonth()+1)).substr(-2)+'-'+('00'+n.getDate()).substr(-2)+' '+('00'+n.getHours()).substr(-2)+':'+('00'+n.getMinutes()).substr(-2)+':'+('00'+n.getSeconds()).substr(-2);
     return s;
    
}

//===========上面是选号工具函数=============