'use strict';

var $ = require('jquery');
var Filters = require('../filters');
var BaseSelect = require('./baseselect');

var MultiSelectFilter = $.extend({}, BaseSelect.SelectFilter, {

    /**
     * Initializes a multiselect dom object
     *
     * @returns {MultiSelectFilter} The Filter object
     */
    init: function () {
        this.$dom = $('<select class="filtre"/>').attr('multiple', 'multiple');
        this.$dom.on('change', this._onChange.bind(this));

        return this;
    },

    /**
     * Populates the multiselect with 'selected' options by default
     * Uses getInitialQuery as default value(s)
     *
     * @param {Array<String>} data The column data
     *
     * @returns {MultiSelectFilter} The Filter object
     */
    populate: function (data) {
        this._addOptions(data, this._addSelectedOption);

        // Select each values returned by getInitialQuery
        var initialQuery = this.getInitialQuery();
        if(initialQuery) {
            this._unselectAllOptions();
            if(Array.isArray(initialQuery)) {
                initialQuery.forEach(this._selectOption.bind(this));
            } else { // Asume initial query is a non empty string
                this._selectOption(initialQuery);
            }
        }

        this._saveSelection();
        this._onChange();

        return this;
    },

    /**
     * If the 'all' option is selected, sets the new options as 'selected'.
     * Otherwise, adds the options based on the filter state
     *
     * @param {Array<String>} data The column data
     *
     * @returns {MultiSelectFilter} The Filter object
     */
    update: function (data) {
        if ($.inArray(this.allText, this.selected) > -1 || this._getNotSelected().length == 0)
            this._addOptions(data, this._addSelectedOption);
        else
            this._addOptions(data, this._refreshOption);

        return this;
    },

    /**
     * This filter is dynamic, it can't be used for initial filtering
     *
     * @returns {String} The filter initial query
     */
    getInitialQuery: function () {
        return '';
    },

    /**
     * remove all selected options
     */
    _unselectAllOptions: function () {
        this.$dom.find('option:selected').prop('selected', false);
    },

    /**
     * find an option by its value, and select it
     * @param {String} value option's value
     */
    _selectOption: function (value) {
        this.$dom.find('option[value="' + value + '"]').prop('selected', true);
    },

    /**
     * Reset the filter by select all options,
     * so the filter will keep every rows
     * @returns {MultiSelectFilter} The Filter object
     */
    reset: function () {
        var allValues = this.$dom.find('option').get().map(function (option) {
            return option.value;
        });
        this.$dom.val(allValues);
        this._saveSelection();

        return this;
    }
});

Filters.prototype.builders.multiselect = BaseSelect.builder.bind(MultiSelectFilter);

module.exports = MultiSelectFilter;
