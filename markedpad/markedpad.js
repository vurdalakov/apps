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
    $("#delete").click(addNote);
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
// Show note

var selected = null;

function showNote(id)
{
    $.ajax({ data: { "method": "get", "id": id } }).done(function(data)
    {
        selected = data;
        $(".notetitle").text(data.title);
        $(".notetext").html(marked(data.text));
        $("#note").show();
    });
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
    
    $("#dialog").dialog({ buttons: { "OK": function() { addOrEditNote($(this), addNote); }, "Cancel": function() { $(this).dialog("close"); } }, modal: true, resizable: false, title: addNote ? "Add Note" : "Edit Note", width: "auto"});
}

function addOrEditNote(dlg, addNote)
{
    if (addNote)
    {
        
    }
    else
    {
        $.ajax({ data: { "method": "update", "id": selected.id, "title": $("#dlgtitle").val(), "text": $("#dlgtext").val() } }).done(function(data)
        {
            refreshNotesList();
            showNote(selected.id);
        });
    }
    
    $(dlg).dialog("close");
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
