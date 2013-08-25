// Generated by CoffeeScript 1.6.3
var GAME;

GAME = {
  home: function() {},
  create_accout: function() {},
  game: function() {
    var gameViewModel;
    gameViewModel = function() {
      var vm;
      vm = this;
      vm.actions = ko.observableArray([]);
      vm.account = ko.observable();
      vm.otherPlayers = ko.observableArray();
      vm.secondsRemaining = ko.observable(10);
      vm.chosenActions = ko.observableArray([]);
      vm.chooseAction = function(data, event) {
        var thisAction;
        thisAction = data;
        if (vm.secondsRemaining() - thisAction.seconds >= 0) {
          return $.ajax({
            url: '/api/action/' + data.which + '/',
            method: 'POST',
            dataType: 'json',
            success: function(response) {
              vm.chosenActions.push(_.cloneDeep(thisAction));
              vm.secondsRemaining(vm.secondsRemaining() - thisAction.seconds);
              return vm.addPlayerMovementArrows();
            }
          });
        }
      };
      vm.cancelAction = function(data, event) {
        var movePosition;
        movePosition = vm.chosenActions.indexOf(data);
        return $.ajax({
          url: '/api/cancel/' + movePosition + '/',
          method: 'POST',
          dataType: 'json',
          success: function(response) {
            vm.secondsRemaining(vm.secondsRemaining() + data.seconds);
            vm.chosenActions.remove(data);
            return vm.addPlayerMovementArrows();
          }
        });
      };
      vm.currentTime = ko.observable(new Date());
      vm.clockDisplay = ko.computed(function() {
        var minDisplay, remaining, secDisplay, seconds;
        seconds = ((vm.currentTime().getMinutes() % 2) * 60) + vm.currentTime().getSeconds();
        remaining = 120 - seconds;
        if (remaining === 120) {
          return '2:00';
        } else {
          minDisplay = Math.floor(remaining / 60);
          secDisplay = remaining % 60;
          if (secDisplay < 10) {
            secDisplay = '0' + (secDisplay + '');
          }
          return minDisplay + ':' + secDisplay;
        }
      });
      setInterval((function() {
        vm.currentTime(new Date());
        return $('title').text('Next in: ' + vm.clockDisplay());
      }), 1000);
      vm.getActionButtonContent = function(icon) {
        return '<span class="glyphicon ' + icon + '"></span> ';
      };
      vm.addPlayerMovementArrows = function() {
        var action, curCol, curDir, curRow, prevDir, _i, _len, _ref, _results;
        $('.arrow').removeClass().addClass('arrow');
        curCol = vm.account().col;
        curRow = vm.account().row;
        prevDir = vm.account().direction;
        curDir = vm.account().direction;
        _ref = vm.chosenActions();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          if (action.which === 'walk' || action.which === 'run') {
            if (curDir === 'north') {
              curRow -= 1;
              prevDir = 'south';
            }
            if (curDir === 'south') {
              curRow += 1;
              prevDir = 'north';
            }
            if (curDir === 'east') {
              curCol += 1;
              prevDir = 'west';
            }
            if (curDir === 'west') {
              curCol -= 1;
              prevDir = 'east';
            }
          } else if (action.which === 'north' || action.which === 'south' || action.which === 'east' || action.which === 'west') {
            if (curDir === 'north') {
              prevDir = 'south';
            }
            if (curDir === 'south') {
              prevDir = 'north';
            }
            if (curDir === 'east') {
              prevDir = 'west';
            }
            if (curDir === 'west') {
              prevDir = 'east';
            }
            curDir = action.which;
          }
          console.log(prevDir + '-' + curDir);
          _results.push($('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.arrow').addClass(prevDir + '-' + curDir));
        }
        return _results;
      };
      vm.addOthersMovementArrows = function() {
        var a, action, actionName, curCol, curDir, curRow, otherPlayer, prevDir, thisPlayersActions, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        $('.other-arrow').removeClass().addClass('other-arrow');
        _ref = vm.otherPlayers();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          otherPlayer = _ref[_i];
          curCol = otherPlayer.last_col;
          curRow = otherPlayer.last_row;
          prevDir = otherPlayer.last_direction;
          curDir = otherPlayer.last_direction;
          if (otherPlayer.last_actions !== '') {
            thisPlayersActions = otherPlayer.last_actions.split(',');
            for (_j = 0, _len1 = thisPlayersActions.length; _j < _len1; _j++) {
              actionName = thisPlayersActions[_j];
              action = null;
              _ref1 = vm.actions();
              for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                a = _ref1[_k];
                if (a.which === actionName) {
                  action = a;
                  break;
                }
              }
              if (action.which === 'walk' || action.which === 'run') {
                if (curDir === 'north') {
                  curRow -= 1;
                  prevDir = 'south';
                }
                if (curDir === 'south') {
                  curRow += 1;
                  prevDir = 'north';
                }
                if (curDir === 'east') {
                  curCol += 1;
                  prevDir = 'west';
                }
                if (curDir === 'west') {
                  curCol -= 1;
                  prevDir = 'east';
                }
              } else if (action.which === 'north' || action.which === 'south' || action.which === 'east' || action.which === 'west') {
                if (curDir === 'north') {
                  prevDir = 'south';
                }
                if (curDir === 'south') {
                  prevDir = 'north';
                }
                if (curDir === 'east') {
                  prevDir = 'west';
                }
                if (curDir === 'west') {
                  prevDir = 'east';
                }
                curDir = action.which;
              }
              console.log(prevDir + '-' + curDir);
              $('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.other-arrow').addClass(prevDir + '-' + curDir);
            }
          }
        }
        return $('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.other-player').addClass(otherPlayer.team).addClass(otherPlayer.direction);
      };
      $.ajax({
        url: '/api/initial-load/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          var action, actionName, actionNames, otherPlayer, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
          _ref = data.action_data;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            action = _ref[_i];
            vm.actions.push(action);
          }
          vm.account(data.account);
          _ref1 = data.other_players;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            otherPlayer = _ref1[_j];
            vm.otherPlayers.push(otherPlayer);
          }
          if (data.actions !== '') {
            actionNames = data.user_actions.split(',');
            for (_k = 0, _len2 = actionNames.length; _k < _len2; _k++) {
              actionName = actionNames[_k];
              _ref2 = vm.actions();
              for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
                action = _ref2[_l];
                if (action.which === actionName) {
                  vm.chosenActions.push(_.cloneDeep(action));
                  vm.secondsRemaining(vm.secondsRemaining() - action.seconds);
                  break;
                }
              }
            }
          }
          vm.addPlayerMovementArrows();
          return vm.addOthersMovementArrows();
        }
      });
      return null;
    };
    ko.applyBindings(new gameViewModel);
    return $('.actions-panel').on('mouseover mouseout', '.btn', function() {
      $(this).toggleClass('btn-success');
      return $(this).toggleClass('btn-danger');
    });
  }
};

$(function() {
  var cl;
  $.ajaxSetup({
    crossDomain: false,
    beforeSend: function(xhr, settings) {
      if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) {
        return xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
      }
    }
  });
  cl = $('body').attr('class');
  if (cl) {
    return GAME[cl]();
  }
});
