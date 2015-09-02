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

function refreshNotesList()
{
    $(".noteitem").remove();

    $.ajax({ data: { "method": "list" } }).done(function(data)
    {
        $.each(data.notes, function(i, note)
        {
            $(".noteslist").append("<li class=\"noteitem\" id=\"" + note.id + "\">" + note.title + "</li>")
        });

        $(".noteitem").each(function(i, obj) { $(obj).click(function() { showNote($(obj).attr("id")); }) });
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
        $(".notetext").html(marked(data.text));
        $("#note").show();
        
        $(".noteitem").css("font-weight", "normal");
        $("#" + id).css("font-weight", "bold");
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
        refreshNotesList();
        showNote(data.id);
    });
        
    $(dlg).dialog("close");
}

// ---------------------------------------------------------------------------------------
// Add/edit note

function deleteNote()
{
    yesNoDialog("Confirmation", "Do you want to delete this note?<br /><br />\"" + selected.title + "\"", function() { doDeleteNote(selected.id); }, function() {});
}

function doDeleteNote(id)
{
    $.ajax({ data: { "method": "delete", "id": id } });

    refreshNotesList();
    hideNote();
}

function yesNoDialog(title, text, functionForYes, functionForNoAndCancel)
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
        title: title,
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
