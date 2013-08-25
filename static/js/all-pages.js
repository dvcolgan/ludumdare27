// Generated by CoffeeScript 1.6.3
var GAME;

GAME = {
  home: function() {},
  create_accout: function() {},
  game: function() {
    var gameViewModel;
    gameViewModel = function() {
      var typingTimer, vm;
      vm = this;
      vm.actions = ko.observableArray([]);
      vm.account = ko.observable();
      vm.otherPlayers = ko.observableArray();
      vm.chosenActions = ko.observableArray([]);
      vm.secondsRemaining = ko.computed(function() {
        var action, total, _i, _len, _ref;
        total = 10;
        _ref = vm.chosenActions();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          total -= action.seconds;
        }
        return total;
      });
      vm.staminaRemaining = ko.computed(function() {
        var action, total, _i, _len, _ref;
        if (vm.account()) {
          total = vm.account().stamina;
          _ref = vm.chosenActions();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            action = _ref[_i];
            total += action.stamina;
          }
          if (total > 10) {
            total = 10;
          }
          if (total < 0) {
            total = 0;
          }
          return total;
        } else {
          return 0;
        }
      });
      vm.chooseAction = function(data, event) {
        var thisAction;
        thisAction = data;
        if (vm.secondsRemaining() - thisAction.seconds >= 0 && vm.staminaRemaining() + thisAction.stamina >= 0) {
          return $.ajax({
            url: '/api/action/' + data.which + '/',
            method: 'POST',
            dataType: 'json',
            success: function(response) {
              vm.chosenActions.push(_.cloneDeep(thisAction));
              return vm.addPlayerMovementArrows();
            }
          });
        }
      };
      vm.currentChatMessage = ko.observable('');
      vm.cancelAction = function(data, event) {
        var movePosition;
        movePosition = vm.chosenActions.indexOf(data);
        return $.ajax({
          url: '/api/cancel/' + movePosition + '/',
          method: 'POST',
          dataType: 'json',
          success: function(response) {
            vm.chosenActions.splice(movePosition, vm.chosenActions().length);
            return vm.addPlayerMovementArrows();
          }
        });
      };
      vm.currentTime = ko.observable(new Date());
      vm.clockDisplay = ko.computed(function() {
        var seconds;
        seconds = vm.currentTime().getSeconds();
        seconds = 60 - seconds;
        if (seconds < 10) {
          seconds = '0' + (seconds + '');
        }
        return '0:' + seconds;
      });
      vm.clockSeconds = ko.computed(function() {
        return vm.currentTime().getSeconds();
      });
      vm.doneTypingChat = function() {
        return $.ajax({
          url: '/api/update-chat/',
          method: 'POST',
          dataType: 'json',
          data: {
            'message': vm.currentChatMessage()
          }
        });
      };
      setInterval((function() {
        vm.currentTime(new Date());
        return $('title').text('Next in: ' + vm.clockDisplay());
      }), 300);
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
          if (action.which === 'walk') {
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
            _results.push($('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.arrow').addClass(prevDir + '-' + curDir));
          } else if (action.which === 'run') {
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
            $('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.arrow').addClass(prevDir + '-' + curDir);
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
            _results.push($('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.arrow').addClass(prevDir + '-' + curDir));
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
            _results.push($('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.arrow').addClass(prevDir + '-' + curDir));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      vm.addOthersMovementArrows = function() {
        var $square, a, action, actionName, curCol, curDir, curRow, otherPlayer, prevDir, thisPlayersActions, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
        $('.other-arrow').removeClass().addClass('other-arrow');
        _ref = vm.otherPlayers();
        _results = [];
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
              if (action.which === 'walk') {
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
                $('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.other-arrow').addClass(prevDir + '-' + curDir);
              } else if (action.which === 'run') {
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
                $('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.other-arrow').addClass(prevDir + '-' + curDir);
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
                $('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.other-arrow').addClass(prevDir + '-' + curDir);
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
                $('[data-col="' + curCol + '"][data-row="' + curRow + '"]').find('.other-arrow').addClass(prevDir + '-' + curDir);
              }
            }
          }
          $square = $('[data-col="' + curCol + '"][data-row="' + curRow + '"]');
          $square.find('.other-player').addClass(otherPlayer.team).addClass(otherPlayer.direction);
          if (otherPlayer.has_flag) {
            $square.find('.other-player').addClass('flag');
          }
          _results.push($square.find('.other-player-name').text(otherPlayer.username + ' (' + otherPlayer.flags_gotten + 'f,' + otherPlayer.enemies_tagged + 't)'));
        }
        return _results;
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
                  break;
                }
              }
            }
          }
          vm.currentChatMessage(vm.account().chat_message);
          vm.addPlayerMovementArrows();
          return vm.addOthersMovementArrows();
        }
      });
      typingTimer = null;
      $('.chat-entry').keyup(function() {
        clearTimeout(typingTimer);
        return typingTimer = setTimeout(vm.doneTypingChat, 1000);
      });
      return null;
    };
    ko.applyBindings(new gameViewModel);
    return $('.actions-panel').on('mouseover mouseout', '.btn', function() {
      $(this).toggleClass('btn-success');
      $(this).toggleClass('btn-danger');
      $(this).nextAll('.btn').toggleClass('btn-success');
      return $(this).nextAll('.btn').toggleClass('btn-danger');
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
