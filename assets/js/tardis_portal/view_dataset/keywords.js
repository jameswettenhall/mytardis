/* view_dataset/keywords.js */

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
