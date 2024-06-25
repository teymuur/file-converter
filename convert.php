<?php
require 'vendor/autoload.php';

use CloudConvert\CloudConvert;
use CloudConvert\Models\Job;
use CloudConvert\Models\Task;

$apiKey = '<YOUR_API_KEY>'; // Replace with your CloudConvert API key
$cloudConvert = new CloudConvert(['api_key' => $apiKey]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        echo json_encode(['error' => 'No file uploaded']);
        exit;
    }

    $file = $_FILES['file'];
    $targetFormat = $_POST['targetFormat'];

    try {
        $uploadTask = (new Task('import/upload'))->setFile(new \CloudConvert\Models\File($file['tmp_name'], $file['name']));
        $convertTask = (new Task('convert'))->set('input_format', pathinfo($file['name'], PATHINFO_EXTENSION))->set('output_format', $targetFormat)->set('input', $uploadTask);
        $exportTask = (new Task('export/url'))->set('input', $convertTask);

        $job = (new Job())->addTask($uploadTask)->addTask($convertTask)->addTask($exportTask);
        $cloudConvert->jobs()->create($job);

        $cloudConvert->tasks()->wait($exportTask);

        $fileUrl = $exportTask->getResult()->files[0]->url;

        echo json_encode(['fileUrl' => $fileUrl]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
