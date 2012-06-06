jsPlumb.bind("ready", function() {
	
		
	// your jsPlumb related init code goes here

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
    	}	
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
	thisPopcorn: {},
	
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
        Canvas.Popcorn.initSlider(popcorn);
        
    } else {
        setTimeout( Canvas.Popcorn.checkReadyState(popcorn), 1000 );
    }

		
	},
	initSlider : function(vidDuration, videoId){
		//var movieLength = popcorn.duration();
		var movieLength = vidDuration;
		        
        Canvas.Popcorn.thispopcorn = Popcorn("#edit-"+videoId);
        console.log("init slider");
		$( "#slider-range" ).slider({
				range: true,
				min: 0,
				step: 0.1,
				max: movieLength,
				values: [ Canvas.Popcorn.clipBegin, Canvas.Popcorn.clipEnd ],
				slide: function( event, ui ) {
				
					Canvas.Popcorn.clipBegin = ui.values[ 0 ];
					Canvas.Popcorn.clipEnd = ui.values[ 1 ];
					
					$( "#amount" ).val( ui.values[ 0 ] + "s. - " + ui.values[ 1 ]+"s.");
					Canvas.Popcorn.thispopcorn.currentTime(ui.value);
					//console.log(ui, event);
				}
			});
			$( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
				"s. - " + $( "#slider-range" ).slider( "values", 1 ) +"s.");
				
			document.getElementById("play-clip").addEventListener('click', Canvas.Popcorn.playclip, false);
			document.getElementById("save-clip").addEventListener('click', Canvas.Popcorn.saveclip, false);
	},
	playclip : function(){
		var thisVid = Canvas.Popcorn.thispopcorn;
		thisVid.play(Canvas.Popcorn.clipBegin);
		thisVid.listen('timeupdate', function(){
			if(thisVid.currentTime() >= Canvas.Popcorn.clipEnd){
				thisVid.pause();
			}
		})
		
	},
	saveclip : function(){
		alert("Saving the clip!");
	},
	deleteClip : function(){
		console.log("deleting clip! Are you sure?");
	}
}

