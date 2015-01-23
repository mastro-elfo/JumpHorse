
JumpHorse.prototype.newDeck = function() {
	this.shuffle();
	$.Dom.id('index-deck').innerHTML = '';
	var card = this.card();
	var i = 0;
	var f = 0.3;
	while (card) {
		var li = $.Dom.element('li', {
			'class': 'shuffle',
			'style': 'transform: translateX('+(i*f)+'px) translateY('+(i*f)+'px) translateZ('+(i*f)+'px); z-index: '+(40-i)+''
		});
		if (card[1] == '8') {
			li.setAttribute('data-action', 'fante');
		}
		else if (card[1] == '9') {
			li.setAttribute('data-action', 'cavallo');
		}
		else if (card[1] == '0') {
			li.setAttribute('data-action', 're');
		}
		else if (card[1] == '1') {
			li.setAttribute('data-action', 'asso');
		}
		
		var front = $.Dom.element('div', {
			'class': 'front c'+card[0]+' c'+card[1]
		});
		var back = $.Dom.element('div', {
			'class': 'back'
		});
		
		$.Dom.inject(front, li);
		$.Dom.inject(back, li);
		$.Dom.inject(li, 'index-deck');
		
		
		card = this.card();
		i++;
	}
	
	$.Dom.addClass($.Dom.select('#index-deck li:last-child')[0], 'no-delay');
	
	card = $.Dom.children('index-deck', 'li')[39];
	var i=0;
	while (card && i<40) {
		(function(card, i){
			setTimeout(function(){
				$.Dom.removeClass(card, 'shuffle');
			}, i*30+200);
		})(card, i);
		i++;
		card = $.Dom.children('index-deck', 'li')[39 -i];
	}
};

$.Dom.addEvent(window, 'load', function(){
	// Set browser language
	$.L10n.setLanguage($.L10n.sniff().substring(0, 2));
	// $.L10n.setLanguage('es');
	
	// Translate all
	$.L10n.translateAll();
	
	// Add 'goto' events
	$.Each(document.body.querySelectorAll('[data-goto]'), function(item){
		$.Dom.addClass(item, 'pointer');
		$.Dom.addEvent(item, 'click', function(event){
			Page.open(event.target.getAttribute('data-goto'));
		});
	});
	
	// Add 'goback' events
	$.Each(document.body.querySelectorAll('[data-goback]'), function(item){
		$.Dom.addClass(item, 'pointer');
		$.Dom.addEvent(item, 'click', function(event){
			Page.back();
		});
	});
	
	// New game instance
	var jumpHorse = new JumpHorse();
	
	// Deck click
	var preventDoubleClick = false;
	$.Dom.addEvent('index-deck', 'click', function(){
		if (preventDoubleClick) {
			return;
		}
		preventDoubleClick = true;
		
		// Take the next card
		var next = $.Dom.children('index-deck', 'li');
		next = next[1];
		
		// Take the actual card
		var actual = $.Dom.children('index-deck', 'li');
		actual = actual[0];
		if (!$.Dom.hasClass(actual, 'show')) {
			next = actual;
			actual = null;
		}
		
		if (!actual && !next) {
			$.Dom.addClass('status', 'hidden');
			$.Dom.id('status-p').innerHTML = '';
			jumpHorse.newDeck();
			preventDoubleClick = false;
			return;
		}
		
		setTimeout(function(){
			if (next) {
				// Show next card
				$.Dom.addClass(next, 'show');
			}
			
			if (actual) {
				// Move out the previous card
				$.Dom.addClass(actual, 'unshow');
			}
			
			setTimeout(function(){
				if (next) {
					switch (next.getAttribute('data-action')) {
						case 'fante':
							$.Dom.removeClass('status', 'hidden');
							$.Dom.id('status-p').innerHTML = $.L10n.translate('status-message-3');
							break;
						case 'cavallo':
							$.Dom.removeClass('status', 'hidden');
							$.Dom.id('status-p').innerHTML = $.L10n.translate('status-message-4');
							break;
						case 're':
							$.Dom.removeClass('status', 'hidden');
							$.Dom.id('status-p').innerHTML = $.L10n.translate('status-message-2');
							break;
						case 'asso':
							$.Dom.removeClass('status', 'hidden');
							$.Dom.id('status-p').innerHTML = $.L10n.translate('status-message-1');
							break;
						default:
							$.Dom.addClass('status', 'hidden');
							$.Dom.id('status-p').innerHTML = '';
							break;
					}
				}
				// Destroy previous element
				if(actual) {
					$.Dom.destroy(actual);
				}
				actual = next;
				if (!actual) {
					$.Dom.addClass('status', 'hidden');
					$.Dom.id('status-p').innerHTML = '';
					jumpHorse.newDeck();
				}
				preventDoubleClick = false;
			}, 400);
		}, 100);
	});
	
	$.Dom.addClass('index-reshuffle', 'pointer');
	$.Dom.addEvent('index-reshuffle', 'click', function(){
		if (confirm($.L10n.translate('confirm-reshuffle'))) {
			$.Dom.addClass('status', 'hidden');
			$.Dom.id('status-p').innerHTML = '';
			jumpHorse.newDeck();
		}
	});
	// First shuffle
	jumpHorse.newDeck();
	
	// Add resize process to header title
	(function(){
		var h1 = $.Dom.id('index-headertitle');
		var span = $.Dom.children(h1, 'span')[0];
		var fontSize = 2.3;
		var resize = function(){
			var h1Size = h1.offsetWidth -32;
			var spanSize = span.offsetWidth;
			if (h1Size < spanSize) {
				fontSize -= 0.05;
				$.Dom.style(h1, 'font-size', fontSize+ 'rem');
				setTimeout(resize, 0);
			}
			else if (h1Size > spanSize +16) {
				fontSize += 0.05;
				fontSize = fontSize > 2.3? 2.3 : fontSize;
				$.Dom.style(h1, 'font-size', fontSize+ 'rem');
				if(fontSize < 2.3) {
					setTimeout(resize, 0);
				}
			}
		};
		$.Dom.addEvent(window, 'resize', resize);
		resize();
	})();
	
	// Load ready
	document.body.setAttribute('data-ready', 'true');
});

