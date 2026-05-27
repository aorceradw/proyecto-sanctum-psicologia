# 🔧 Configuración de Apache para Sanctum

Si quieres usar **Apache como reverse proxy** frente a Docker, sigue estos pasos en tu servidor Debian.

## 📋 Requisitos

```bash
# Instalar Apache
sudo apt-get install -y apache2

# Habilitar módulos necesarios
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers
```

## 🚀 Instalación

### Opción A: Sanctum en la raíz (`/`)

```bash
# 1. Copiar configuración
sudo cp apache.conf /etc/apache2/sites-available/sanctum.conf

# 2. Editar el archivo
sudo nano /etc/apache2/sites-available/sanctum.conf
# - Cambiar "tu-dominio.com" por tu dominio real
# - Descomentar la OPCIÓN 1 (raíz)
# - Comentar la OPCIÓN 2 (subruta)

# 3. Habilitar sitio
sudo a2ensite sanctum

# 4. Deshabilitar default si quieres
sudo a2dissite 000-default

# 5. Testear configuración
sudo apache2ctl configtest
# Debería mostrar: Syntax OK

# 6. Reiniciar Apache
sudo systemctl restart apache2
```

### Opción B: Sanctum en subruta (`/sanctum/`)

```bash
# 1. Copiar configuración
sudo cp apache.conf /etc/apache2/sites-available/sanctum.conf

# 2. Editar el archivo
sudo nano /etc/apache2/sites-available/sanctum.conf
# - Cambiar "tu-dominio.com" por tu dominio real
# - Comentar la OPCIÓN 1 (raíz)
# - Descomentar la OPCIÓN 2 (subruta)

# 3. Habilitar sitio
sudo a2ensite sanctum

# 4. Testear
sudo apache2ctl configtest

# 5. Reiniciar
sudo systemctl restart apache2
```

## ✅ Verificación

```bash
# Ver que Apache está corriendo
sudo systemctl status apache2

# Ver sitios habilitados
sudo apache2ctl -S

# Ver logs
sudo tail -f /var/log/apache2/sanctum_access.log
sudo tail -f /var/log/apache2/sanctum_error.log

# Probar que funciona
curl http://tu-dominio.com/sanctum/api/health

# Debería responder:
# {"status":"ok","app":"Sanctum API","database":true,"environment":"production"}
```

## 🔐 SSL con Let's Encrypt (Recomendado)

```bash
# Instalar certbot
sudo apt-get install -y certbot python3-certbot-apache

# Generar certificado automático
sudo certbot --apache -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
sudo certbot renew --dry-run
```

## 🐳 Docker sigue corriendo

**Importante:** Docker sigue corriendo con `docker compose up -d`. Apache solo actúa como reverse proxy:

```
Cliente → Apache (proxy) → Docker (http://localhost:3001)
```

## 📝 Checklist de Configuración

- [ ] Apache instalado y módulos habilitados
- [ ] Archivo `apache.conf` copiado a `/etc/apache2/sites-available/`
- [ ] Dominio actualizado en la configuración
- [ ] Sintaxis verificada con `apache2ctl configtest`
- [ ] Sitio habilitado con `a2ensite`
- [ ] Apache reiniciado
- [ ] Docker corriendo: `docker compose ps`
- [ ] Prueba: `curl http://tu-dominio.com/sanctum/api/health`
- [ ] (Opcional) SSL configurado con Certbot

## 🆘 Troubleshooting

**Error: Port 80 already in use**
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

**Proxy no funciona**
```bash
# Verificar que los módulos están habilitados
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2
```

**Certificado SSL expira**
```bash
sudo certbot renew
sudo systemctl restart apache2
```

## 📖 Documentación

- [Apache Mod Proxy Docs](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html)
- [Let's Encrypt](https://letsencrypt.org/es/)
