/*global $, obtenerSolicitudes, notify */

function handleSolicitudes(url, u, s, e) {
    'use strict';
    $.post(
        url,
        {
            op: 11,
            solicitante: u,
            solicitud: s,
            estado: e
        },
        function (data) {
            if (data.success === 1) {
                $('#s_id_' + s).hide();
                notify('bottom', 'right', '', 'success', 'animated fadeIn', 'animated fadeOut', ':)<br>', data.msg);
                obtenerSolicitudes();
            } else {
                notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', ':()<br>', data.msg);
            }
        },
        'json'
    );
}