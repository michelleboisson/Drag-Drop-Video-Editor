$(document).ready(function(){
   
   var number = 0;
   var i = 0;
   
   Local.Init(number);
   
/* removed
   $("#add").live('click', function(){
   		Local.Init(number+=1);
   });
*/	

	$("#videos").sortable();
	//$("#videos").disableSelection();
	
	$("#playallfs").live('click', function(){
		if ($("#fullscreenvids").length <= 0){
			$("#playallfs").text("Close Preview");
		var allVideos = [];
				
		//loop through the elements in the dom, count the videos
		$("video").each(function(index){			
			allVideos.push($(this));
		});
		
		//$(".local_drop").
		console.log(allVideos.length);
		
		var fsVidHtml = "<div id='fullscreenvidsdiv'><video src='' id='fullscreenvids' class='video-js vjs-default-skin' preload='auto' height=360 width=640></video></div>";
		console.log(fsVidHtml);
		
		for (var j=0; j< allVideos.length; j++){
			console.log("pausing");
			allVideos[j][0].pause();
			allVideos[j][0].currentTime = 0;
			
		}
		
		
		$("#videos").before(fsVidHtml);
		$("#videos .local_drop").animate({
			opacity: 0.25,
			bottom: '0'
		}, 500, function() {
				// Animation complete.
				
				
			var r = 0;
			console.log("playing vids, switching.");
			$("#fullscreenvids").attr('src', allVideos[0].attr('src')).center(); 
			$("#fullscreenvids").get(0).play();
		
			$("#fullscreenvids").get(0).addEventListener("ended", function(){
				if (r < allVideos.length){
					r++;
					$(this).attr('src', allVideos[r].attr('src'));
					$("#fullscreenvids").get(0).play();
				}//r++;
				else{
					$("#videos .local_drop").animate({
						opacity: 1,
						bottom: '0'
					}, 500, function() {
						});
				}//close else
				
			});//video ended eventlistener
		//}
		
		var fsVids = document.getElementById("fullscreenvids");
		console.log(fsVids);
		fsVids.addEventListener('click', function(){
			this.webkitEnterFullscreen();
		});

				
				
				});//end function animate callback
				
		
		
		//document.getElementById("fullscreenvids").webkitEnterFullscreen();
		
		//play each video
		//allVideos[i][0].webkitEnterFullscreen();
		//allVideos[i][0].play();
		
	}//end if fullscreenvids exists
	else{
		$("#playallfs").text("Play Preview Fullscreen");
		$("#fullscreenvidsdiv").remove();
		$("#videos .local_drop").animate({opacity: 1}, 500);
	}
	});//playallfs click


	$("#playall").live('click', function(){
		var allVideos = [];
		
		for (var j=0; j< allVideos.length; j++){
			console.log("stopping all videos");
			allVideos[j][0].pause();
			allVideos[j][0].currentTime = 0;
			
		}
		
		//loop through the elements in the dom, count the videos
		$("video").each(function(index){			
			allVideos.push($(this));
		});
		
			allVideos[0].get(0).play();
			var r = 0;
			allVideos[0].get(0).addEventListener("ended", function(){
				if (r < allVideos.length){
					r++;
					allVideos[r].get(0).play();
				}//r++;
			});//video ended eventlistener

		

	});
	
	
});//end document ready




//center function
jQuery.fn.center = function () {
    this.css("position","absolute");
    //this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

