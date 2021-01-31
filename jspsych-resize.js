/**
* jspsych-resize
* Steve Chao
*
* plugin for controlling the real world size of the display
*
* documentation: docs.jspsych.org
* modified 08122020 - CQ
**/

jsPsych.plugins["resize"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'resize',
    description: '',
    parameters: {
      starting_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Starting size',
        default: 150,
        description: 'The initial size of the box, in pixels, along the largest dimension.'
      },
      step_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step size',
        default: 10,
        description: 'The step size to adjust the radius of the circle.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    const minRadius = 100;
    const maxRadius = 200;
    let circleRadius = trial.starting_size;

    // create html for display
    const html = `
    <div id="calibration-container">
      <svg width="600" height="400">
          <circle cx="300" cy="200" r="${circleRadius}" id="calibration-circle" stroke="#aaaaaa" fill="#dddddd00"></circle>
      </svg>
    </div>
    <div style="float: right;">
      <a class="jspsych-btn zoom-out"><i class="fa fa-search-minus"></i></a>
      <a class="jspsych-btn zoom-in"><i class="fa fa-search-plus"></i></a>
      <a class="jspsych-btn submit-calibration">Finish calibration</a>
    </div>
    <br style="clear: both;"/>`;

    // render
    $(display_element).html(html);

    // bind events
    $("#jspsych-content").on("click", ".zoom-in", function() {
      adjustCircleSize(trial.step_size)
    }).on("click", ".zoom-out", function() {
      adjustCircleSize(-trial.step_size)
    }).on("click", ".submit-calibration", submitCalibration);

    function adjustCircleSize(delta) {
      circleRadius += delta;
      if (circleRadius > maxRadius) circleRadius = maxRadius
      if (circleRadius < minRadius) circleRadius = minRadius
      $("#calibration-circle").attr("r", circleRadius)
    }

    // function to end trial
    function submitCalibration() {
      // clear the screen
      display_element.innerHTML = '';

      // finishes trial
      jsPsych.finishTrial({
        'scale_factor': circleRadius / trial.starting_size
      });
    }
  };

  return plugin;
})();
