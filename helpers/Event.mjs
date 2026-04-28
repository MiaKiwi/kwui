export default class Event {
    static INIT = 'comp-init';
    static MOUNT = 'comp-mount';
    static UNMOUNT = 'comp-unmount';
    static CLASSES_CHANGE = 'comp-classes-change';
    static ATTRIBUTES_CHANGE = 'comp-attributes-change';
    static PROPS_CHANGE = 'comp-props-change';
    static CHILDREN_CHANGE = 'comp-children-change';
    static LISTENERS_CHANGE = 'comp-listeners-change';
    static THEME_CHANGE = 'comp-theme-change';

    // Tables
    static TABLE_SORT_CHANGE = 'comp-sort-change';
    static TABLE_PAGINATION_CHANGE = 'comp-pagination-change';

    static get list() {
        return Object.fromEntries(Object.entries(this));
    }
}