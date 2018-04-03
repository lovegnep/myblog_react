# tiny blog
--------------------------

This blog system is designed to be easy. It is a one person blog system, and anyone can comment on any theme without sign in.

10/23/2017 9:53:19 PM 

## 1. install
To do the steps follow,you should have installed the node. The identifying code is used to get security, and it is relied on canvas. You may need to find something about how to install the canvas between differt plat.

	git clone https://github.com/lovegnep/myblog.git
	cd myblog
	npm install
	node bin/www
	
## 2. tips
This website runs with the port 80 default, if you want to modify the port you may modify the config.js.

Assume that you have start the program successfully, and your server ip is 192.168.1.1, port with 3000, you may visit the homepage with 

	http://192.168.1.1:80/

The administrate page is on:

	http://192.168.1.1:80/admin
but you should go to 

	http://192.168.1.1:80/login
ahead with the default user/pass:hehe/haha

When you have go into the administrate page successfully, you can delete, edit , new and hide some theme.
