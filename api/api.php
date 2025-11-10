<?php
require 'db.php'; // Sertakan file koneksi database

// Set header untuk output JSON
header('Content-Type: application/json');

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    exit(0);
}

 $action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get_products':
        get_products($conn);
        break;
    case 'get_product':
        get_product($conn);
        break;
    case 'get_categories':
        get_categories($conn);
        break;
    case 'add_category':
        add_category($conn);
        break;
    case 'update_category':
        update_category($conn);
        break;
    case 'delete_category':
        delete_category($conn);
        break;
    case 'add_product':
        add_product($conn);
        break;
    case 'update_product':
        update_product($conn);
        break;
    case 'delete_product':
        delete_product($conn);
        break;
    default:
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Aksi tidak valid']);
        break;
}

// --- FUNGSI-FUNGSI CRUD ---

/**
 * Mengambil semua produk dengan JOIN ke tabel kategori
 */
function get_products($conn) {
    $sql = "SELECT p.id, p.title, p.price, p.description, p.image, c.name AS category FROM products p LEFT JOIN categories c ON p.category_id = c.id";
    $result = $conn->query($sql);

    $products = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['id'] = intval($row['id']);
            $row['price'] = floatval($row['price']);
            $products[] = $row;
        }
    }
    echo json_encode($products);
}

/**
 * Mengambil satu produk berdasarkan ID
 */
function get_product($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $stmt = $conn->prepare("SELECT p.id, p.title, p.price, p.description, p.image, p.category_id, c.name AS category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $product = $result->fetch_assoc();

        if ($product) {
            $product['id'] = intval($product['id']);
            $product['price'] = floatval($product['price']);
            $product['category_id'] = intval($product['category_id']);
            echo json_encode($product);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['error' => 'Produk tidak ditemukan']);
        }
        $stmt->close();
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'ID tidak valid']);
    }
}

/**
 * Mengambil semua kategori
 */
function get_categories($conn) {
    $sql = "SELECT id, name FROM categories ORDER BY name ASC";
    $result = $conn->query($sql);
    $categories = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['id'] = intval($row['id']);
            $categories[] = $row;
        }
    }
    echo json_encode($categories);
}

/**
 * Menambahkan kategori baru
 */
function add_category($conn) {
    // Hanya izinkan metode POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Metode request tidak diizinkan. Gunakan POST.']);
        return;
    }

    // Ambil data JSON dari body request
    $data = json_decode(file_get_contents('php://input'), true);

    // Validasi data
    if (empty($data['name'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Nama kategori harus diisi.']);
        return;
    }

    // Sanitasi data
    $name = htmlspecialchars(strip_tags($data['name']));

    // Gunakan prepared statement dengan INSERT IGNORE untuk mencegah error duplikat nama
    $stmt = $conn->prepare("INSERT IGNORE INTO categories (name) VALUES (?)");
    $stmt->bind_param("s", $name);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(201); // Created
            echo json_encode(['success' => 'Kategori berhasil ditambahkan.', 'id' => $conn->insert_id]);
        } else {
            http_response_code(409); // Conflict
            echo json_encode(['error' => 'Kategori sudah ada.']);
        }
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Gagal menambah kategori.', 'details' => $stmt->error]);
    }

    $stmt->close();
}

/**
 * Memperbarui kategori yang ada
 */
function update_category($conn) {
    // Izinkan POST atau PUT
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Metode request tidak diizinkan. Gunakan PUT atau POST.']);
        return;
    }

    // Ambil data JSON dari body request
    $data = json_decode(file_get_contents('php://input'), true);
    $id = isset($data['id']) ? intval($data['id']) : 0;

    if ($id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'ID kategori tidak valid.']);
        return;
    }
    
    // Validasi data
    if (empty($data['name'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Nama kategori harus diisi.']);
        return;
    }

    // Sanitasi data
    $name = htmlspecialchars(strip_tags($data['name']));

    // Gunakan prepared statement
    $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ?");
    $stmt->bind_param("si", $name, $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Kategori berhasil diperbarui.']);
        } else {
            http_response_code(409); // Conflict
            echo json_encode(['error' => 'Tidak ada perubahan atau nama kategori sudah ada.']);
        }
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Gagal memperbarui kategori.', 'details' => $stmt->error]);
    }

    $stmt->close();
}

/**
 * Menghapus kategori
 */
function delete_category($conn) {
    // Izinkan POST atau DELETE
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Metode request tidak diizinkan. Gunakan DELETE atau POST.']);
        return;
    }

    // Ambil ID dari URL untuk DELETE, atau dari body request untuk POST
    $id = 0;
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    } else { // POST
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($data['id']) ? intval($data['id']) : 0;
    }

    if ($id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'ID kategori tidak valid.']);
        return;
    }

    // Cek apakah ada produk yang menggunakan kategori ini sebelum menghapus
    $checkStmt = $conn->prepare("SELECT COUNT(*) FROM products WHERE category_id = ?");
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    $checkStmt->bind_result($productCount);
    $checkStmt->fetch();
    $checkStmt->close();

    if ($productCount > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['error' => 'Tidak dapat menghapus kategori karena masih ada produk yang menggunakannya.']);
        return;
    }

    // Jika aman, hapus kategori
    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Kategori berhasil dihapus.']);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['error' => 'Kategori tidak ditemukan.']);
        }
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Gagal menghapus kategori.', 'details' => $stmt->error]);
    }

    $stmt->close();
}

/**
 * Menambahkan produk baru
 */
function add_product($conn) {
    // Hanya izinkan metode POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Metode request tidak diizinkan. Gunakan POST.']);
        return;
    }

    // Ambil data JSON dari body request
    $data = json_decode(file_get_contents('php://input'), true);

    // Validasi data
    if (empty($data['title']) || !isset($data['price']) || empty($data['description']) || empty($data['image']) || !isset($data['category_id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Semua field harus diisi.']);
        return;
    }

    // Sanitasi data
    $title = htmlspecialchars(strip_tags($data['title']));
    $price = floatval($data['price']);
    $description = htmlspecialchars(strip_tags($data['description']));
    $image = filter_var($data['image'], FILTER_SANITIZE_URL);
    $category_id = intval($data['category_id']);

    // Gunakan prepared statement
    $stmt = $conn->prepare("INSERT INTO products (title, price, description, image, category_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sdssi", $title, $price, $description, $image, $category_id);

    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(['success' => 'Produk berhasil ditambahkan.', 'id' => $conn->insert_id]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Gagal menyimpan produk ke database.', 'details' => $stmt->error]);
    }

    $stmt->close();
}

/**
 * Memperbarui produk yang ada
 */
function update_product($conn) {
    // Izinkan POST atau PUT
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Metode request tidak diizinkan. Gunakan PUT atau POST.']);
        return;
    }

    // Ambil data JSON dari body request
    $data = json_decode(file_get_contents('php://input'), true);
    $id = isset($data['id']) ? intval($data['id']) : 0;

    if ($id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'ID produk tidak valid.']);
        return;
    }
    
    // Validasi data
    if (empty($data['title']) || !isset($data['price']) || empty($data['description']) || empty($data['image']) || !isset($data['category_id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Semua field harus diisi.']);
        return;
    }

    // Sanitasi data
    $title = htmlspecialchars(strip_tags($data['title']));
    $price = floatval($data['price']);
    $description = htmlspecialchars(strip_tags($data['description']));
    $image = filter_var($data['image'], FILTER_SANITIZE_URL);
    $category_id = intval($data['category_id']);

    // Gunakan prepared statement
    $stmt = $conn->prepare("UPDATE products SET title = ?, price = ?, description = ?, image = ?, category_id = ? WHERE id = ?");
    $stmt->bind_param("sdssii", $title, $price, $description, $image, $category_id, $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Produk berhasil diperbarui.']);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['error' => 'Produk tidak ditemukan atau tidak ada perubahan.']);
        }
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Gagal memperbarui produk.', 'details' => $stmt->error]);
    }

    $stmt->close();
}

/**
 * Menghapus produk
 */
function delete_product($conn) {
    // Izinkan POST atau DELETE
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Metode request tidak diizinkan. Gunakan DELETE atau POST.']);
        return;
    }

    // Ambil ID dari URL untuk DELETE, atau dari body request untuk POST
    $id = 0;
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    } else { // POST
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($data['id']) ? intval($data['id']) : 0;
    }

    if ($id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'ID produk tidak valid.']);
        return;
    }

    // Gunakan prepared statement
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Produk berhasil dihapus.']);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['error' => 'Produk tidak ditemukan.']);
        }
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Gagal menghapus produk.', 'details' => $stmt->error]);
    }

    $stmt->close();
}

 $conn->close();
?>