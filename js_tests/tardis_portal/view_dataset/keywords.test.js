/* global QUnit */

import {
    configureKeywordsSelect
} from "../../../assets/js/tardis_portal/view_dataset/ready.js";

require("jquery-mockjax/dist/jquery.mockjax")(jQuery, window);

QUnit.module("tardis_portal.view_dataset.keywords", {
    beforeEach: function(assert) {
        $.ajaxSetup({ async: false });
    },
    afterEach: function(assert) {
        $.ajaxSetup({ async: true });
    }
});

QUnit.test("Test configuring empty keywords select", function(assert) {

    $("#qunit-fixture").append(`
        <div id="keywords">
         <h3>Keyword(s)</h3>
         <div class="info-box">
           <select id="keywords" class="keywords form-control" multiple="multiple">
           </select>
         </div>`);

    // Before applying the select2() function to the keywords select element,
    // we don't expect to find a select2 container:
    var select2Container = $("#qunit-fixture").find("span.select2");
    assert.ok(select2Container.length === 0);

    configureKeywordsSelect();

    // After applying the select2() function to the keywords select element,
    // we expect to find that the old-school select element has been hidden,
    // and in its place, we'll get a span element with class select2:
    select2Container = $("#qunit-fixture").find("span.select2");
    assert.ok(select2Container.length > 0);
    assert.ok(select2Container.hasClass("select2-container"));

    var select2SearchInput = $("#qunit-fixture").find(".select2-search__field");
    assert.equal(
        select2SearchInput.attr("placeholder"),
        "Add keyword(s). Press enter after each.");

    var select2Selection = $("#qunit-fixture").find(".select2-selection");
    assert.equal(select2Selection.css("border-width"), "0px");
    assert.equal(select2Selection.css("border-color"), "rgb(128, 128, 128)");
    assert.equal(select2Selection.css("background-color"), "rgb(255, 255, 255)");
});
