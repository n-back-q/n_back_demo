var timeline = [];
var n_back_set = ["Z", "X", "C", "V", "B", "N"];
var sequence = [];
var how_many_back = 3;
var sequence_length = 10;

/* Instructions */

var instructions_1 = {
  type: "html-button-response",
  stimulus:
    '<div style="width: 800px;">' +
    "<p>This the demo of the 3-back task.</p>" +
    "</div>",
  choices: ["Continue"],
};
timeline.push(instructions_1);

var instructions_2 = {
  type: "html-button-response",
  stimulus:
    '<div style="width: 800px;">' +
    "<p>You will see a sequence of 10 letters presented one at a time. Your task is to determine if the letter on the screen matches " +
    "the letter that appeared <span style='font-weight: bold;'>three</span> letters before.</p>" +
    '<p>If the letter is match <span style="font-weight: bold;">press the <b>Match</b> button.</span></p>' +
    "<p>For example, if you saw the sequence X, <b>V</b>, C, B, <b>V</b>, Z you would press the <b>Match</b> button when the <b>second V</b> appeared on the screen.</p>" +
    "<p>You do not need to press anything when there is not a match.</p>" +
    "</div>",
  choices: ["Continue"],
};
timeline.push(instructions_2);

var instructions_3 = {
  type: "html-button-response",
  stimulus:
    '<div style="width: 800px;">' +
    "<p>The sequence will begin on the next screen.</p>" +
    "<p>Remember: press the <b>Match</b> button if the letter on the screen matches the letter that appeared three letters ago.</p>" +
    "</div>",
  choices: ["I'm ready to start!"],
};
timeline.push(instructions_3);

var fixation = {
  type: "html-keyboard-response",
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 1500,
  post_trial_gap: 500,
};
timeline.push(fixation);

/* N Back sequence trials */

var n_back_trial = {
  type: "html-button-response",
  stimulus: function () {
    if (sequence.length < how_many_back) {
      var letter = jsPsych.randomization.sampleWithoutReplacement(
        n_back_set,
        1
      )[0];
    } else {
      if (jsPsych.timelineVariable("match", true) == true) {
        var letter = sequence[sequence.length - how_many_back];
      } else {
        var possible_letters = jsPsych.randomization.sampleWithoutReplacement(
          n_back_set,
          2
        );
        if (possible_letters[0] != sequence[sequence.length - how_many_back]) {
          var letter = possible_letters[0];
        } else {
          var letter = possible_letters[1];
        }
      }
    }
    sequence.push(letter);
    return '<span style="font-size: 96px;">' + letter + "</span>";
  },
  choices: ["Match"],
  trial_duration: 1500,
  response_ends_trial: false,
  post_trial_gap: 500,
  data: {
    phase: "test",
    match: jsPsych.timelineVariable("match"),
  },
  on_finish: function (data) {
    if (data.match == true) {
      data.correct = data.button_pressed != null;
    }
    if (data.match == false) {
      data.correct = data.button_pressed === null;
    }
  },
};

var n_back_trials = [{ match: true }, { match: false }];

var n_back_sequence = {
  timeline: [n_back_trial],
  timeline_variables: n_back_trials,
  sample: {
    type: "with-replacement",
    size: sequence_length,
    weights: [1, 2],
  },
};

timeline.push(n_back_sequence);

/* feedback */

var feedback = {
  type: "html-keyboard-response",
  stimulus: function () {
    var test_trials = jsPsych.data
      .get()
      .filter({ phase: "test" })
      .last(sequence_length - 3);
    var n_match = test_trials.filter({ match: true }).count();
    var n_nonmatch = test_trials.filter({ match: false }).count();
    var n_correct = test_trials.filter({ match: true, correct: true }).count();
    var false_alarms = test_trials
      .filter({ match: false, correct: false })
      .count();

    var html =
      "<div style='width:800px;'>" +
      "<p>All done!</p>" +
      "<p>You correctly identified " +
      n_correct +
      " of the " +
      n_match +
      " matching items.</p>" +
      "<p>You incorrectly identified " +
      false_alarms +
      " of the " +
      n_nonmatch +
      " non-matching items as matches.</p>" +
      "Close the page to exit this demo or click <a href='https://n-back-q.github.io/n_back_demo/'>here</a> to try the demo again if you need";

    return html;
  },
};
timeline.push(feedback);
