A drag and drop video player. Connect videos visually to determine the sequence. (Chrome, please)

Play with it here: http://michelleboisson.github.io/Drag-Drop-Video-Editor/

# WHAT IT DOES
##You can:
* drop videos in the placeholders from your desktop
* move the videos around by grabbing them and dropping them
* click individual video thumbnails to play/pause the video
* attach the right dot of a video to the left dot of another video to have them play sequencially
* ~~start a video then, ~~ click "play sequence" button to play the thumbs in squence
* ~~start a video then, ~~ click "play sequence fullscreen" to open up a bigger player where the videos will play in the same holder in sequence 
         * click on this to enter true fullscreen mode
         * "play sequence fullscreen" button turns into "close fullscreen" button
~~ for now, the user must start the first video by clicking on it, so the player knows where to where to start~~

* double-click a video to open the editor
	* move the sliders to set in and out points for the clip
	* click delete button to remove from canvas

# STILL TO DO
* ~~have the player know what the first video is, without the user having to click on it~~
* make the entire canvas scalable and moveable
* cross-fade effect between video clips
* look into cleaning up anchors and connectors (why do they move?)
* more feedback/labels/directions on the UI  

# HOW IT WAS MADE
this was a mashup up of code from this mp3 player, modified to play video
http://ex.fm/labs/local

And the line drawing tool is taken from
http://jsplumb.org/jquery/demo.html

Some video control stuff from
popcornjs.org
