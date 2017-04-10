Let me introduce you imgur-folders, this small project uses modern browsers technology to store your images. It doesn't send or gather any information about you, your browser data or imgur account, the source code is available so you can check out.

#How to

##Load
Copy the following script:

´!(function(){var a=document.createElement("script");a.src="https://danielsunami.github.io/imgur-folders/dist/main.js";document.getElementsByTagName("head")[0].appendChild(a);})()´

Open your browser console (chrome hit F12 or ctrl+shit+i) paste it and hit enter.
Tip: you can use up arrow key to repeat last command.

##Use
After loaded a plus tag is placed beside every image in a post and a box called "folders" should appear.

Hit a plus to expand the tag.
Click the button add to add image to root folder.

Write the name of the folder you want to put the image on in the tag input text.
Click a name of a folder to open it.
Click in the two dots to go to root folder.
So far there is no support to sub folders.
Click a image to copy the image URL.

As long as the folders box appears on screen you'll only need to hit Q to place plus tags on all images of a post.

#Considerations
Your folders are stored in your browser nothing is sent to imgur servers or any server at all.
If you change PC or Browser your folders won't be there, if you clear your browser data you'll wipe your folders.
The add button at the bottom of folders box isn't working.
