/*global $, document, window, notify*/

$(document).on('ready', function () {
    'use strict';

    var url = 'http://www.imasdgroup.cl/androidtest/';

    function validarCampos(formId) {

        var result = true;

        $('#' + formId + ' :input').each(function () {
            var input = $(this);
            if (input.parent().hasClass('has-error')) {
                result = false;
            }
        });
        return result;
    }

    function login() {
        var email = $('#email').val(),
            pass = $('#pass').val(),
            remember;
        if ($("#remember-me").find(':checkbox').is(':checked')) {
            remember = 1;
        } else {
            remember = 0;
        }
        $.post(
            url,
            {
                email: email,
                pass: pass,
                remember: remember,
                op: 2
            },
            function (data) {
                if (data.success === 1) {
                    window.location.href = 'index.html';
                }
            },
            'json'
        );

    }

    $('#form_login').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            pass: {
                required: true,
                minlength: 6
            },
            submitHandler: function (e) {
                //guardarUsuario();
                e.preventDefault();
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
        }
    });

    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        if (validarCampos('form_login')) {
            login();
        } else {
            //Throw message here
            notify('top', 'right', '', 'warning', 'animated fadeIn', 'animated fadeOut', '¡Atención! ', 'No se ha podido iniciar sesión');
        }
    });

});