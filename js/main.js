(function(document, window) {
	
	var input = document.getElementById("brainfuck_input");
	
	var currentError = "";
	
	var waitingForKey = false;
	
	var retCode = -1;
	
	var brainfuckCharacters = "><.,[]+-*:{0123456789}\n\r\0";
	
	var registers = new Array();
	var pointer = 0;
	var outputElement = document.getElementById("output_container");
	var outputText = document.getElementById("output");
	
	var consoleAlert = document.getElementById("console_input_alert");
	
	consoleAlert.style.left = (document.width/2-155)/document.width * 100 + "%";
	
	var consoleFocus = document.getElementById("alert_focus");
	
	consoleFocus.style.width = document.width;
	consoleFocus.style.height = document.height;
	
	
	var tmpPlace = 0;
	var tmpBf = "";
	
	var getInput = function(bf, currentPlace) {
		tmpPlace = currentPlace;
		tmpBf = bf;
		retCode = -1;
		consoleFocus.style.display = 'block';
		consoleAlert.style.display = 'block';
		consoleAlert.focus();
		waitingForKey = true;
	}
	
	
	
	var gotInput = function(keyCode) {
		retCode = keyCode;
		waitingForKey = false;
		consoleFocus.style.display = 'none';
		consoleAlert.style.display = 'none';
		registers[pointer] = retCode;
		runBrainfuck(tmpBf, tmpPlace+1);
	};
	
	var parseBrainfuck = function(bf) {
		for (i = 0; i < bf.length; i++) {
			if (brainfuckCharacters.indexOf(bf.charAt(i)) == -1) {
				currentError = "Invalid character at " + (i+1) + ", '" + bf.charAt(i) + "'";
				return false;
			}
		}
		return true;
	};
	
	var displayError = function() {
		errorElement = document.getElementById("error_container");
		errorElement.style.height = '1.2em';
		errorElement.innerHTML = currentError;
	};
		
	var hideError = function() {
		errorElement = document.getElementById("error_container");
		errorElement.style.height = '1px';
		errorElement.innerHTML = "";
	};
	
	//add check for brackets and such
	
	//	var brainfuckCharacters = "><.,[]+-*:{0123456789}\n\r\0";
	
	function randomFromTo(from, to){
		return Math.floor(Math.random() * (to - from + 1) + from);
	}
	
	var setUpRegisters = function() {
		registers = [];
		for (i = 0; i < 30000; i++) {
			registers[i] = 0;
		}
	}
	
	var currentOpenBracket = -1;
	
	var runBrainfuck = function(bf, initial) {
		for (i = initial; i < bf.length; i++) {
			place = i;
			command = bf.charAt(i);
			switch(command) {
				case '>':
					pointer++;
					break;
				case '<':
					pointer--;
					break;
				case '.':
					outputText.innerHTML += String.fromCharCode(registers[pointer]);
					break;
				case ',':
					getInput(bf, place);
					return;
					break;
				case '[':
					if (registers[pointer] == 0) {
						place = bf.indexOf(']',place);
					} else {
						currentOpenBracket = place;
					}
					break;
				case ']':
					place = currentOpenBracket - 1;
					break;
				case '+':
					registers[pointer] = registers[pointer]+1;
					console.log("registers[" + pointer + "] = " + registers[pointer]);
					break;
				case '-':
					registers[pointer] = registers[pointer]-1;
					console.log("registers[" + pointer + "] = " + registers[pointer]);
					break;
				case '*':
					registers[pointer] = randomFromTo(0,127);
					break;
				case ':':
					outputText.innerHTML += registers[pointer];
					break;
				case '{':
					initialPlace = place;
					endingPlace = bf.indexOf('}',place);
					pointer = parseInt(bf.substr(place+1,endingPlace-place-1));
					place = endingPlace;
					break;
				case '}':
					break;
				default:
					break;
			}
			i = place;
		}
	};
	
	var clearOutput = function() {
		outputText.innerHTML = "";
		outputElement.style.height = "1px";
		outputElement.style['background-color'] = "";
		outputElement.style['border'] = '';
	};
	
	input.focused = true;
	input.hasFocus = function() {
		return this.focused;
		clearOutput();
	};
	input.onfocus = function() {
		this.focused = true;
		this.select();
	};
	input.onblur = function() {
		this.focused = false;
	};
	
	var fireEvent = function(element, event) {
		if (document.createEvent) {
			// dispatch for firefox + others
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(event, true, true ); // event type,bubbling,cancelable
			return !element.dispatchEvent(evt);
		} else {
			// dispatch for IE
			var evt = document.createEventObject();
			return element.fireEvent('on'+event,evt)
		}
	};
	
	document.onkeydown = function( event ) {
		if (waitingForKey) {
			event.preventDefault();
			gotInput(event.keyCode);
			return;
		}
		if (event.keyCode == 13) {
			fireEvent(document.getElementById("submit_button"),'click');
			input.blur();
			event.preventDefault();
		} else if (event.keyCode == 8 && !input.focused) {
			clearOutput();
			input.focus();
			event.preventDefault();
		}
	};
	document.onclick = function( event ) {
		var target = event.target;
		if (target.tagName == "A")
			return;
		clearOutput();
		input.focus();
		event.preventDefault();
	};
	document.getElementById("submit_button").onclick = function( event ) {
		if (parseBrainfuck(input.value)) {
			hideError();
			setUpRegisters();
			pointer=0;
			outputElement.style.height = "2em";
			outputElement.style['background-color'] = "#69ad39";
			outputElement.style['border'] = '5px solid #4D8029';
			outputText.innerHTML = "";
			runBrainfuck(input.value,0);
		} else {
			displayError();
		}
	};
})(document, window);