/* assets/js/tardis_portal/view_dataset/datafile_list.js */
 
/* global showMsg */

/*
 * Return HTML to display checkbox next to DataFile
 */
function getCheckboxHtml(datafile, hasDownloadPermissions) {
    if (hasDownloadPermissions && datafile.verified && datafile.is_online) {
        return "<input type=\"checkbox\" style=\"\" " +
            "class=\"datafile_checkbox\" name=\"datafile\" " +
            "value=\"" + datafile.id + "\"/>";
    }
    return "";
}

/*
 * Return HTML to display clickable filename for DataFile
 */
function getViewHyperlink(datafile) {
    return "<a class=\"filelink datafile_name\"" +
        "href=\"" + datafile.view_url + "\"" +
        "title=\"View\"" +
        "target=\"_blank\">" + datafile.filename + "</a>";
}

/*
 * Return HTML to display unclickable filename for DataFile
 */
function getUnclickableFilenameHtml(datafile) {
    if (datafile.verified) {
        return "<span class=\"datafile_name" +
            (datafile.is_online ? "" : " archived-file") +
            "\">" + datafile.filename + "</span>";
    }
    // Unverified files are displayed in red:
    return "<span class=\"datafile_name\" style=\"color:red;\">" +
        datafile.filename + "</span>";
}

/*
 * Return HTML to display file size
 */
function getFileSizeHtml(datafile) {
    if (datafile.formatted_size) {
        return "<span " +
            (datafile.is_online ? "" : "class=\"archived-file\" ") +
            "style=\"margin-right: 5px" +
            (datafile.verified ? "" : " color:red;") +
            "\"" + ">" +
            " (" + datafile.formatted_size + ")" +
            "</span>";
    }
    return "";
}

/*
 * Return HTML to display file size
 */
function getUnverifiedOrOfflineHtml(datafile) {
    if (!datafile.verified) {
        return " <span style=\"margin-right: 5px; color:red;\">(unverified)</span>";
    }
    if (!datafile.is_online) {
        return " <span class=\"archived-file\" style=\"margin-right: 5px;\">(archived)</span>";
    }
    return "";
}

/*
 * Return HTML to display DataFile filename, annotated with
 * file size, verified status, and online status.
 *
 * Make it a hyperlink if the DataFile has a view URL.
 */
// eslint-disable-next-line complexity
function getAnnotatedFilenameHtml(datafile, hasDownloadPermissions) {
    var filenameHtml = "";
    if (hasDownloadPermissions && datafile.view_url && datafile.verified && datafile.is_online) {
        filenameHtml = getViewHyperlink(datafile);
    }
    else {
        filenameHtml = getUnclickableFilenameHtml(datafile);
    }
    filenameHtml += getFileSizeHtml(datafile);
    filenameHtml += getUnverifiedOrOfflineHtml(datafile);
    return filenameHtml;
}

function getDownloadButtonHtml(datafile) {
    return "<a class=\"btn btn-default btn-sm\" " +
        "   title=\"Download\" " +
        "   href=\"" + datafile.download_url + "\"" +
        (datafile.is_online ? "" : " disabled") +
        ">" +
        "  <i class=\"fa fa-download fa-lg\"></i>" +
        "</a>";
}

function getAddMetadataButtonHtml(datafile, hasWritePermissions, immutable) {
    if (hasWritePermissions && !immutable) {
        return "<a title=\"Add Metadata\" " +
           "href=\"/ajax/add_datafile_parameters/" + datafile.id + "/\" " +
           "data-toggle_selector=\"#datafile_metadata_toggle_" + datafile.id + "\"" +
           "class=\"btn btn-default btn-sm add-metadata\">" +
            "<i class=\"fa fa-plus fa-lg\"></i>" +
            "</a>";
    }
    return "";
}

function getShowHideMetadataButtonHtml(datafile) {
    return "<a id=\"datafile_metadata_toggle_" + datafile.id + "\" " +
        "title=\"Show/Hide Metadata\" " +
        "class=\"btn btn-default btn-sm datafile-info-toggle metadata_hidden\" " +
        "href=\"/ajax/datafile_details/" + datafile.id + "/\">" +
        "<i class=\"fa fa-list fa-lg\"></i>" +
        "</a>";
}

function getButtonsHtml(datafile, hasDownloadPermissions, hasWritePermissions, immutable) {
    var datafileButtonsHtml = "";
    if (hasDownloadPermissions && datafile.verified) {
        datafileButtonsHtml += getDownloadButtonHtml(datafile);
    }

    datafileButtonsHtml += getAddMetadataButtonHtml(datafile, hasWritePermissions, immutable);

    datafileButtonsHtml += getShowHideMetadataButtonHtml(datafile);

    return datafileButtonsHtml;
}

// Update datafile status (verified / online) 20 at a time
// Currently we show 100 per page, but we want the first 20
// files' status to be updated quickly, rather than waiting
// for the verified / online status to be determined for all
// 100 files.

var offsets = [0, 20, 40, 60, 80];
var limit = 20;
offsets.forEach(function(offset, offsetIndex) {
    $.getJSON(
        "/ajax/datafile_list/" + $("#dataset-id").val() + "/?page=" + $("#page-number").val() + "&offset=" + offset +
        "&limit=" + limit + "&format=json",
        function(data) {
            $.each(data.datafiles, function(datafileIndex, datafile) {

                var checkboxHtml = getCheckboxHtml(datafile, data.has_download_permissions);
                $("#datafile-checkbox-" + datafile.id).html(checkboxHtml);

                var annotatedFilenameHtml = getAnnotatedFilenameHtml(datafile, data.has_download_permissions);
                $("#datafile-name-" + datafile.id).html(annotatedFilenameHtml);

                $("#datafile-name-" + datafile.id + " .archived-file").tooltip({
                    "title":
                    "This file is archived. " +
                    "Please contact your MyTardis administrators for assistance with recalling the file."
                });

                var buttonsHtml = getButtonsHtml(
                    datafile, data.has_download_permissions, data.has_write_permissions, data.immutable);
                $("#datafile-buttons-" + datafile.id).html(buttonsHtml);
            });
        }
    );
});
