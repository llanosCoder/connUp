/*global $, notify, window */

function logout(url) {
    'use strict';
    $.post(
        url,
        {
            op: 12
        },
        function (data) {
            if (data.success === 1) {
                window.location.href = 'login.html';
            } else {
                notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', ':( <br>', data.msg);
            }
        },
        'json'
    );
}