HAF BoilerPlate
===============

INTRODUCTION

PROJECT STRUCTURE

BASE CLASSES

UTILITIES

SETTING UP TESTING FRAMEWORK

#Setup/Build/Test/Run

##Dependency
NodeJS, ANT

##Install:
    npm install

##Build: (creates a prod build in 'out' folder)
    cd build
    ant

##Run e2e test:
    cd tests/e2e
    node e2e
*Ensure config.js points to correct baseURL, serverPort and resourceFolder*

##Run unit test:
    cd tests/unit
    karma start karma.conf.js
*WebStorm IDE: Instead of commandline, right click on karma.conf.js and click Run.*

#Teamcity Integration

##Set env variable (Mac OS X): e.g.
    env.PATH	            /sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin
    env.PHANTOMJS_BIN	    /usr/local/lib/node_modules/phantomjs/bin/phantomjs

##UNIT Tests
    karma start karma.conf.js --single-run --reporters teamcity,coverage
*Create a new build with above command line*

##E2E Tests
    node e2e
*Create a new build with above command line*
