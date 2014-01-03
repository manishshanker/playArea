playArea
========

INTRODUCTION

PROJECT STRUCTURE

BASE CLASSES

UTILITIES

SETTING UP TESTING FRAMEWORK

Dependencies
------------

npm install -g

selenium-webdriver install local
ensure chromedriver.exe is on system path

For teamcity integration
------------------------

Set env variable (Mac OS X):

env.PATH	            /sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin
env.PHANTOMJS_BIN	    /usr/local/lib/node_modules/phantomjs/bin/phantomjs

Add build step command line:

karma start karma.conf.js --single-run --reporters teamcity,coverage --browsers