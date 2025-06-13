/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(typeof dojo=="undefined"){
    this.startWatchingInFlight=function(){
    	if(!this.inFlightTimer){
    		this.inFlightTimer=setInterval("dojo.io.ScriptSrcTransport.watchInFlight();",100);
    	}
    };
};
dojo.provide("dojo.math.*");