$('#stateButton').on('click', function(evt) {
    $.ajax('/states', {
        success: function(data) {
            var stateList = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];

            var statePercentages = {};
            var totalPercentages = {
                clinton: 0,
                sanders: 0,
                trump: 0,
                rubio: 0
            };

            stateList.forEach(function(state) {
                var randPercent = Math.floor(Math.random() * 100);
                statePercentages[state] = {
                    demPercent: randPercent,
                    repPercent: 100 - randPercent,
                    hillaryPercent: Math.floor(2 * randPercent / 3),
                    berniePercent: Math.ceil(randPercent / 3),
                    trumpPercent: Math.floor(2 * (100 - randPercent) / 3),
                    rubioPercent: Math.ceil((100 - randPercent) / 3),
                };
                totalPercentages.clinton += statePercentages[state].hillaryPercent;
                totalPercentages.sanders += statePercentages[state].berniePercent;
                totalPercentages.trump += statePercentages[state].trumpPercent;
                totalPercentages.rubio += statePercentages[state].rubioPercent;
            });

            totalPercentages.clinton /= 50;
            totalPercentages.sanders /= 50;
            totalPercentages.trump /= 50;
            totalPercentages.rubio /= 50;
            var map = new Datamap({
                element: document.getElementById('container'),
                scope: 'usa',
                fills: {
                    Democratic: 'blue',
                    Republican: 'red',
                    Neutral: 'gray'
                },
                data: statePercentages,
                geographyConfig: {
                    popupTemplate: function(geo, data) {
                        return ['<div class="hoverinfo"><strong>', geo.properties.name + ' Tweet Positivity',
                            '<br>Democratic: ' + data.demPercent + '%',
                            '<ul>',
                            '<li>Clinton: ' + data.hillaryPercent + '%</li>',
                            '<li>Sanders: ' + data.berniePercent + '%</li>',
                            '</ul>',
                            'Republican: ' + data.repPercent + '%',
                            '<ul>',
                            '<li>Trump: ' + data.trumpPercent + '%</li>',
                            '<li>Rubio: ' + data.rubioPercent + '%</li>',
                            '</ul>',
                            '</strong></div>'
                        ].join('');
                    }
                }
            });

            function getFill(stateKey) {
                var state = map.options.data[stateKey];
                if (state.demPercent === state.repPercent) return 'Neutral';
                return state.demPercent > state.repPercent ? 'Democratic' : 'Republican';
            }

            var stateFillObj = {};
            stateList.forEach(function(stateKey) {
                stateFillObj[stateKey] = {
                    fillKey: getFill(stateKey)
                }
            })

            map.updateChoropleth(stateFillObj);
            map.legend();

            var chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: [
                        ['Average Positivity %', totalPercentages.clinton, totalPercentages.sanders, totalPercentages.trump, totalPercentages.rubio]
                    ],
                    type: 'bar'
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: ['Clinton', 'Sanders', 'Trump', 'Rubio']
                    }
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                }
            });
        },
        error: function() {
            //handle error
        }
    })
})