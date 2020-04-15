	// JavaScript Document

	
	var deckId = "";
	var discardArray = [];
	var handArr = [];
	var credits = 0;
	var bet = 0;
	var win = 0;
	var hand;

	var request = new XMLHttpRequest();
	var newCardsRequest = new XMLHttpRequest();
	var jsonResponse;
	var newJsonResponse;

	function main(stake) {
		bet = stake;
		updateCredits(-stake);
		document.getElementById("win").innerHTML = "";
		document.getElementById("winning_hand").innerHTML = "";
		
		request.open('GET', 'https://deckofcardsapi.com/api/deck/new/draw/?count=5', true);
		request.responseType = 'text';
		request.send();
	}

	request.onload = function() {
		if(request.status === 200) {
			jsonResponse = JSON.parse(request.responseText);
			deckId = jsonResponse.deck_id;
			
			console.log(jsonResponse);

			for (i = 0; i < jsonResponse.cards.length; i++) {
				document.getElementById('card' + (i+1)).setAttribute('src', jsonResponse.cards[i].image);
			}		
		}
	} // end onload function()


	function discardCard(cardNumber) {
		discardArray.push(cardNumber);
		document.getElementById('card' +(cardNumber+1)).setAttribute('src', 'https://d1nhio0ox7pgb.cloudfront.net/_img/i_collection_png/256x256/plain/playing_cards_deck.png');
	} 

	function drawCards() {
		newCardsRequest.open('GET', 'https://deckofcardsapi.com/api/deck/' +deckId +'/draw/?count='+discardArray.length, true);
		newCardsRequest.responseType = 'text';
		newCardsRequest.send();
	}

	newCardsRequest.onload = function() {
		if (newCardsRequest.status === 200) {
			newJsonResponse = JSON.parse(newCardsRequest.responseText);

			printNewCards();
			setHandArr();
		}
	}

	function printNewCards() {
	for (i=0; i<discardArray.length; i++) {
				jsonResponse.cards[discardArray[i]] = newJsonResponse.cards[i];
				document.getElementById('card' + (discardArray[i]+1)).setAttribute('src', jsonResponse.cards[discardArray[i]].image);
			}
			discardArray = [];
	}

	function setHandArr() {
			for (i = 0; i < jsonResponse.cards.length; i++) {
					var card = jsonResponse.cards[i].code;
					if (card.startsWith("0")) {
						handArr[i] = card.replace("0", "T");
					}
					else {
						handArr[i] = card;
					}
				}
							console.log(handArr);

	hand = Hand.solve(handArr);
	document.getElementById("winning_hand").innerHTML = hand.name;
	win = (hand.rank -1)*bet;
	printWin(win);
	updateCredits(win);

	}

	function printWin(win) {
	document.getElementById("win").innerHTML = "WIN: " +win;
	}

	function setCredits() {
	document.getElementById("credits").innerHTML = "CREDITS: "+credits;
	}

	function updateCredits(change) {
	credits += change;
	console.log("CREDITS: " +credits)
	setCredits();
	}


