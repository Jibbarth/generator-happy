jQuery(function() {
    "use strict";

    var conf = $('#confirm_message'),
        error = $('#error_message'),
        buttons = $('.button'),
        timerConf,
        timerError,
        time = 2500;

    // Handling ajax update on configuration form
    $('.ajaxUpdate').on('submit', function () {
        var formValues = $(this).serialize();

        buttons.attr('disabled', 'disabled');

        var urlVariableSeparator = '&';

        if (window.location.toString().indexOf('?') == -1) {
            urlVariableSeparator = '?';
        }

        clearTimeout(timerConf);
        clearTimeout(timerError);
        resetAlerts();

        $.ajax({
            url: window.location.toString() + urlVariableSeparator + 'ajax=1',
            type: $(this).attr('method').toUpperCase(),
            data: formValues
        }).done(function (r) {
            buttons.removeAttr('disabled');

            if (r.toString() != 'OK') {
                showError();
                console.error(r);
            } else {
                showConfirm();
                console.log('Saved');
            }
        }).error(function (r) {
            buttons.removeAttr('disabled');
            console.error(r);

            showError();
        });

        return false;
    });
    // Ayé !

    function showError() {
        if(timerError != null) {
            clearTimeout(timerError);
        }

        error.show();
        error.addClass('shake');
        timerConf = setTimeout(function () {
            resetAlerts();
        }, time);
    }

    function showConfirm() {
        if(timerConf != null) {
            clearTimeout(timerConf);
        }

        conf.show();
        conf.addClass('tada');
        timerConf = setTimeout(function () {
            resetAlerts();
        }, time);
    }

    function resetAlerts() {
        conf.removeClass('tada');
        conf.fadeOut(500);

        error.removeClass('shake');
        error.fadeOut(500);
    }
});