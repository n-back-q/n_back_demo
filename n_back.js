/* Change 1: Adding the image hosting site */
// define the site that hosts stimuli images
// usually https://<your-github-username>.github.io/<your-experiment-name>/
// there is no need for image import simply display the letter
// var repo_site = "https://kywch.github.io/Simple-RT-Task/"; 

/* defining variables */
var timeline = [];
var n_back_set = ['Z', 'X', 'C', 'V', 'B', 'N'];
var sequence = [];
var how_many_back = 2;
var sequence_length = 17;

/* define welcome message trial */
var welcome_block = {
    type: "html-keyboard-response",
    stimulus: "Welcome to the experiment. Press any key to begin."
};
timeline.push(welcome_block);

/* define instructions trial */
var instructions_1 = {
    type: "html-keyboard-response",
    stimulus: '<div style="width: 800px;">'+
    '<p>You will see a sequence of letters presented one at a time. Your task is to determine if the letter on the screen matches '+
    'the letter that appeared two letters before.</p>'+
    '<p>If the letter is match <span style="font-weight: bold;">press the M key.</span></p>'+
    '<p>For example, if you saw the sequence X, C, V, B, V, X you would press the M key when the second V appeared on the screen.</p>'+
    '<p>You do not need to press any key when there is not a match.</p>'+
    '</div>'+
    "<p>Press any key to begin.</p>",
    post_trial_gap: 2000
};
timeline.push(instructions_1);

var instructions_2 = {
    type: 'html-keyboard-response',
    stimulus: '<div style="width: 800px;">'+
      '<p>The sequence will begin on the next screen.</p>'+
      '<p>Remember: press the M key if the letter on the screen matches the letter that appeared two letters ago.</p>'+
      '</div>',
    choices: ["I'm ready to start!"],
    post_trial_gap: 1000
  }
timeline.push(instructions_2);

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000
}
timeline.push(fixation);

/* test trials */

var n_back_trial = {
      type: 'html-keyboard-response',
      stimulus: function() {
        if(sequence.length < how_many_back){
          var letter = jsPsych.randomization.sampleWithoutReplacement(n_back_set, 1)[0]
        } else {
          if(jsPsych.timelineVariable('match', true) == true){
            var letter = sequence[sequence.length - how_many_back];
          } else {
            var possible_letters = jsPsych.randomization.sampleWithoutReplacement(n_back_set, 2);
            if(possible_letters[0] != sequence[sequence.length - how_many_back]){
              var letter = possible_letters[0];
            } else {
              var letter = possible_letters[1];
            }
          }
        }
        sequence.push(letter);
        return '<span style="font-size: 96px;">'+letter+'</span>'
      },
      choices: ['M'],
      trial_duration: 1500,
      response_ends_trial: false,
      post_trial_gap: 500,
      data: {
        phase: 'test',
        match: jsPsych.timelineVariable('match')
      },
      on_finish: function(data){
        if(data.match == true){
          data.correct = (data.key_press != null)
        }
        if(data.match == false){
          data.correct = (data.key_press === null)
        }
      }
    }

    var n_back_trials = [
      {match: true},
      {match: false}
    ]

    var n_back_sequence = {
      timeline: [n_back_trial],
      timeline_variables: n_back_trials,
      sample: {
        type: 'with-replacement',
        size: sequence_length,
        weights: [1, 2]
      }
    }

    timeline.push(n_back_sequence);

/* define debrief */

var debrief_block = {
    type: "html-keyboard-response",
    stimulus: function () {

        var trials = jsPsych.data.get().filter({
            test_part: 'test'
        });
        var correct_trials = trials.filter({
            correct: true
        });

        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        // var rt = Math.round(correct_trials.select('rt').mean());

        return "<p>You scored " + correct_trials.count() + "out of" + trials.count() + ".</p>" +
            "<p>You responded correctly on " + accuracy + "% of the trials.</p>" +
            "<p>Press any key to complete the experiment. Thank you!</p>";

    }
};
timeline.push(debrief_block);