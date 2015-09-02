//
//

// ---------------------------------------------------------------------------------------
// On page load

$(document).ready(initialize);

function initialize()
{
    setupAjax();
    
    refreshNotesList();
    
    $("#add").click(addNote);
    $("#edit").click(editNote);
    $("#delete").click(deleteNote);
}

// ---------------------------------------------------------------------------------------
// Refresh notes list

function refreshNotesList(id)
{
    $(".noteitem").remove();

    $.ajax({ data: { "method": "list" } }).done(function(data)
    {
        $.each(data.notes, function(i, note)
        {
            $(".noteslist").append("<li class=\"noteitem\" id=\"" + note.id + "\">" + note.title + "</li>")
        });

        $(".noteitem").each(function(i, obj) { $(obj).click(function() { showNote($(obj).attr("id")); }) });

        if ($(".noteitem").length > 0)
        {
            showNote("undefined" === typeof id ? $(".noteitem").first().attr("id") : id);
        }
    });
}

// ---------------------------------------------------------------------------------------
// Show/hide note

var selected = null;

function showNote(id)
{
    $.ajax({ data: { "method": "get", "id": id } }).done(function(data)
    {
        selected = data;
        
        $(".notetitle").text(data.title);
        $(".notetext").html((!data.hasOwnProperty("text") || (0 == data.text)) ? "" : marked(data.text));
        $("#note").show();
        
        $(".noteitem").css("font-weight", "normal");
        $("#" + data.id).css("font-weight", "bold");
    });
}

function hideNote()
{
    $("#note").hide();
}

// ---------------------------------------------------------------------------------------
// Add/edit note

function addNote()
{
    showDialog(true);
}

function editNote()
{
    showDialog(false);
}

function showDialog(addNote)
{
    $("#dlgtitle").val(addNote ? "" : selected.title);
    $("#dlgtext").val(addNote ? "" : selected.text);
    
    $("#dialog").dialog({
        buttons:
        {
            "OK": function() { doAddOrEditNote($(this), addNote); },
            "Cancel": function() { $(this).dialog("close"); }
        },
        modal: true,
        resizable: false,
        title: addNote ? "Add Note" : "Edit Note",
        width: "auto"
    });
}

function doAddOrEditNote(dlg, addNote)
{
    if (0 == $("#dlgtitle").val().length)
    {
        okBox("Title cannot be empty!", "Error");
        $("#dlgtitle").focus();
        return;
    }
    
    if (addNote)
    {
        ajax = $.ajax({ data: { "method": "add", "title": $("#dlgtitle").val(), "text": $("#dlgtext").val() } });
    }
    else
    {
        ajax = $.ajax({ data: { "method": "update", "id": selected.id, "title": $("#dlgtitle").val(), "text": $("#dlgtext").val() } });
    }
    
    ajax.done(function(data)
    {
        refreshNotesList(data.id);
    });
        
    $(dlg).dialog("close");
}

// ---------------------------------------------------------------------------------------
// Add/edit note

function deleteNote()
{
    yesNoBox("Do you want to delete this note?<br /><br />\"" + selected.title + "\"", "Confirmation", function() { doDeleteNote(selected.id); }, function() {});
}

function doDeleteNote(id)
{
    $.ajax({ data: { "method": "delete", "id": id } });

    refreshNotesList();
    hideNote();
}

// ---------------------------------------------------------------------------------------
// jQuery helpers

function okBox(text, title)
{
    $("<div></div>").appendTo("body").html("<div>" + text + "</div>").dialog({
        buttons: { "OK": function() { $(this).dialog("close"); } },
        close: function (event, ui) { $(this).remove(); },
        modal: true,
        resizable: false,
        title: typeof "undefined" === title ? 'Markedpad' : title,
        width: 'auto'
    });
}

function yesNoBox(text, title, functionForYes, functionForNoAndCancel)
{
    $("<div></div>").appendTo("body").html("<div>" + text + "</div>").dialog({
        buttons:
        {
            "Yes": function() { functionForYes(); $(this).dialog("close"); },
            "No": function() { functionForNoAndCancel(); $(this).dialog("close"); }
        },
        close: function (event, ui)
        {
            $(this).remove();
        },
        modal: true,
        resizable: false,
        title: typeof "undefined" === title ? 'Markedpad' : title,
        width: 'auto'
    });
}

// ---------------------------------------------------------------------------------------
// Ajax helpers

function setupAjax()
{
    $.ajaxSetup(
    {
        method: "POST",
        url: "markedpad.php",
        dataType: "json",
        error: function(xhr, status, error) { alert("Error calling backend: " + xhr.status + " " + xhr.statusText + "\n" + error + "\n" + xhr.responseText); }
    });

}

