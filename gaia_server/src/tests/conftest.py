import os
import sys

# Obtiene el directorio donde se encuentra el archivo conftest.py actualmente
current_dir = os.path.dirname(os.path.abspath(__file__))
# Sube dos niveles en la jerarquía de directorios para llegar al directorio raíz del proyecto
root_dir = os.path.abspath(os.path.join(current_dir, '..', '..'))
# Agrega el directorio raíz del proyecto a sys.path
sys.path.insert(0, root_dir)