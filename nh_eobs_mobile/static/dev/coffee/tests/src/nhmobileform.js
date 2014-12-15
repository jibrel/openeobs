// Generated by CoffeeScript 1.8.0
var NHMobileForm,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NHMobileForm = (function(_super) {
  __extends(NHMobileForm, _super);

  function NHMobileForm() {
    this.show_triggered_elements = __bind(this.show_triggered_elements, this);
    this.hide_triggered_elements = __bind(this.hide_triggered_elements, this);
    this.add_input_errors = __bind(this.add_input_errors, this);
    this.reset_input_errors = __bind(this.reset_input_errors, this);
    this.reset_form_timeout = __bind(this.reset_form_timeout, this);
    this.cancel_notification = __bind(this.cancel_notification, this);
    this.handle_timeout = __bind(this.handle_timeout, this);
    this.submit_observation = __bind(this.submit_observation, this);
    this.display_partial_reasons = __bind(this.display_partial_reasons, this);
    this.submit = __bind(this.submit, this);
    this.trigger_actions = __bind(this.trigger_actions, this);
    this.validate = __bind(this.validate, this);
    var self, _ref;
    this.form = (_ref = document.getElementsByTagName('form')) != null ? _ref[0] : void 0;
    this.form_timeout = 240 * 1000;
    this.patient_name_el = document.getElementById('patientName').getElementsByTagName('a')[0];
    this.patient_name = function() {
      return this.patient_name_el.text;
    };
    self = this;
    this.setup_event_listeners(self);
    NHMobileForm.__super__.constructor.call(this);
  }

  NHMobileForm.prototype.setup_event_listeners = function(self) {
    var input, _fn, _i, _len, _ref;
    _ref = this.form.elements;
    _fn = function() {
      switch (input.localName) {
        case 'input':
          switch (input.type) {
            case 'number':
              input.addEventListener('change', self.validate);
              return input.addEventListener('change', self.trigger_actions);
            case 'submit':
              return input.addEventListener('click', self.submit);
            case 'reset':
              return input.addEventListener('click', self.cancel_notification);
            case 'radio':
              return input.addEventListener('click', self.trigger_actions);
          }
          break;
        case 'select':
          return input.addEventListener('change', self.trigger_actions);
      }
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      _fn();
    }
    document.addEventListener('form_timeout', function(event) {
      return self.handle_timeout(self, self.form.getAttribute('task-id'));
    });
    window.timeout_func = function() {
      var timeout;
      timeout = new CustomEvent('form_timeout', {
        'detail': 'form timed out'
      });
      return document.dispatchEvent(timeout);
    };
    window.form_timeout = setTimeout(window.timeout_func, this.form_timeout);
    document.addEventListener('post_score_submit', function(event) {
      var element, endpoint, form_elements;
      form_elements = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = self.form.elements;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          element = _ref1[_j];
          if (!element.classList.contains('exclude')) {
            _results.push(element);
          }
        }
        return _results;
      })();
      endpoint = event.detail;
      return self.submit_observation(self, form_elements, endpoint, self.form.getAttribute('ajax-args'));
    });
    document.addEventListener('partial_submit', function(event) {
      var cover, details, dialog_id, element, form_elements, reason;
      form_elements = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = self.form.elements;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          element = _ref1[_j];
          if (!element.classList.contains('exclude')) {
            _results.push(element);
          }
        }
        return _results;
      })();
      reason = document.getElementsByName('partial_reason')[0];
      if (reason) {
        form_elements.push(reason);
      }
      details = event.detail;
      self.submit_observation(self, form_elements, details.action, self.form.getAttribute('ajax-args'));
      dialog_id = document.getElementById(details.target);
      cover = document.getElementById('cover');
      document.getElementsByTagName('body')[0].removeChild(cover);
      return dialog_id.parentNode.removeChild(dialog_id);
    });
    return this.patient_name_el.addEventListener('click', function(event) {
      var patient_id;
      event.preventDefault();
      patient_id = event.srcElement.getAttribute('patient-id');
      if (patient_id) {
        return self.get_patient_info(patient_id, self);
      } else {
        return new window.NH.NHModal('patient_info_error', 'Error getting patient information', '', ['<a href="#" data-action="close" data-target="patient_info_error">Cancel</a>'], 0, document.getElementsByTagName('body')[0]);
      }
    });
  };

  NHMobileForm.prototype.validate = function(event) {
    var criteria, input, max, min, other, other_criteria, other_input, value, _ref, _ref1;
    event.preventDefault();
    this.reset_form_timeout(this);
    input = event.srcElement;
    this.reset_input_errors(input);
    value = parseFloat(input.value);
    min = parseFloat(input.min);
    max = parseFloat(input.max);
    if (typeof value !== 'undefined' && !isNaN(value) && value !== '') {
      if (input.type === 'number') {
        if (input.step === '1' && value % 1 !== 0) {
          this.add_input_errors(input, 'Must be whole number');
          return;
        }
        if (value < min) {
          this.add_input_errors(input, 'Input too low');
          return;
        }
        if (value > max) {
          this.add_input_errors(input, 'Input too high');
          return;
        }
        if (input.getAttribute('data-validation')) {
          criteria = eval(input.getAttribute('data-validation'))[0];
          other_input = (_ref = document.getElementById(criteria[1])) != null ? _ref.value : void 0;
          if (((_ref1 = document.getElementById(criteria[1])) != null ? _ref1.type : void 0) === 'number') {
            other_input = parseFloat(other_input);
          }
          if (eval(value + ' ' + criteria[0] + ' ' + other_input)) {
            this.reset_input_errors(document.getElementById(criteria[1]));
            return;
          }
          if (typeof other_input !== 'undefined' && !isNaN(other_input) && other_input !== '') {
            this.add_input_errors(input, 'Input must be ' + criteria[0] + ' ' + criteria[1]);
            other = document.getElementById(criteria[1]);
            other_criteria = eval(other.getAttribute('data-validation'))[0];
            this.add_input_errors(other, 'Input must be ' + other_criteria[0] + ' ' + other_criteria[1]);
          } else {
            this.add_input_errors(input, 'Input requires ' + criteria[1] + ' to have value');
            other = document.getElementById(criteria[1]);
            this.add_input_errors(other, 'Please enter a value');
          }
        }
      }
    } else {

    }
  };

  NHMobileForm.prototype.trigger_actions = function(event) {
    var action, actions, condition, conditions, el, field, input, mode, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    this.reset_form_timeout(this);
    input = event.srcElement;
    value = input.value;
    if (input.type === 'radio') {
      _ref = document.getElementsByName(input.name);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        if (el.value !== value) {
          el.classList.add('exclude');
        } else {
          el.classList.remove('exclude');
        }
      }
    }
    if (value === '') {
      value = 'Default';
    }
    if (input.getAttribute('data-onchange')) {
      actions = eval(input.getAttribute('data-onchange'));
      for (_j = 0, _len1 = actions.length; _j < _len1; _j++) {
        action = actions[_j];
        _ref1 = action['condition'];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          condition = _ref1[_k];
          if (((_ref2 = condition[0]) !== 'True' && _ref2 !== 'False') && typeof condition[0] === 'string') {
            condition[0] = 'document.getElementById("' + condition[0] + '").value';
          }
          if (((_ref3 = condition[2]) !== 'True' && _ref3 !== 'False') && typeof condition[2] === 'string' && condition[2] !== '') {
            condition[2] = 'document.getElementById("' + condition[2] + '").value';
          }
          if ((_ref4 = condition[2]) === 'True' || _ref4 === 'False' || _ref4 === '') {
            condition[2] = "'" + condition[2] + "'";
          }
        }
        mode = ' && ';
        conditions = [];
        _ref5 = action['condition'];
        for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
          condition = _ref5[_l];
          if (typeof condition === 'object') {
            conditions.push(condition.join(' '));
          } else {
            mode = condition;
          }
        }
        conditions = conditions.join(mode);
        if (eval(conditions)) {
          if (action['action'] === 'hide') {
            _ref6 = action['fields'];
            for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
              field = _ref6[_m];
              this.hide_triggered_elements(field);
            }
          }
          if (action['action'] === 'show') {
            _ref7 = action['fields'];
            for (_n = 0, _len5 = _ref7.length; _n < _len5; _n++) {
              field = _ref7[_n];
              this.show_triggered_elements(field);
            }
          }
        }
      }
    }
  };

  NHMobileForm.prototype.submit = function(event) {
    var element, empty_elements, form_elements, invalid_elements;
    event.preventDefault();
    this.reset_form_timeout(this);
    form_elements = (function() {
      var _i, _len, _ref, _results;
      _ref = this.form.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (!element.classList.contains('exclude')) {
          _results.push(element);
        }
      }
      return _results;
    }).call(this);
    invalid_elements = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = form_elements.length; _i < _len; _i++) {
        element = form_elements[_i];
        if (element.classList.contains('error')) {
          _results.push(element);
        }
      }
      return _results;
    })();
    empty_elements = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = form_elements.length; _i < _len; _i++) {
        element = form_elements[_i];
        if (!element.value) {
          _results.push(element);
        }
      }
      return _results;
    })();
    if (invalid_elements.length < 1 && empty_elements.length < 1) {
      return this.submit_observation(this, form_elements, this.form.getAttribute('ajax-action'), this.form.getAttribute('ajax-args'));
    } else if (invalid_elements.length > 0) {
      return new window.NH.NHModal('invalid_form', 'Form contains errors', '<p class="block">The form contains errors, please correct the errors and resubmit</p>', ['<a href="#" data-action="close" data-target="invalid_form">Cancel</a>'], 0, this.form);
    } else {
      return this.display_partial_reasons(this);
    }
  };

  NHMobileForm.prototype.display_partial_reasons = function(self) {
    return Promise.when(this.call_resource(this.urls.json_partial_reasons())).then(function(data) {
      var option, option_name, option_val, options, select, _i, _len, _ref;
      options = '';
      _ref = data[0][0];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option_val = option[0];
        option_name = option[1];
        options += '<option value="' + option_val + '">' + option_name + '</option>';
      }
      select = '<select name="partial_reason">' + options + '</select>';
      return new window.NH.NHModal('partial_reasons', 'Submit partial observation', '<p class="block">Please state reason for submitting partial observation</p>' + select, ['<a href="#" data-action="close" data-target="partial_reasons">Cancel</a>', '<a href="#" data-target="partial_reasons" data-action="partial_submit" data-ajax-action="json_task_form_action">Confirm</a>'], 0, self.form);
    });
  };

  NHMobileForm.prototype.submit_observation = function(self, elements, endpoint, args) {
    var el, serialised_string, url;
    serialised_string = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        _results.push(el.name + '=' + el.value);
      }
      return _results;
    })()).join("&");
    url = this.urls[endpoint].apply(this, args.split(','));
    return Promise.when(this.call_resource(url, serialised_string)).then(function(server_data) {
      var buttons, data, task, task_list, tasks, title, triggered_tasks, _i, _len, _ref;
      data = server_data[0][0];
      if (data && data.status === 3) {
        new window.NH.NHModal('submit_observation', data.modal_vals['title'] + ' for ' + self.patient_name() + '?', data.modal_vals['content'], ['<a href="#" data-action="close" data-target="submit_observation">Cancel</a>', '<a href="#" data-target="submit_observation" data-action="submit" data-ajax-action="' + data.modal_vals['next_action'] + '">Submit</a>'], 0, self.form);
        if ('clinical_risk' in data.score) {
          return document.getElementById('submit_observation').classList.add('clinicalrisk-' + data.score['clinical_risk'].toLowerCase());
        }
      } else if (data && data.status === 1) {
        triggered_tasks = '';
        buttons = ['<a href="' + self.urls['task_list']().url + '" data-action="confirm">Go to My Tasks</a>'];
        if (data.related_tasks.length === 1) {
          triggered_tasks = '<p>' + data.related_tasks[0].summary + '</p>';
          buttons.push('<a href="' + self.urls['single_task'](data.related_tasks[0].id).url + '">Confirm</a>');
        } else if (data.related_tasks.length > 1) {
          tasks = '';
          _ref = data.related_tasks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            task = _ref[_i];
            tasks += '<li><a href="' + self.urls['single_task'](task.id).url + '">' + task.summary + '</a></li>';
          }
          triggered_tasks = '<ul class="menu">' + tasks + '</ul>';
        }
        task_list = triggered_tasks ? triggered_tasks : '<p>Observation was submitted</p>';
        title = triggered_tasks ? 'Action required' : 'Observation successfully submitted';
        return new window.NH.NHModal('submit_success', title, task_list, buttons, 0, self.form);
      } else if (data && data.status === 4) {
        return new window.NH.NHModal('cancel_success', 'Task successfully cancelled', '', ['<a href="' + self.urls['task_list']().url + '" data-action="confirm" data-target="cancel_success">Go to My Tasks</a>'], 0, self.form);
      } else {
        return new window.NH.NHModal('submit_error', 'Error submitting observation', 'Server returned an error', ['<a href="#" data-action="close" data-target="submit_error">Cancel</a>'], 0, self.form);
      }
    });
  };

  NHMobileForm.prototype.handle_timeout = function(self, id) {
    return Promise.when(self.call_resource(self.urls['json_cancel_take_task'](id))).then(function(server_data) {
      return new window.NH.NHModal('form_timeout', 'Task window expired', '<p class="block">Please pick the task again from the task list if you wish to complete it</p>', ['<a href="' + self.urls['task_list']().url + '" data-action="confirm">Go to My Tasks</a>'], 0, document.getElementsByTagName('body')[0]);
    });
  };

  NHMobileForm.prototype.cancel_notification = function(self) {
    return Promise.when(this.call_resource(this.urls.ajax_task_cancellation_options())).then(function(data) {
      var option, option_name, option_val, options, select, _i, _len, _ref;
      options = '';
      _ref = data[0][0];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option_val = option.id;
        option_name = option.name;
        options += '<option value="' + option_val + '">' + option_name + '</option>';
      }
      select = '<select name="reason">' + options + '</select>';
      return new window.NH.NHModal('cancel_reasons', 'Cancel task', '<p>Please state reason for cancelling task</p>' + select, ['<a href="#" data-action="close" data-target="cancel_reasons">Cancel</a>', '<a href="#" data-target="cancel_reasons" data-action="partial_submit" data-ajax-action="cancel_clinical_notification">Confirm</a>'], 0, document.getElementsByTagName('form')[0]);
    });
  };

  NHMobileForm.prototype.reset_form_timeout = function(self) {
    clearTimeout(window.form_timeout);
    return window.form_timeout = setTimeout(window.timeout_func, self.form_timeout);
  };

  NHMobileForm.prototype.reset_input_errors = function(input) {
    var container_el, error_el;
    container_el = input.parentNode.parentNode;
    error_el = container_el.getElementsByClassName('errors')[0];
    container_el.classList.remove('error');
    input.classList.remove('error');
    return error_el.innerHTML = '';
  };

  NHMobileForm.prototype.add_input_errors = function(input, error_string) {
    var container_el, error_el;
    container_el = input.parentNode.parentNode;
    error_el = container_el.getElementsByClassName('errors')[0];
    container_el.classList.add('error');
    input.classList.add('error');
    return error_el.innerHTML = '<label for="' + input.name + '" class="error">' + error_string + '</label>';
  };

  NHMobileForm.prototype.hide_triggered_elements = function(field) {
    var el, inp;
    el = document.getElementById('parent_' + field);
    el.style.display = 'none';
    inp = document.getElementById(field);
    return inp.classList.add('exclude');
  };

  NHMobileForm.prototype.show_triggered_elements = function(field) {
    var el, inp;
    el = document.getElementById('parent_' + field);
    el.style.display = 'block';
    inp = document.getElementById(field);
    return inp.classList.remove('exclude');
  };

  return NHMobileForm;

})(NHMobile);

if (!window.NH) {
  window.NH = {};
}

if (typeof window !== "undefined" && window !== null) {
  window.NH.NHMobileForm = NHMobileForm;
}
