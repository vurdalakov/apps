<?php // юникод utf-8

$datadir = dirname(__FILE__) . '/notes';

switch (getParam('method'))
{
    case "list":
        $response = readNotesList($datadir);
        break;
        
    case "get":
        $response = readNote($datadir, getParam('id'), true);
        break;
        
    default:
        error();
}

echo json_encode($response);
exit;

function readNotesList($datadir)
{
    $notes = array();
    
    $handle = opendir($datadir);
    if ($handle)
    {
        while (($filename = readdir($handle)) !== false)
        {
            $pathinfo = pathinfo($filename);
            if ('md' == $pathinfo['extension'])
            {
                $id = $pathinfo['filename'];
                $notes[] = array("id" => $id, "title" => readNote($datadir, $id, false)["title"]);
            }
        }

        closedir($handle);
    }
    
    return array("notes" => $notes);
}

function readNote($datadir, $id, $includeText)
{
    $text = file_get_contents("$datadir/$id.md");
    if (substr($text, 0, 3) == "\xEF\xBB\xBF")
    {
        $text = substr($text, 3);
    }

    $note = array();
    $note["id"] = $id;
    
    $separator = "\n";
    $line = strtok($text, $separator);
    while ($line !== false)
    {
        $line = trim($line);
        
        if (0 === strpos($line, '#T'))
        {
            $note["title"] = trim(substr($line, 3));
        }
        else
        {
            if ($includeText)
            {
                $note["text"] = "$line$separator" . strtok('');
            }
            break;
        }

        $line = strtok($separator);
    }
    
    return $note;
}

function getParam($param)
{
    if (!isset($_POST[$param]))
    {
        error();
    }
    
    return $_POST[$param];
}

function error()
{
    http_response_code(400);
    exit;
}
?>