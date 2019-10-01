/* global prevFileSelect */

export function configureKeywordsSelect() {
    $(".keywords").select2({
        tags: true,
        tokenSeparators: [",", ";"],
        selectOnClose: true,
        placeholder: "Add keyword(s). Press enter after each.",
        // disabled: "readonly"
    }).on("select2:open", function(evt) {
        $(".select2-container--open .select2-dropdown--below").css("display", "none");
    });

    $(".select2-selection").css("border-width", "0px");
    $(".select2-selection").css("border-color", "gray");
    $(".select2-selection").css("background-color", "#fff");
}

export function updateKeywords() {
    var tags = $(".keywords").select2("val");
    $.ajax({
        type: "PATCH",
        url: "/api/v1/dataset/" + $("#dataset-id").val() + "/",
        headers: {"X-CSRFToken": $("#csrf-token").val()},
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({tags: tags}),
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Failed to update keywords");
        }
    });
}

$(document).ready(function() {

    // Create a reload event handler
    $("#metadata-pane").on("reload", function() {
        $(this).load("/ajax/dataset_metadata/" + $("#dataset-id").val() + "/");
        if(prevFileSelect)
        {
            $("#datafile-info").load(prevFileSelect.find(".datafile-info-toggle").attr("href"));
        }
    });

    // load datafiles on page load
    $("#datafiles-pane").load("/ajax/datafile_list/" + $("#dataset-id").val() + "/");

    // Create a reload event handler
    $("#datafiles-pane").on("reload", function() {
        $(this).load("/ajax/datafile_list/" + $("#dataset-id").val() + "/", function() {
            var datafileCount = parseInt($("#datafile-count").val());
            var fileCountString = "" + datafileCount + " File";
            if (datafileCount !== 1) {
                fileCountString += "s";
            }
            $("#total-count").html(fileCountString);
            // Reset progress bar after datafiles-pane has reloaded:
            $("#progress .progress-bar").css("width", "0%");
        });
    });

    // Reload data file list when we close the upload modal
    $("#modal-upload-files").on("hide", function() {
        var reloadEvent = new Event("reload");
        $("#datafiles-pane")[0].dispatchEvent(reloadEvent);
        // Also reload metadata (as it may have been created by the upload)
        reloadEvent = new Event("reload");
        $("#metadata-pane")[0].dispatchEvent(reloadEvent);
    });

    // Set up carousel
    $(".carousel").carousel({
        "interval": 2000
    });
    // Set carousel size
    $("#preview, #preview .carousel-inner").css("width", "320").css("height", "240");

    if ($("#upload-method").val() === true) {
        $("#upload_button_code").load($("#upload-method-url").val());
    }

    configureKeywordsSelect();

    $(".keywords").on("select2:select select2:unselect", function(evt) {
        updateKeywords();
    });
});
