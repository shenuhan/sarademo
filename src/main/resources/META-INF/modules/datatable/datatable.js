define(["jquery","datatable/jquery.dataTables","datatable/dataTables.bootstrap"], function($) {
    var activate = function(modalId) {
        $('#' + modalId).DataTable();
    }
    return {
        activate : activate
    }
});
