jsPlumb.bind("ready", function() {
	
		
	// your jsPlumb related init code goes here
//jsPlumb.draggable($("#videos"));
	console.log("jsPlumb is ready");
//	Canvas.Bind(); 
	
});						
		
if (typeof(Canvas) == 'undefined'){
	Canvas = {}
}


Canvas.Bind = function(id){


	//WORK IN PROGRESS!

    jsPlumb.draggable($(".local_drop"),{
    	stop: function(){
    		$(this).addClass("ui-draggable-dragged");
    	},
    	containment:"parent"
    });
    
	
	//jsPlumb.draggable($(".local_drop");
	var sourcePointOptions = {
		endpoint:"Dot",
		paintStyle:{ width:25, height:21, fillStyle:'#ff5ff2' },
		connectorStyle : { strokeStyle:"#666" },
		isTarget:true,
		anchor: "LeftMiddle"
	};
	var targetPointOptions = {
		endpoint:"Dot",
		paintStyle:{ width:25, height:21, fillStyle:'#ff5ff2' },
		isSource:true,
		connectorStyle : { strokeStyle:"#666" },
		anchor: "RightMiddle",
		connectorOverlays: [ [ "Arrow", { location:0.5 } ] ]
	};
	var endpoint = jsPlumb.addEndpoint($("#"+id), targetPointOptions);
	var newpoint = jsPlumb.addEndpoint($("#"+id), sourcePointOptions);
 
}
Canvas.Popcorn = {

	clipBegin : 0,
	clipEnd: 0,
	clipCurrent :0,
	thisPopcorn: {},
	videoId: '',
	
	checkReadyState : function(popcorn){
	console.log(popcorn.duration());
		    // store the readyState
    var rdy = popcorn.readyState();
    
    if ( rdy === 0 ) {
        console.log( "No data at all, readyState is " + rdy );
    } else if ( rdy === 1 ) {
        console.log( "We have metadata, duration is " + popcorn.duration() +
                     ", readyState is " + rdy );
    } else if ( rdy === 2 ) {
        console.log( "can play current location in video, readyState is " + rdy );
    } else if ( rdy === 3 ) {
        console.log( "can play current location in video and a bit more, readyState is " + rdy );
    }
    if ( rdy === 4 ) {
        console.log( "can play whole video at current buffer rate, readyState is " + rdy );
        return true;
        //Canvas.Popcorn.initSlider(popcorn);
        
    } else {
        setTimeout( Canvas.Popcorn.checkReadyState(popcorn), 1000 );
    }

		
	},
	initSlider : function(vidDuration, videoId){
		//var movieLength = popcorn.duration();
		var movieLength = vidDuration;
		Canvas.Popcorn.videoId = videoId;           
        Canvas.Popcorn.thispopcorn = Popcorn("#edit-"+videoId);
        
        Canvas.Popcorn.clipBegin = $("#"+videoId).attr("startClip");
        Canvas.Popcorn.clipEnd = $("#"+videoId).attr("endClip");
        Canvas.Popcorn.clipCurrent = $("#"+videoId).attr("startClip");
        
        console.log("init slider");
		$( "#slider-range" ).slider({
				//range: true,
				min: 0,
				step: 0.01,
				max: movieLength,
				values: [ Canvas.Popcorn.clipBegin, Canvas.Popcorn.clipCurrent, Canvas.Popcorn.clipEnd ],
				slide: function( event, ui ) {
					Canvas.Popcorn.clipBegin = ui.values[ 0 ];
					$("#"+videoId).attr("startClip", ui.values[ 0 ]);
					
					Canvas.Popcorn.clipEnd = ui.values[ 2 ];
					$("#"+videoId).attr("endClip", ui.values[ 2 ]);
					
					Canvas.Popcorn.clipCurrent = ui.values[0];
					
					$( "#amount" ).val( ui.values[ 0 ] + "s. - " + ui.values[ 2 ]+"s.");
					Canvas.Popcorn.thispopcorn.currentTime(ui.value);
					//console.log(ui, event);
				}
				
			});
			var sliderindicator = "<div class='ui-slider-range ui-widget-header' style='left:"+ Canvas.Popcorn.clipBegin +"; width:0;'></div>";
			$( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
				"s. - " + $( "#slider-range" ).slider( "values", 2 ) +"s.");
				
			document.getElementById("play-clip")
					.addEventListener('click', Canvas.Popcorn.playClip, false);
			document.getElementById("delete-clip")
					.addEventListener('click', Canvas.Popcorn.deleteClip, false);
			document.getElementById("done-clip")
					.addEventListener('click', Canvas.Popcorn.doneClip, false);
	},
	playClip : function(){
		var thisVid = Canvas.Popcorn.thispopcorn;
		
		if (thisVid.paused()){
			$("#play-clip").text("Pause Clip");
			thisVid.play(Canvas.Popcorn.clipCurrent);
			thisVid.on('timeupdate', function(){
				$( "#slider-range" ).slider( "option", "values", [Canvas.Popcorn.clipBegin,thisVid.currentTime(), Canvas.Popcorn.clipEnd] );
				Canvas.Popcorn.clipCurrent = thisVid.currentTime();
				if(thisVid.currentTime() >= Canvas.Popcorn.clipEnd){			
					//Canvas.Popcorn.stopPlayingClip();
					thisVid.pause();
					thisVid.off('timeupdate');//remove event listener
					$("#play-clip").text("Play Clip");
					Canvas.Popcorn.clipCurrent = Canvas.Popcorn.clipBegin;
				}
			})
		}else{
			thisVid.pause();
			thisVid.off('timeupdate');//remove event listener
			$("#play-clip").text("Play Clip");
		}
	},
	stopPlayingClip : function (){
		var thisVid = Canvas.Popcorn.thispopcorn;
		
					thisVid.pause();
					console.log("ended? "+thisVid.ended());
					thisVid.off('timeupdate');//remove event listener
					$("#play-clip").text("Play Clip");
				

		
		
	},
	saveClip : function(e){
		alert("Saving the clip!");
	},
	deleteClip : function(e){
		if (confirm("Deleting this clip from the canvas! Are you sure?")){
			console.log("YEP!");
			$( "#dialog-modal" ).remove();
			jsPlumb.removeAllEndpoints($("#"+Canvas.Popcorn.videoId).parent());
			jsPlumb.detachAllConnections($("#"+Canvas.Popcorn.videoId).parent());

			$("#"+Canvas.Popcorn.videoId).parent().remove();
		}
	},
	doneClip : function(e){
		console.log("done target: " +e.target.id);
		Local.Edit.close(e);
	}
}

