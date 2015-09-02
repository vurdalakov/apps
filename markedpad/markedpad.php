<?php // юникод utf-8

const MIN_ID = 1000000;
const MAX_ID = 9999999;

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

    case "delete":
        $response = deleteNote($datadir, getParam('id'));
        break;

    default:
        error('Unknown method');
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
    $titles = array_map('strtolower', $titles);
    array_multisort($titles, SORT_ASC, $notes);
    
    return array("notes" => $notes);
}

function sortByTitle($a, $b)
{
    return strcmp($a->title, $b->title);
}

function readNote($datadir, $id, $includeText)
{
    $text = file_get_contents(getFileName($datadir, $id));
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
    file_put_contents(getFileName($datadir, $id), "#T $title\r\n\r\n$text");

    return array("id" => $id);
}

function addNote($datadir, $title, $text)
{
    do
    {
        $id = mt_rand(MIN_ID, MAX_ID);
    }
    while (is_file(getFileName($datadir, $id)));
    
    return writeNote($datadir, $id, $title, $text);
}

function deleteNote($datadir, $id)
{
    $filename = getFileName($datadir, $id);
    
    if (is_file($filename))
    {
        unlink($filename);
    }

    return !is_file($filename);
}

function getParam($param)
{
    if (!isset($_POST[$param]))
    {
        error('Parameter not found');
    }
    
    return $_POST[$param];
}

function getFileName($datadir, $id)
{
    if (!ctype_digit($id) || (intval($id) < MIN_ID) || (intval($id) > MAX_ID)) // some protection; otherwise it can be '..\..\.htaccess'
    {
        error('Invalid ID: ' . $id);
    }
    
    return "$datadir/$id.md";
}

function error($message)
{
    http_response_code(400);
    echo $message;
    exit;
}
?>