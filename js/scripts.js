$(document).ready(function(){
   
   
   $(document).on("click", function(e){
   		console.log("clicked on", e.target)
   	});
   
   
   var number = 0;
   var i = 0;
   
   Local.Init(number);
   
   //init canvas
 
   /* removed
   $("#add").live('click', function(){
   		Local.Init(number+=1);
   });
*/	
 $(".zoomTarget").live('dblclick', function(evt) {
        $(this).zoomTo({targetsize:0.75, duration:600});
        evt.stopPropagation();
    });


	
	$("#playallfs").live('click', function(){
		
		if ($("#fullscreenvids").length <= 0){
			$("#playallfs").text("Close Preview");
		
			$("._jsPlumb_endpoint").hide();
			$("._jsPlumb_connector").hide();
			$("._jsPlumb_overlay").hide();
			
			var allVideos = [];
			var firstID;
			var sumthinPlaying = false;					
					
			//loop through the elements in the dom, count the videos
			$("video").each(function(index){			
				
				var parentID = $(this).parent().attr("id");
			
				var s = jsPlumb.getConnections({source: parentID});  
				//console.log("connection source for: ", parentID , s);
				//console.log("connection source for: ", parentID , s[1].sourceId, s[1].targetId);
				
				var t = jsPlumb.getConnections({target: parentID});  
				console.log("connection target for: ", parentID , t);
				
				//if this video has no source video, it's the first video in the sequence
				if (t[0] == undefined){
					firstVid = parentID;
				}
				//if this video has no target video, it's the last video in the sequence
				if (s[0] == undefined){
					lastVid = parentID;
				}
				
				allVideos.push($(this));
				console.log("now playing", firstID);
			}).promise()
			  .done(function(){
			  
				console.log("something playing");
				console.log("now playing", firstVid);
				$(".big_description").append("<span id='alert' class='onair'></span>");
				$("#alert").html("Playing the sequence");

				for (var p = 0; p < allVideos.length; p++){
					console.log("pausing all videos");
					allVideos[p].get(0).pause();
					allVideos[p].get(0).currentTime = 0;
				}
				
				var fsVidHtml = "<div id='fullscreenvidsdiv'><video src='' id='fullscreenvids' class='video-js vjs-default-skin' preload='auto' height=360 width=640></video></div>";
			
			$("#videos").before(fsVidHtml);
			$("#videos .local_drop").animate({
				opacity: 0.25,
				bottom: '0'
			}, 500, function() {
					// Animation complete.
			});//end function animate callback
					

			console.log("firstID again ", firstVid);
					playNextConnectedfs(firstVid, lastVid);		  
			  });
			
			var fsVids = document.getElementById("fullscreenvids");
			//	console.log(fsVids);
			fsVids.addEventListener('click', function(){
				this.webkitEnterFullscreen();
			});

				}//end if fullscreenvids exists
	else{
		$("#playallfs").text("Play Preview Fullscreen");
		$("#fullscreenvidsdiv").remove();
		$("#alert").remove();
		$("#videos .local_drop").animate({opacity: 1}, 500);
		
		$("._jsPlumb_endpoint").show();
		$("._jsPlumb_connector").show();
		$("._jsPlumb_overlay").show();
	}
	});//playallfs click



/*------------------------------------------------------------------*/

	$("#playall").live('click', function(){
	
		var c = jsPlumb.getConnections(0); 	
		console.log(c);
	
		var allVideos = [];
		var firstVid;
		var lastVid;
		
		var sumthinPlaying = false;
		
		//loop through the elements in the dom, count the videos
		$("video").each(function(index){
			var parentID = $(this).parent().attr("id");
			
			var s = jsPlumb.getConnections({source: parentID});  
			//console.log("connection source for: ", parentID , s);
			//console.log("connection source for: ", parentID , s[1].sourceId, s[1].targetId);
			
			var t = jsPlumb.getConnections({target: parentID});  
			console.log("connection target for: ", parentID , t);
			
			//if this video has no source video, it's the first video in the sequence
			if (t[0] == undefined){
				firstVid = parentID;
			}
			//if this video has no target video, it's the last video in the sequence
			if (s[0] == undefined){
				lastVid = parentID;
			}

			allVideos.push($(this));
		}).promise()
		.done(function(){
				  playNextConnected(firstVid, lastVid);
			  });
		
	});
	
	
});//end document ready


function playNext(v, allVideos){
					allVideos[v].get(0).play();
					allVideos[v].get(0).addEventListener("ended", function(){
						if (v < allVideos.length){
							console.log("updating r", v+1);
							playNext(v+1, allVideos);
						}else{
							return;
						}
					});
}

function playNextConnected(x, lastVid){
	//$("#"+x+" video").get(0).play();
	var thisVid = Popcorn("#video"+x);
	
	//thisVid.play();
	//console.log(x);
	
	Local.Video.play(x);
	
	//$("#video"+x).get(0).addEventListener("ended", function(){
	thisVid.on('ended', function(){
//		console.log("stopped");
		//this.get(0).currentTime(0);
		thisVid.off('ended');
		var next = jsPlumb.getConnections({source: x});
		console.log(x, next);
		
		if(next[0] == undefined){
			console.log("nope. done");
			$("#alert").remove();
			return;
		}
		next = next[0].targetId;
		console.log("updating video", next);
		//Local.Video.play(next);
		
		playNextConnected(next, lastVid);
	
	});
}



function playNextConnectedfs(x, lastVid){
	console.log("playing vids, switching.", x);
	var popcorn = Popcorn("#fullscreenvids");
	
	$("#fullscreenvids").attr('src', $("#"+x+" video").attr('src')).center(); 
	
	//popcorn.media.src=$("#"+x+" video").attr('src');
	
	var thisVid = $("#"+x+" video");
	//popcorn.load();
	$("#fullscreenvids").load();
	
	var start = thisVid.attr('startClip');
    var stop = thisVid.attr('endClip');
            
    if (stop == ''){
        stop = thisVid.duration();
        thisVid.attr('endClip', stop);
    }
    
    if (start == ''){
        start = 0;
        thisVid.attr('startClip', start);
    }       
    console.log("about to play!");
    popcorn.on('loadedmetadata', function() {
    	console.log("media",popcorn.duration());
    	popcorn.play(start);
    	popcorn	.off('loadedmetadata');
    });
    //console.log("ready state: "+ Canvas.Popcorn.checkReadyState(popcorn));
   	//$("#fullscreenvids").currentTime(start).play();
   	//popcorn.play(start);
   	console.log("play until: "+ stop);
   	
   	popcorn.on("timeupdate", function() { 
   	//if it reaches the 'end', meaning the clip end
	   	if(popcorn.currentTime() >= stop){	
	   		popcorn.pause();
	   		popcorn.off('timeupdate');
	   		//popcorn.currentTime(popcorn.duration());
			console.log(popcorn, popcorn.currentTime(), popcorn.ended());
	
			var next = jsPlumb.getConnections({source: x});
			console.log(x, next);
			if(next[0] == undefined){
				console.log("nope. done");
				$("#alert").remove();
				return;
			}
			next = next[0].targetId;
			//reset timer
			popcorn.currentTime(0);
			console.log("updating video", next);
			//Local.Video.play(next);
			playNextConnectedfs(next, lastVid);
		}//end if we reach the end of the clip	
	});//end on timeupdate

}
	





//center function
jQuery.fn.center = function () {
    this.css("position","absolute");
    //this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

