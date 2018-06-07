function isLengthCorrect(length){
	var minLength = 1;
	var maxLength = 6;

	if(length >= minLength && length <= maxLength )
		return true;
	else
		return false;
};

function validateNumber(enteredNumb){
	var warning = "";
	var submitButton = document.getElementById("submit");
	var correctNumber = new RegExp('^-{0,0}[0-9]*\.?[0-9]*$');
	
	if(!isLengthCorrect(enteredNumb.length)){
		submitButton.disabled = true;
		warning = "Wprowadzona liczba jest nieprawidłowej długości!";
	}else{
		enteredNumb.replace(",",".");

		if(!correctNumber.test(enteredNumb))
			warning = "Nieprawidłowa liczba";
		else
			submitButton.disabled = false;
	}

	document.getElementById("validationAlert").innerHTML = warning;
}
