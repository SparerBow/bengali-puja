<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../../config/database.php';

try {

    /*
     * Validate Puja ID
     */
    if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'A valid Puja ID is required.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $pujaId = (int) $_GET['id'];


    /*
     * Get Puja information
     */
    $stmt = $pdo->prepare("
        SELECT
            id,
            name,
            bengali_name,
            slug,
            short_description,
            description,
            deity,
            duration_days,
            status
        FROM pujas
        WHERE id = ?
          AND status = 'published'
        LIMIT 1
    ");

    $stmt->execute([$pujaId]);

    $puja = $stmt->fetch();

    if (!$puja) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Puja not found.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    /*
     * Get Puja dates
     */
    $stmt = $pdo->prepare("
        SELECT
            id,
            year,
            gregorian_date,
            bengali_date,
            bengali_month,
            bengali_year,
            start_date,
            end_date,
            tithi,
            observance,
            location,
            panjika_source,
            notes
        FROM puja_dates
        WHERE puja_id = ?
        ORDER BY gregorian_date ASC, id ASC
    ");

    $stmt->execute([$pujaId]);

    $dates = $stmt->fetchAll();


    /*
     * Get rituals
     */
    $stmt = $pdo->prepare("
        SELECT
            r.id,
            r.puja_id,
            r.puja_date_id,
            r.name,
            r.bengali_name,
            r.description,
            r.sequence_order
        FROM rituals r
        WHERE r.puja_id = ?
        ORDER BY r.sequence_order ASC, r.id ASC
    ");

    $stmt->execute([$pujaId]);

    $rituals = $stmt->fetchAll();


    /*
     * Get cross-date ritual mappings
     */
    $stmt = $pdo->prepare("
        SELECT
            rd.ritual_id,
            rd.puja_date_id
        FROM ritual_dates rd
        INNER JOIN rituals r
            ON r.id = rd.ritual_id
        WHERE r.puja_id = ?
        ORDER BY rd.ritual_id ASC, rd.puja_date_id ASC
    ");

    $stmt->execute([$pujaId]);

    $ritualDateMappings = $stmt->fetchAll();


    /*
     * Get sources
     */
    $stmt = $pdo->prepare("
        SELECT
            id,
            title,
            source_type,
            author,
            publication_date,
            url,
            accessed_date,
            notes
        FROM sources
        WHERE puja_id = ?
        ORDER BY id ASC
    ");

    $stmt->execute([$pujaId]);

    $sources = $stmt->fetchAll();


    /*
     * Return complete response
     */
    echo json_encode([
        'success' => true,
        'data' => [
            'puja' => $puja,
            'dates' => $dates,
            'rituals' => $rituals,
            'ritual_date_mappings' => $ritualDateMappings,
            'sources' => $sources
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Failed to retrieve Puja details.'
    ], JSON_UNESCAPED_UNICODE);
}