//
//

// ---------------------------------------------------------------------------------------
// On page load

$(document).ready(initialize);

function initialize()
{
    setupAjax();
    
    fillNotesList();
    
    $("#add").click(addNote);
    $("#edit").click(addNote);
    $("#delete").click(addNote);
}

// ---------------------------------------------------------------------------------------
// Fill notes list

function fillNotesList()
{
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

function showNote(id)
{
    $.ajax({ data: { "method": "get", "id": id} }).done(function(data)
    {
        $(".notetitle").text(data.title);
        $(".notetext").html(marked(data.text));
        $("#note").show();
    });
}

// ---------------------------------------------------------------------------------------
// Add note

function addNote()
{
    alert("Not implemented yet.");
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
