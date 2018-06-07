self.addEventListener('message', function(e) {
	var data = e.data;
	var inputArr = data.arr;
	switch (data.msg) {
    case 'start':
			insertSort(inputArr, 1);
			break;
    case 'stop':
      self.close(); 
      break;
    default:
      self.postMessage('Nieznana wiadomosc' + data.msg);
  };
}, false);


function insertSort(inputArr, i){
	
	if( i < inputArr.length ){
		
		
		var respondArr = [];
		var key = [];
		var j = i-1;
		
		key["value"] = inputArr[i]["value"];
		key["isSelected"] = 1;

		for(j = i-1 ; j>=0 ; j--){ 
			if(Number(inputArr[j]["value"]) >= Number(key["value"])){
				inputArr[j+1]["value"] = inputArr[j]["value"];
				inputArr[j+1]["isSelected"] = 1;
				
				inputArr[j]["value"] = key["value"];
				inputArr[j]["isSelected"] = key["isSelected"];
				
			}else{
				inputArr[j]["isSelected"] = 1;
				inputArr[j+1]["isSelected"] = 1;
				break;
			}	
		}
		
		postMessage(JSON.stringify( inputArr ));
		setTimeout(insertSort,500,inputArr, i+1);
	} else {
		postMessage(JSON.stringify( "stop" ));
	}
	
}

 