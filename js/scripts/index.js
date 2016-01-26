/*global $, document, notify, navigator, console, verificarSesion */
/*jslint plusplus: true */

$(document).on('ready', function () {

    'use strict';

    var url = 'http://www.imasdgroup.cl/androidtest/';

    verificarSesion(url);

    function obtenerPerfil() {
        $.post(
            url,
            {
                op: 5
            },
            function (data) {
                if (data.success === 1) {
                    if (data.usuario[0].expertise === "") {
                        notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', '¡Atención! ', '<a href="profile.html">Completa tu perfil para una mejor experiencia de usuario</a>');
                    }
                }
            },
            'json'
        );
    }

    function localizar() {

        var lon, lat;

        function guardarLocacion() {

            var contadorUsuarios = 0,
                lista = '';

            $.post(
                url,
                {
                    op: 4,
                    longitud: lon,
                    latitud: lat
                },
                function (data) {

                    var datos = {};

                    if (data.success === 1) {
                        $.each(data.usuarios, function (i, usuario) {

                            $.each(usuario, function (j, dato) {
                                if (dato === undefined || dato === null) {
                                    datos[j] = '';
                                } else {
                                    datos[j] = dato;
                                }
                            });
                            lista += '<li class="list-group-item">';
                            lista += '<div class="col-xs-12 col-sm-3">';
                            if (usuario.foto !== undefined) {
                                lista += '<img src="http://api.randomuser.me/portraits/men/49.jpg" alt="' + datos.nombre + ' ' + datos.apellidos + '" class="img-responsive img-circle" />';
                            } else {
                                lista += '<img src="img/profile-pic.png" alt="' + datos.nombre + ' ' + datos.apellidos + '" class="img-responsive img-circle" />';
                            }
                            lista += '</div><div class="col-xs-12 col-sm-9"><span class="name">';
                            lista += datos.nombre + ' ' + datos.apellidos;
                            lista += '</span><br/><span class="glyphicon glyphicon-map-marker text-muted c-info" data-toggle="tooltip" title="' + Math.ceil(datos.distancia) + ' mts."></span><span class="visible-xs"><span class="text-muted">';
                            lista += datos.distancia;
                            /*lista += '</span><br/></span><span class="glyphicon glyphicon-earphone text-muted c-info" data-toggle="tooltip" title="';
                            lista += datos.telefono;
                            lista += '"></span><span class="visible-xs"><span class="text-muted">';
                            lista += usuario.telefono;
                            lista += '</span><br/></span><span class="fa fa-comments text-muted c-info" data-toggle="tooltip" title="';
                            lista += usuario.correo;
                            lista += '"></span><span class="visible-xs"><span class="text-muted">';
                            lista += usuario.correo;
                            lista += '</span><br/></span>*/
                            lista += '</div><div class="col-xs-12 col-sm-9 datos_adicionales_wrapper"><span casos="datos_adicionales">Empresa Actual: ' + datos.e_nombre + '</span>';
                            if (datos.estado_solicitud === '0') {
                                lista += '<button class="btn btn-success btn-flat pull-right" id="btn_add" title="Me interesa" user="' + datos.id + '"><i class="fa fa-user-plus"></i></button>';
                            } else {
                                if (datos.estado_solicitud === '1') {
                                    lista += '<button class="btn btn-success btn-flat pull-right" id="btn_chat" title="Conversemos!" user="' + datos.id + '"><i class="fa fa-comments"></i></button>';
                                }
                            }

                            lista += '</div><div class="clearfix"></div></li>';
                            contadorUsuarios++;
                        });

                    }
                },
                'json'
            ).done(function () {
                if (contadorUsuarios === 0) {
                    notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', '¡Atención! ', 'No se han encontrado usuarios cerca de ti');
                } else {
                    $('#contact-list').html(lista);
                    $('#btn_add').off('click');
                    $('#btn_add').on('click', function () {
                        var button = $(this),
                            usuarioSolicitado = $(button).attr('user');
                        $.post(
                            url,
                            {
                                op: 9,
                                solicitado: usuarioSolicitado
                            },
                            function (data) {
                                switch (data.success) {
                                case 1:
                                    notify('bottom', 'right', '', 'success', 'animated fadeIn', 'animated fadeOut', ':) <br>', data.msg);
                                    $(button).off('click');
                                    $(button).hide();
                                    break;
                                case 2:
                                    $(button).hide();
                                    notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', ':( <br>     ', data.msg);
                                    break;
                                case 0:
                                    notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', ':( <br>     ', data.msg);
                                    break;
                                }
                            },
                            'json'
                        );
                    });
                    $('#btn_chat').off('click');
                    $('#btn_chat').on('click', function () {
                        window.location.href = 'chat.html?u=' + $(this).attr('user');
                    })
                    $('#contact_list_wrapper').show('fast');
                }
            });
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (objPosition) {
                lon = objPosition.coords.longitude;
                lat = objPosition.coords.latitude;

                guardarLocacion();

            }, function (objPositionError) {
                switch (objPositionError.code) {
                case objPositionError.PERMISSION_DENIED:
                    console.log("No se ha permitido el acceso a la posición del usuario.");
                    break;
                case objPositionError.POSITION_UNAVAILABLE:
                    console.log("No se ha podido acceder a la información de su posición.");
                    break;
                case objPositionError.TIMEOUT:
                    console.log("El servicio ha tardado demasiado tiempo en responder.");
                    break;
                default:
                    console.log("Error desconocido.");
                }
            }, {
                maximumAge: 75000,
                timeout: 15000
            });
        } else {
            console.log("Su navegador no soporta la API de geolocalización.");
        }
    }

    function obtenerIntereses() {

        var intereses = '<option val="0">Seleccione un interés</option>';

        $.post(
            url,
            {
                op: 8
            },
            function (data) {
                if (data.success === 1) {
                    $.each(data.intereses, function (i, interes) {
                        intereses += '<option value="' + interes.val + '">' + interes.nombre + '</option>';
                    });
                    $('#select_intereses').html(intereses);
                } else {
                    notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', '¡Atención! ', data.msg);
                }
            },
            'json'
        ).done(function () {
            $('#select_intereses').on('change', function () {
                $('#contact_list_wrapper').hide();
                var interesesSeleccionados = $('#select_intereses').val();

                if (intereses !== 0) {
                    $.post(
                        url,
                        {
                            op: 7,
                            intereses: [interesesSeleccionados]
                        },
                        function (data) {
                            if (data.success === 1) {
                                localizar();
                            } else {
                                notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', '¡Atención! ', data.msg);
                            }
                        },
                        'json'
                    );
                } else {
                    notify('bottom', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', '¡Atención! ', 'Seleccione un interés');
                }
            });
        });
    }

    obtenerIntereses();
    obtenerPerfil();
});