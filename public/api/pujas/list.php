<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../../config/database.php';

try {

    $sql = "
        SELECT
            id,
            name,
            bengali_name,
            slug,
            short_description,
            deity,
            duration_days,
            status
        FROM pujas
        WHERE status = 'published'
        ORDER BY id ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $pujas = $stmt->fetchAll();

    echo json_encode(
        [
            'success' => true,
            'data' => $pujas
        ],
        JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
    );

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode(
        [
            'success' => false,
            'message' => 'Failed to retrieve Puja data.'
        ],
        JSON_UNESCAPED_UNICODE
    );
}