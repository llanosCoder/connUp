/*global $, window*/

function verificarSesion(url) {
    'use strict';

    $.post(
        url,
        {
            op: 6,
            parametros: ['sesion']
        },
        function (data) {
            if (data.success !== 1) {
                window.location.href = "login.html";
            }
        },
        'json'
    );
}