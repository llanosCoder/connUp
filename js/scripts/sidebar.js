/*global $, logout */

var url = 'http://www.imasdgroup.cl/androidtest/';

$('#btn_logout').on('click', function () {
    'use strict';
    logout(url);
});