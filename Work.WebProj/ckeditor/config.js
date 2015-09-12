/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	 config.language = 'zh';
    // config.uiColor = '#AADC6E';

    config.toolbar = [
        {
            name: "basicstyles",
            items: ["FontSize", "Bold", "Italic", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", 'Font']
        },
        {
            name: "paragraph",
            items: ["NumberedList", "BulletedList", "-"]
        }, {
            name: "tools",
            items: ["Maximize", "-"]
        }, {
            name: "styles",
            items: ["Styles"]
        }, {
            name: "links",
            items: ["Link", "Unlink", "Anchor"]
        }, {
            name: 'insert',
            items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
        }, {
            name: "colors",
            items: ["TextColor", "BGColor"]
        }, { name: "editing" }, {
            name: "document",
            items: ["Source", "-", "DocProps"]
        }, {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo"]
        }];
config.filebrowserBrowseUrl = "../ckfinder/ckfinder.html";
config.filebrowserImageBrowseUrl = "../ckfinder/ckfinder.html?type=Images";
//config.filebrowserFlashBrowseUrl = "./ckfinder/ckfinder.html?type=Flash";
//config.filebrowserUploadUrl = "./ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files";
config.filebrowserImageUploadUrl = "../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
//config.filebrowserFlashUploadUrl = "./ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Flash";
};
CKFinder.SetupCKEditor(null, "../ckfinder/");
