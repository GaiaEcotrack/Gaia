# Gaia eco-track Server

Servidor de la plataforma descentralizada Gaia, gestion de energia renovable mediante el uso de la blockchain Vara network.
El futuro llegó de las energias renovables esta aqui, y su nombre es Gaia Eco-track.
Backend creado con python, flask mongoDb como base de datos.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado Python en tu sistema. Este proyecto requiere Python 3.x.

### Instalación de Python en Windows

1. **Descargar el Instalador de Python**:
   - Visita el [sitio web oficial de Python](https://www.python.org/).
   - Dirígete a la sección de descargas para Windows o usa este enlace directo: [Descargas de Python para Windows](https://www.python.org/downloads/windows/).
   - Descarga el instalador más reciente de Python 3 para Windows. Selecciona la versión de 64 bits a menos que tu sistema requiera la versión de 32 bits.

2. **Ejecutar el Instalador**:
   - Localiza el archivo descargado y ejecútalo.
   - Asegúrate de marcar la casilla "Add Python 3.x to PATH" antes de hacer clic en "Install Now".

3. **Verificar la Instalación**:
   - Abre la línea de comandos y escribe `python --version`. Deberías ver la versión de Python instalada.

4. **Instalar pip**:
   - `pip` se instala automáticamente con Python 3.4 y versiones posteriores.
   - Verifica su instalación con `pip --version`.

5. **Actualizar pip** (opcional):
   - Actualiza pip con el comando `python -m pip install --upgrade pip`.

## Configuración del Proyecto

Instrucciones para configurar el proyecto localmente. Por ejemplo:

```bash
git clone https://github.com/ilichb/VaraEnergy.git
cd VaraEnergy
# Continúa con las instrucciones específicas de configuración del proyecto

# Crear un entorno virtual
python -m venv venv

# Activar el entorno virtual
# En Windows
.\venv\Scripts\activate

# En Unix o MacOS
source venv/bin/activate

Instalacion de dependencias

pip install -r requirements.txt

Iniciar aplicacion

python application.py
