var numbOfEntries = 0;
var isWebWorkerWorking = false;
var isBubbleSortOn = false;
var isInsertSortOn = false;
var workerBubble = undefined;
var workerInsert = undefined;
var bubbleSortFile = "js/bubble-sort.js";
var insertSortFile = "js/insert-sort.js";

	
function addElement(){
	var newDiv, newContent;
	var parentDiv = $("#numbArr");
	var addNumber = $("#numb").val();

	//Clear input
	$("#numb").val("");

	if(addNumber == "-")
		alert("Nieprawidłowa liczba!");
	else{
		//Increase number of entered elements
		numbOfEntries = ++numbOfEntries;

		//Creates new div and enters number to div
		newDiv = $("<div></div>").text(addNumber);
		newDiv.attr("id", numbOfEntries);

		//Add new div to parent div
		parentDiv.append(newDiv);
		
		setWidthForNumbers();
		setFontSizeForNumbers();
		
		//Check button settings
		inputButtonsLock();
		sortButtonsLock();
	}
}
				
function removeAllElements(){
	$("#numbArr").find( "div" ).remove();
	$("#bubbleArr").find( "div" ).remove();
	numbOfEntries = 0;
	inputButtonsLock();
	sortButtonsLock();
}

function removeLastElement(){
	$("#numbArr div:last").remove();
	--numbOfEntries;
	setWidthForNumbers();
	setFontSizeForNumbers();
	inputButtonsLock();
	sortButtonsLock();
}

function inputButtonsLock(){
	var submitButton = $("#submit");
	var deleteLastButton = $("#deleteLast");
	var deleteButton = $("#delete");
	var maxNumbOfEntries = 10;

	/*Default*/
	submitButton.prop("disabled", false);
	deleteLastButton.prop("disabled", false);
	deleteButton.prop("disabled", false);

	if(!isWebWorkerWorking ){
		if(numbOfEntries == 0){
			deleteLastButton.prop("disabled", true);
			deleteButton.prop("disabled", true);
		}else if( numbOfEntries >= maxNumbOfEntries){
			submitButton.prop("disabled", true);
		}
	}else{
		submitButton.prop("disabled", true);
		deleteLastButton.prop("disabled", true);
		deleteButton.prop("disabled", true);
	}
}

function sortButtonsLock(){
	var minNumbOfEntries = 2;
	var bubbleOnButton = $("#webWorkerBubbleOn");
	var bubbleOffButton = $("#webWorkerBubbleOff");
	var insertOnButton = $("#webWorkerInsertOn");
	var inserOffbutton = $("#webWorkerInsertOff");

	/*Deafault*/
	bubbleOnButton.prop("disabled", true);
	bubbleOffButton.prop("disabled", true);
	insertOnButton.prop("disabled", true);
	inserOffbutton.prop("disabled", true);

	/* Sortowanie tablicy wiekszej niż 2 elementy*/
	if( isBubbleSortOn ){
		bubbleOffButton.prop("disabled", false);
	}else if(numbOfEntries > minNumbOfEntries){
		bubbleOnButton.prop("disabled", false);
	}
		
	if( isInsertSortOn ){
		inserOffbutton.prop("disabled", false);
	}else if(numbOfEntries > minNumbOfEntries){
		insertOnButton.prop("disabled", false);
	}
}

function setWidthForNumbers(){
	var parentWidth = $('#numbArr').width();
	var childDivs = $('#numbArr').children('div');
	var width = 0;
	
	width = ( parentWidth - 100 - (numbOfEntries)*10*2);

	if(numbOfEntries <= 3){
		width /=  3;
	} else{
		width /= numbOfEntries;
	}
	
	setDimensions(childDivs, width);
}

function setFontSizeForNumbers(){
	var childDivs = $('#numbArr').children('div');
	var smallestFontSize = 300;
	var fontSize = 300;
	
	//Calculate font-size for div depend on length of entered number 
	childDivs.each(function (index, singleDiv) {
		fontSize = ( $(singleDiv).width() / $(singleDiv).text().length ) * 1.2;

		if( fontSize < smallestFontSize ){
			smallestFontSize = fontSize;
		} 
	});
	
	//Set smallest calculated font-size for all divs
	if(smallestFontSize > 0){
		childDivs.each(function () {
			setFontSize($(this), smallestFontSize);
		});
	}
}

function showHeader(headerId){
	$("#"+headerId).css({"display": "block"});
}

function setFontSize(element, fontSize){
	element.css("font-size", fontSize);
}

function setDimensions(element, length){
	element.css( { "width": length + "px", "height": length + "px", "line-height": length + "px" } );
}

function webWorkerBubbleStart(){
	isBubbleSortOn = true;
	sortArea = "#bubbleArr";
	showHeader("bubbleHeader");
	webWorkerStart("bubble", sortArea);
}

function webWorkerInsertStart(){
	isInsertSortOn = true;
	sortArea = "#insertArr";
	showHeader("insertHeader");
	webWorkerStart("insert", sortArea);
}

function webWorkerStart(mode, sortArea){
	isWebWorkerWorking = true;
	var workerObj = undefined;
	var fadeInterval = 500;
	var numbersToSort = [];
	var originalNumbers = $('#numbArr').children('div');
	
	inputButtonsLock();
	sortButtonsLock();
	$(sortArea).hide();
	
	//Copy entered numbers 
	var enteredNumbers = $('#numbArr').html();
	$(sortArea).html(enteredNumbers);
	
	$(sortArea).fadeIn(fadeInterval, function() {
		
		//Copy numbers to sort to array
		originalNumbers.each(function (index, divElement) {
			numbersToSort.push({ "value": $(divElement).text(), "isSelected" : 0});
		});
		
		if(typeof(Worker) !== "undefined" ) {	
					if(typeof(workerObj) == "undefined") {
						workerObj = createWorker(mode);
					} 
				   
					workerObj.postMessage({ 'msg':'start','arr': numbersToSort});			
					workerObj.addEventListener('message', function(respond){
						processWorkerRespond(JSON.parse(respond.data), mode, sortArea);
					}, false);

		} else {
			sortArea.html( "Przeglądarka nie obsługuje Web Workerów");
		}
	});
}

function processWorkerRespond(webWorkerRspnd, mode, sortArea){
	var newDiv;
	var width = $('#numbArr').children('div').width();
	var fontSize = $('#numbArr').children('div').css('font-size');

	if( webWorkerRspnd == 'stop'){
		webWorkerStop(mode);

		if(mode == "insert"){
			$(sortArea).children('div').each(function () {
				$(this).removeClass( 'selected' );
			});
		}
	}else{ 
		$(sortArea).html("");
		webWorkerRspnd.forEach(function(number) {

			newDiv =  $("<div></div>").text(number["value"]);

			if(number["isSelected"] == 1){
				newDiv.addClass("selected");
			}
						
			setDimensions(newDiv, width);
			setFontSize(newDiv, fontSize);
			$(sortArea).append(newDiv);	
		});
	}
}

function createWorker(mode){
	if(mode == "bubble"){ 
			workerBubble = new Worker(bubbleSortFile);
			return workerBubble;
	} else if(mode == "insert"){
			workerInsert = new Worker(insertSortFile);
			return workerInsert;
	}
}

function webWorkerStop(mode) { 
	isWebWorkerWorking = false;
	var workerObj = undefined;

	if(mode == "bubble"){
		isBubbleSortOn = false;
		workerObj = workerBubble;
	}else if(mode == "insert")	{
		isInsertSortOn = false;
		workerObj = workerInsert;
	}
			
	if(typeof(workerObj) != "undefined") {
		workerObj.terminate();
		workerObj = undefined;
	}

	sortButtonsLock();
}


