function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if(runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    //Keep only completed events
    var completedTweets = tweet_array.filter(function(tweet) {
        return tweet.source == 'completed_event';
    });

    //Create an array with the information needed for the graphs
    var activityData = completedTweets.map(function(tweet) {
        return {
            activityType: tweet.activityType,
            distance: tweet.distance,
            day: tweet.time.toLocaleDateString('en-US', {weekday: 'long'})
        };
    });

    //Remove tweets where an activity type could not be identified
    activityData = activityData.filter(function(activity) {
        return activity.activityType != 'unknown';
    });

    //Count each activity type
    var activityCounts = {};

    activityData.forEach(function(activity) {
        if (activityCounts[activity.activityType] === undefined) {
            activityCounts[activity.activityType] = 1;
        }
        else {
            activityCounts[activity.activityType]++;
        }
    });

    //Create an array of the activity types and their counts
    var activityCountData = [];

    for (var activity in activityCounts) {
        activityCountData.push({
            activityType: activity,
            count: activityCounts[activity]
        });
    }

    //Sort from most common to least common
    activityCountData.sort(function(a, b) {
        return b.count - a.count;
    });

    //Display how many different activity types there are
    document.getElementById('numberActivities').innerText = activityCountData.length;

    //Display the three most common activity types
    document.getElementById('firstMost').innerText = activityCountData[0].activityType;
    document.getElementById('secondMost').innerText = activityCountData[1].activityType;
    document.getElementById('thirdMost').innerText = activityCountData[2].activityType;

    var firstMost = activityCountData[0].activityType;
    var secondMost = activityCountData[1].activityType;
    var thirdMost = activityCountData[2].activityType;

    //Display answers based on the distance graphs
    document.getElementById('longestActivityType').innerText = 'bike';
    document.getElementById('shortestActivityType').innerText = 'walk';
    document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';

    //Create the activity count graph
    activity_vis_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A graph of the number of Tweets containing each type of activity.",
        "data": {
            "values": activityCountData
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "activityType",
                "type": "nominal",
                "title": "Activity Type",
                "sort": "-y"
            },
            "y": {
                "field": "count",
                "type": "quantitative",
                "title": "Number of Tweets"
            }
        }
    };

    vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

    //Keep only the three most common activities with a distance
    var distanceData = activityData.filter(function(activity) {
        return (
            activity.activityType == firstMost ||
            activity.activityType == secondMost ||
            activity.activityType == thirdMost
        ) && activity.distance > 0;
    });

    //Create the non-aggregated distance graph
    var distance_vis_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Distances by day of the week.",
        "data": {
            "values": distanceData
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "day",
                "type": "ordinal",
                "title": "Day of the Week",
                "sort": [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ]
            },
            "y": {
                "field": "distance",
                "type": "quantitative",
                "title": "Distance (Miles)"
            },
            "color": {
                "field": "activityType",
                "type": "nominal",
                "title": "Activity Type"
            }
        }
    };

    vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

    //Create the graph showing mean distance
    var distance_vis_aggregated_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Mean distances by day of the week.",
        "data": {
            "values": distanceData
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "day",
                "type": "ordinal",
                "title": "Day of the Week",
                "sort": [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ]
            },
            "y": {
                "field": "distance",
                "aggregate": "mean",
                "type": "quantitative",
                "title": "Mean Distance (Miles)"
            },
            "color": {
                "field": "activityType",
                "type": "nominal",
                "title": "Activity Type"
            }
        }
    };

    vegaEmbed(
        '#distanceVisAggregated',
        distance_vis_aggregated_spec,
        {actions:false}
    );

    //Hide the aggregated graph when the page first loads
    document.getElementById('distanceVisAggregated').style.display = 'none';

    //Switch between the regular and aggregated graphs
    document.getElementById('aggregate').addEventListener('click', function() {

        var distanceVis = document.getElementById('distanceVis');
        var distanceVisAggregated = document.getElementById('distanceVisAggregated');
        var button = document.getElementById('aggregate');

        if (distanceVis.style.display == 'none') {
            distanceVis.style.display = 'block';
            distanceVisAggregated.style.display = 'none';
            button.innerText = 'Show means';
        }
        else {
            distanceVis.style.display = 'none';
            distanceVisAggregated.style.display = 'block';
            button.innerText = 'Show all';
        }
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});