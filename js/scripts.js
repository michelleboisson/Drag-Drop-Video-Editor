$(document).ready(function(){
   
   var number = 0;
   var i = 0;
   
   Local.Init(number);
   
   //init canvas
 
   /* removed
   $("#add").live('click', function(){
   		Local.Init(number+=1);
   });
*/	


	
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
				

				if($(this).get(0).paused == false){
					firstID = $(this).parent().attr("id");
					console.log("now playing", firstID);
					sumthinPlaying = true;

				}
				
				allVideos.push($(this));
				console.log("now playing", firstID);
			}).promise()
			  .done(function(){
			  console.log("Checking playing...");
			if (sumthinPlaying == false){
				console.log("nothing playing");
				$(".big_description").append("<span id='alert'>Start playing the first video</span>");
			}
			else{
				console.log("something playing");
				console.log("now playing", firstID);
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
					

			console.log("firstID again ", firstID);
					playNextConnectedfs(firstID, -1);	
			}
								
				
			  
			  
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

			if($(this).get(0).paused == false){
				console.log("now playing", parentID);
				firstID = parentID;
				sumthinPlaying = true;
			}
			
			allVideos.push($(this));
		});
			console.log("Checking playing...");
			if (sumthinPlaying == false){
				console.log("nothing playing");
				$(".big_description").append("<span id='alert'>Start playing the first video</span>");
			}
			else{
			console.log("something playing");
				$(".big_description").append("<span id='alert'></span>");
				$("#alert").html("Playing the sequence");
				playNextConnected(firstID, -1);
			}

			//console.log(allVideos.length +" movies to play");
			//playNext(0, allVideos);
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
	$("#"+x+" video").get(0).play();
	console.log(x);
	var vid = document.getElementById(x);
	$("#video"+x).get(0).addEventListener("ended", function(){
	console.log("stopped");
		var next = jsPlumb.getConnections({source: x});
		console.log(x, next);
		if(next[0] == undefined){
			$("#alert").remove();
			return;
		}
			next = next[0].targetId;
			console.log(next);
		if (next != lastVid){
			console.log("updating video", next);
			
			playNextConnected(next, lastVid);
		}
		
	});
}

function playNextConnectedfs(x, lastVid){
	console.log("playing vids, switching.", x);
	$("#fullscreenvids").attr('src', $("#"+x+" video").attr('src')).center(); 
	$("#fullscreenvids").get(0).play();

	$("#fullscreenvids").get(0).addEventListener("ended", function(){
		
		console.log("stopped");
		var next = jsPlumb.getConnections({source: x});
		console.log("next: "+next);
		if(next[0] == undefined || next[0] == ""){
			$("#alert").remove();
			return;
		}
		next = next[0].targetId;
		console.log(next);
		if (next != lastVid){
			console.log("updating video", next);
			
			playNextConnectedfs(next, lastVid);
		}
		
	});//video ended eventlistener

	var fsVids = document.getElementById("fullscreenvids");
//	console.log(fsVids);
	fsVids.addEventListener('click', function(){
		this.webkitEnterFullscreen();
	});

}



//center function
jQuery.fn.center = function () {
    this.css("position","absolute");
    //this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

