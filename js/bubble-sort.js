self.addEventListener('message', function(e) {
	var data = e.data;
	var inputArr = data.arr;
	switch (data.msg) {
    case 'start':
			bubbleSort(inputArr, 1, 0);
			break;
    case 'stop':
      self.close(); 
      break;
    default:
      self.postMessage('Nieznana wiadomosc' + data.msg);
  };
}, false);


function bubbleSort(inputArr, i, k) {
	if( (inputArr.length - k) < 2 ){
		postMessage(JSON.stringify( "stop" ));
	} else { 
	
		var responseArr = [];
		var temp = [];
		
		//Clear previous selection
		inputArr.forEach(function(entry) {
			entry["isSelected"] = 0;
		});
		
		if( i == (inputArr.length - k) ){
			i = 1;
			k++;
		}

		for (var j = i; j < inputArr.length - k; j++) {
			if( Number(inputArr[i-1]["value"]) >= Number(inputArr[i]["value"]) ){
				
				temp = inputArr[i-1]["value"];
	
				//Copy values
				inputArr[i-1]["value"] = inputArr[i]["value"];
				inputArr[i]["value"] = temp;
				
				//Set numbers selection
				inputArr[i]["isSelected"] = 1;
				inputArr[i-1]["isSelected"] = 1;
				break;
			} else{
				inputArr[i-1]["isSelected"] = 1;
				inputArr[i]["isSelected"] = 1;
				break;
			}
		}
		
		postMessage(JSON.stringify( inputArr ));
		setTimeout(bubbleSort,500,inputArr, i+1, k);
	}
}


 