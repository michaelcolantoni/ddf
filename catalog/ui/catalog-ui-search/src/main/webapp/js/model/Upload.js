/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global require, setTimeout*/
var Backbone = require('backbone');
var $ = require('jquery');

function fileMatches(file, model) {
    return file === model.get('file');
}

function checkValidation(model) {
    if (model.get('id')) {
        model.set('validating', true);
        //wait for solr
        setTimeout(function() {
            $.get('/search/catalog/internal/metacard/' + model.get('id') + '/attribute/validation').then(function(response) {
                model.set({
                    validating: false,
                    issues: response.length > 0
                });
            });
        }, 2000);
    }
}

module.exports = Backbone.Model.extend({
    options: undefined,
    defaults: function() {
        return {
            id: undefined,
            result: undefined,
            file: undefined,
            percentage: 0,
            sending: false,
            success: false,
            error: false,
            message: '',
            validating: false,
            issues: false
        };
    },
    initialize: function(attributes, options) {
        this.options = options;
        this.setupDropzoneListeners();
    },
    setupDropzoneListeners: function() {
        if (this.options.dropzone) {
            this.options.dropzone.on('sending', this.handleSending.bind(this));
            this.options.dropzone.on('uploadprogress', this.handleUploadProgress.bind(this));
            this.options.dropzone.on('error', this.handleError.bind(this));
            this.options.dropzone.on('success', this.handleSuccess.bind(this));
            this.options.dropzone.on('complete', this.handleComplete.bind(this));
        }
    },
    handleSending: function(file) {
        if (fileMatches(file, this)) {
            this.set({
                sending: true
            });
        }
    },
    handleUploadProgress: function(file, percentage) {
        if (fileMatches(file, this)) {
            this.set('percentage', percentage);
        }
    },
    handleError: function(file) {
        if (fileMatches(file, this)) {
            var message = file.name + ' could not be uploaded successfully.';
            this.set({
                error: true,
                message: message
            });
        }
    },
    handleSuccess: function(file) {
        if (fileMatches(file, this)) {
            var message = file.name + ' uploaded successfully.';
            this.set({
                id: file.xhr.getResponseHeader('id'),
                success: true,
                message: message
            });
            checkValidation(this);
        }
    },
    handleComplete: function(file) {
        if (fileMatches(file, this) && file.status === 'canceled') {
            this.collection.remove(this);
        }
    },
    checkValidation: function() {
        checkValidation(this);
    },
    cancel: function() {
        if (this.options.dropzone) {
            this.options.dropzone.removeFile(this.get('file'));
            if (this.collection) {
                this.collection.remove(this);
            }
        }
    }
});