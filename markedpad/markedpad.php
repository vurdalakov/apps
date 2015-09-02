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
        
    case "update":
        $response = writeNote($datadir, getParam('id'), getParam('title'), getParam('text'));
        break;

    case "add":
        $response = addNote($datadir, getParam('title'), getParam('text'));
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

    // sort notes by title
    $titles = array();
    foreach ($notes as $key => $note)
    {
        $titles[$key] = $note['title'];
    }
    array_multisort($titles, SORT_ASC, $notes);
    
    return array("notes" => $notes);
}

function sortByTitle($a, $b)
{
    return strcmp($a->title, $b->title);
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
        elseif (0 == strlen($line))
        {
            // skip
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

function writeNote($datadir, $id, $title, $text)
{
    file_put_contents("$datadir/$id.md", "#T $title\r\n\r\n$text");

    return array("id" => $id);
}

function addNote($datadir, $title, $text)
{
    do
    {
        $id = mt_rand(1000000, 9999999);
    }
    while (is_file("$datadir/$id.md"));
    
    return writeNote($datadir, $id, $title, $text);
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