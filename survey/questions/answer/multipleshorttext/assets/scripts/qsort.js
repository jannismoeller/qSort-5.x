
$(document).on('ready pjax:scriptcomplete',function(){
	
	$('.q-sort-outer-wrapper').each(function(i) {

		// Define some stuff...
		var thisQuestion = $(this).closest('.multiple-short-txt');
		var qID = $(thisQuestion).attr('id').replace(/question/, '');
		
		if($('#question'+qID+' .q.draggable').length == 0) {
		
			$('#question'+qID).addClass('q-sort-question');	
			$('body').addClass('with-q-sort-question');
			
			// Insert the "cards"
			$('#question'+qID+' .answer-item:not(.ls-irrelevant)').each(function(i) {
				var thisSGQA = $(this).attr('id').replace(/javatbd/, '');
				var thisCode = $(this).attr('id').split('X'+qID)[1];
				var thisHTML = $('label', this).html();
				$('#question'+qID+' div.items-start').append('<div class="q draggable" data-sgqa="'+thisSGQA+'" data-code="'+thisCode+'">\
												'+thisHTML+'\
											</div>');
			});			
		 
			// Make the "cards" draggable
			$('#question'+qID+' .draggable').draggable({ 
				revert: "invalid", 
				zIndex: 2700, 
				helper: 'original',
				start: function( event, ui ) {
					$(ui.helper).addClass('ui-draggable-helper');
				},
				stop: function( event, ui ) {
				}
			});
		 
			// Set the targets for the draggables
			$('#question'+qID+' .droppable.items-start').droppable({ 
				hoverClass: 'target-hover', 
				accept: '.draggable.moved' 
			});
			$('#question'+qID+' .droppable.items-end').droppable({ 
				hoverClass: 'target-hover', 
				accept: '.draggable' 
			});
		 
			// After dropped
			$('#question'+qID+' .droppable').bind('drop', function(event, ui) {
		 
				var newDraggable = $(ui.draggable).clone();
				$(newDraggable).appendTo(this);
				$(ui.draggable).remove();
				if($(this).hasClass('items-end')) {
					$(newDraggable).addClass('moved');
				}
				else {
					$(newDraggable).removeClass('moved');
				}
				$(newDraggable).removeClass('ui-draggable-helper ui-draggable-dragging').css({
					'z-index':'',
					'top':'auto', 
					'left':'auto'
				});
		 
				// Now, make this new clone draggable
				$(newDraggable).draggable({ 
					revert: "invalid", 
					zIndex: 2700, 
					helper: 'original',
					start: function( event, ui ) {
						$(ui.helper).addClass('ui-draggable-helper');
					},
					stop: function( event, ui ) {
					}
				});
				
				// Load the hidden inputs
				$('#question'+qID+' .question-item textarea, #question'+qID+' .question-item input[type="text"]').val('');
				$('#question'+qID+' .droppable.items-end .q').each(function(i) {
					var thisItemsEnd = $(this).closest('.droppable.items-end').attr('data-items-end');
					var thisID = $(this).attr('data-sgqa');
					$('#answer'+thisID+'').val(thisItemsEnd);
				});
				$('#question'+qID+' .question-item textarea, #question'+qID+' .question-item input[type="text"]').trigger('keyup');

				// Check the limits on each dropping area
				var areas = $('.items-end');
				areas.each(function(e) {
					var area = areas[e];
					console.log(area.children.length);
					var limit = area.dataset['itemsLimit'];
					var child = area.children.length;
					if (child >= limit) {
						$('.items-end-' + (e + 1)).droppable('disable');
					}
					else {
						$('.items-end-' + (e + 1)).droppable('enable');
					}
				});
			});
		 
			// Initial "card" positions
			$('#question'+qID+' .question-item textarea, #question'+qID+' .question-item input[type="text"]').each(function(i) {
				if($.trim($(this).val()) != '') {
					$('.q[data-sgqa="'+$(this).attr('name')+'"]').appendTo($('#question'+qID+' .items-end[data-items-end="'+$(this).val()+'"]')).addClass('moved');
				}
			});
		 
			// Interrupt the Next/Submit function and load the inputs
			$('#ls-button-submit').on('click', function(){
			});
		}
	});
});