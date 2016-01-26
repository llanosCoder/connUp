/*global $, document */
/*jslint plusplus: true */

var url = 'http://www.imasdgroup.cl/androidtest/';

function obtenerSolicitudes() {

    'use strict';

    var htmlSolicitudes = '',
        contSolicitudes = 0;

    $.post(
        url,
        {
            op: 10
        },
        function (data) {
            if (data.success === 1) {
                $.each(data.solicitudes, function (i, solicitud) {
                    contSolicitudes++;
                    htmlSolicitudes += '<a class="list-group-item media" href="javascript:void(0);" id="s_id_' + solicitud.s_id + '"><div class="pull-right"><img class="img-avatar" src="';
                    if (solicitud.u_avatar !== undefined && solicitud.u_avatar !== '' && solicitud.u_avatar !== null) {
                        htmlSolicitudes += solicitud.u_avatar;
                    } else {
                        htmlSolicitudes += 'img/profile-pic.png';
                    }
                    htmlSolicitudes += '" alt="" width="40" height="40"></div><div class="media-body"><div class="list-group-item-heading">';
                    if (solicitud.u_nombre !== undefined) {
                        htmlSolicitudes += solicitud.u_nombre + ' ';
                    }
                    if (solicitud.u_apellidos !== undefined) {
                        htmlSolicitudes += solicitud.u_apellidos;
                    }
                    htmlSolicitudes += '</div><small class="list-group-item-text c-gray">Contactémonos :)</small>';
                    htmlSolicitudes += '<button class="btn btn-danger" id="btn_reject" user="' + solicitud.u_id + '" solicitud="' + solicitud.s_id + '" title="Rechazar solicitud"><i class="fa fa-times"></i></button>';
                    htmlSolicitudes += '<button class="btn btn-success" id="btn_accept" user="' + solicitud.u_id + '" solicitud="' + solicitud.s_id + '" title="Aceptar solicitud"><i class="fa fa-check"></i></button>';
                    htmlSolicitudes += '</div></a>';
                });
                if (contSolicitudes > 0) {
                    $('#hi_notifications').append('<i class="hi-count" id="hi-count">' + contSolicitudes + '</i>');
                    $('#hi-count').show();
                } else {
                    $('#hi-count').hide();
                }
            }
        },
        'json'
    ).done(function () {
        $('#notificaciones_wrapper').html(htmlSolicitudes);

        function aceptarRechazarSolicitud(e, estado) {

            var usuario = $(e).attr('user'),
                solicitud = $(e).attr('solicitud');

            handleSolicitudes(url, usuario, solicitud, estado);
        }

        $('#btn_accept').off('click');
        $('#btn_accept').on('click', function () {
            aceptarRechazarSolicitud($(this), 1);

        });
        $('#btn_reject').off('click');
        $('#btn_reject').on('click', function () {
            aceptarRechazarSolicitud($(this), 2);
        });
    });
}

obtenerSolicitudes();