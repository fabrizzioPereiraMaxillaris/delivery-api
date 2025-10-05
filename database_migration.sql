-- ========================================
-- MIGRACIÓN COMPLETA DE BASE DE DATOS
-- Elimina y recrea toda la estructura
-- ========================================

-- Eliminar base de datos si existe
DROP DATABASE IF EXISTS delivery_db;

-- Crear base de datos
CREATE DATABASE delivery_db;
USE delivery_db;

-- ========================================
-- TABLA ROLES
-- ========================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles por defecto
INSERT INTO roles (nombre) VALUES 
('admin'), 
('usuario');

-- ========================================
-- TABLA USUARIOS
-- ========================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- ========================================
-- TABLA PRODUCTOS
-- ========================================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50),
    imagen_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA CARRITO
-- ========================================
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ========================================
-- TABLA PEDIDOS
-- ========================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    direccion_entrega VARCHAR(255) NOT NULL,
    telefono_contacto VARCHAR(20),
    notas TEXT,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ========================================
-- TABLA DETALLE DE PEDIDO
-- ========================================
CREATE TABLE pedido_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ========================================
-- INSERCIONES DE DATOS DE EJEMPLO
-- ========================================

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (nombre, email, password, rol_id) VALUES 
('Administrador', 'admin@delivery.com', 'admin123', 1),
('Usuario Test', 'usuario@delivery.com', 'user123', 2),
('Fabri', 'fabri@correo.com', 'fabriii', 2);

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen_url) VALUES 
('Pizza Margherita', 'Pizza clásica con tomate, mozzarella y albahaca fresca', 12.99, 50, 'Comida', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300'),
('Hamburguesa Clásica', 'Hamburguesa con carne de res, lechuga, tomate, cebolla y queso', 9.99, 30, 'Comida', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300'),
('Coca Cola', 'Bebida refrescante de 500ml', 2.50, 100, 'Bebidas', 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300'),
('Ensalada César', 'Ensalada fresca con pollo a la parrilla, lechuga romana y aderezo césar', 8.99, 25, 'Comida', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300'),
('Agua Mineral', 'Agua mineral natural 500ml', 1.50, 200, 'Bebidas', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300'),
('Pasta Carbonara', 'Pasta con salsa cremosa de huevo, panceta y queso parmesano', 11.99, 20, 'Comida', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=300'),
('Sándwich Club', 'Sándwich triple con pollo, tocino, lechuga, tomate y mayonesa', 7.99, 15, 'Comida', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300'),
('Jugo de Naranja', 'Jugo natural de naranja 300ml', 3.50, 40, 'Bebidas', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300'),
('Tacos al Pastor', 'Tacos de cerdo marinado con piña y cebolla', 6.99, 35, 'Comida', 'https://images.unsplash.com/photo-1565299585323-38174c4a75e7?w=300'),
('Café Americano', 'Café americano 250ml', 2.99, 60, 'Bebidas', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300');

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_carrito_usuario ON carrito(usuario_id);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedido_detalle_pedido ON pedido_detalle(pedido_id);

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista para productos con stock bajo
CREATE VIEW productos_stock_bajo AS
SELECT id, nombre, stock, categoria
FROM productos 
WHERE stock < 10;

-- Vista para estadísticas de pedidos por usuario
CREATE VIEW estadisticas_usuarios AS
SELECT 
    u.id,
    u.nombre,
    u.email,
    COUNT(p.id) as total_pedidos,
    COALESCE(SUM(p.total), 0) as total_gastado,
    MAX(p.fecha) as ultimo_pedido
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id
GROUP BY u.id, u.nombre, u.email;

-- ========================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- ========================================

-- Trigger para calcular subtotal automáticamente
DELIMITER //
CREATE TRIGGER calcular_subtotal_pedido_detalle
BEFORE INSERT ON pedido_detalle
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.cantidad * NEW.precio_unitario;
END//
DELIMITER ;

-- Trigger para actualizar subtotal cuando se modifica
DELIMITER //
CREATE TRIGGER actualizar_subtotal_pedido_detalle
BEFORE UPDATE ON pedido_detalle
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.cantidad * NEW.precio_unitario;
END//
DELIMITER ;

-- ========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ========================================

-- Procedimiento para limpiar carritos antiguos (más de 7 días)
DELIMITER //
CREATE PROCEDURE limpiar_carritos_antiguos()
BEGIN
    DELETE FROM carrito 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
END//
DELIMITER ;

-- Procedimiento para obtener estadísticas del dashboard
DELIMITER //
CREATE PROCEDURE obtener_estadisticas_dashboard()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM productos) as total_productos,
        (SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente') as pedidos_pendientes,
        (SELECT COUNT(*) FROM pedidos WHERE DATE(fecha) = CURDATE()) as pedidos_hoy,
        (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE DATE(fecha) = CURDATE()) as ventas_hoy,
        (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())) as ventas_mes;
END//
DELIMITER ;

-- ========================================
-- FINALIZACIÓN
-- ========================================

-- Mostrar resumen de la migración
SELECT 'Migración completada exitosamente' as mensaje;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_productos FROM productos;
SELECT COUNT(*) as total_roles FROM roles;