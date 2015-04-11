// ==UserScript==
// @name        Pony Countdown
// @namespace   org.4chan.anonymous
// @version     0.1.0
// @description Counts time till new pone
// @downloadURL https://github.com/rossy/pony-countdown.user.js/raw/master/pony-countdown.user.js
// @match       *://boards.4chan.org/mlp/*
// @match       *://mlpg.co/*
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function() {
	"use strict";

	// Don't duplicate the countdown on the actual countdown page
	if (document.location.href === "http://mlpg.co/countdown/")
		return;

	var css =
		"#-pony-countdown-content {\n" +
		"	position: fixed;\n" +
		"	display: inline-block;\n" +
		"	right: 6px;\n" +
		"	top: 28px;\n" +
		"	color: #eee;\n" +
		"	background: #333;\n" +
		"	padding: 0 7px;\n" +
		"	border-radius: 3px;\n" +
		"	font-size: 14px;\n" +
		"	line-height: 30px;\n" +
		"}\n" +
		"\n" +
		"#-pony-countdown-content::before {\n" +
		"	position: absolute;\n" +
		"	content: \" \";\n" +
		"	left: -5px;\n" +
		"	top: 50%;\n" +
		"	width: 0;\n" +
		"	height: 0;\n" +
		"	margin-top: -5px;\n" +
		"	border: 5px solid transparent;\n" +
		"	border-left-width: 0;\n" +
		"	border-right-color: #333;\n" +
		"}\n" +
		"\n" +
		"#-pony-countdown-content::after {\n" +
		"	position: absolute;\n" +
		"	content: \" \";\n" +
		"	left: -56px;\n" +
		"	top: 50%;\n" +
		"	width: 48px;\n" +
		"	height: 48px;\n" +
		"	margin-top: -24px;\n" +
		"	background-image: url(data:image/png;base64,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)\n" +
		"}\n" +
		"";

	var lastData,
	    contentElem;

	function getNext(data, now) {
		for (var i = 0; i < data.number_of_episodes; i++) {
			// Grab the name and filter episodes yet to be announced
			var name = data["ep" + i];
			if (name === "TBA")
				continue;

			// Grab the date and filter episodes that have already finished
			// airing, assuming they finish 30 minutes after they start
			var start = +new Date(data["ep" + i + "_release"]);
			if (isNaN(start) || start + 30 * 60 * 1000 < now)
				continue;

			// Return the first episode that's currently airing or about to air
			return {
				name: name,
				start: start,
			};
		}

		return null;
	}

	function formatTimeDifference(diff) {
		return [
			// The time till airing is reported as the sum of at most two of
			// these intervals
			{ name: "day"   , length: 24 * 60 * 60 * 1000 },
			{ name: "hour"  , length:      60 * 60 * 1000 },
			{ name: "minute", length:           60 * 1000 },
		].filter(function(interval) {
			// Calculate the amount of time for this interval
			interval.count = Math.floor(diff / interval.length);
			diff = diff % interval.length;

			// Filter intervals where the amount is zero
			return interval.count;

			// Use only the largest two intervals in the message
		}).slice(0, 2).map(function(interval) {
			// Use words for amounts under 10
			var number = [ , "one", "two", "three", "four", "five", "six",
				"seven", "eight", "nine" ][interval.count] || interval.count;

			// Pluralise the interval name
			var name = interval.name + (interval.count === 1 ? "" : "s");
			return number + " " + name;

			// If no intervals match, the episode airs in less than a minute
		}).join(" and ") || "less than a minute";
	}

	function createElements() {
		var style = document.createElement("style");
		style.textContent = css;
		document.head.appendChild(style);

		contentElem = document.createElement("div");
		contentElem.setAttribute("id", "-pony-countdown-content");
		document.body.appendChild(contentElem);
	}

	function updateMessage() {
		var message = "No new episodes",
		    now = Date.now(),
		    next = getNext(lastData, now);

		if (next) {
			if (next.start <= now)
				message = "“" + next.name + "” is airing";
			else
				message = "“" + next.name + "” airs in " +
				          formatTimeDifference(next.start - now);
		}

		if (!contentElem)
			createElements();
		contentElem.textContent = message;
	}

	function fetchData(cb) {
		// Data comes from mlpg.co's Ponk Clock: http://mlpg.co/countdown/
		// Huge thanks to those guys for letting me use it in this script.
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://mlpg.co/countdown/src/data.json",
			onload: function(response) {
				cb(JSON.parse(response.responseText));
			},
		});
	}

	function updateData(cb) {
		// Fetch the countdown JSON and update the message
		fetchData(function(data) {
			lastData = data;
			updateMessage();
			cb && cb();
		});
	}

	// Do the first update of the countdown JSON
	updateData(function() {
		// After the first update, check for updates every hour
		setInterval(updateData, 60 * 60 * 1000);

		// Update the countdown itself every 20 seconds
		setInterval(updateMessage, 20 * 1000);
	});
})();
