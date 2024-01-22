 # Creacion del servidor con python flask y conexion con mongoDb (atlas)

primero crear entorno virtual de python

1- instalar python ( pip es el gestor de paquetes de python )

1- instalar mongo Db (mongo db service y mongo compass) 

2- crear un entorno virtual (venv) con el siguiente comando:

python o python3 -m venv venv.   

ese comando crea el entorno virtual para separar las dependencias del proyecto

3-  ubicarnos en el ambiente virtual:

mac

source venv/bin/activate

windows bash

source venv/Scripts/activate

cmd windows:

.\venv\Scripts\activate

crear servidor con flask

1- instalar flask:

pip install flask

2- crear carpeta src en raiz del proyecto y crear archivo app.py

aaaca vamos a levantar el servidor con flask.

3- crear carpeta ‘templates’, y dentro el archivo index.html (puede tener cualquier nombre)

4- en ese arhivo vamos a poner contenido apra mostrar de prueba en nuestro servidor

5- crear carpeta routes, y dentro arhivos con nombres de las rutas.

6- arhivo users.py: importamos Blueprint el cual 

```python
permite organizar y estructurar tu aplicación de manera modular. Puedes pensar en un Blueprint como un conjunto de rutas, 
# controladores y recursos que se pueden registrar y luego incorporar en tu aplicación principal.
# Cuando importas Blueprint desde Flask, puedes crear instancias de esta clase para definir grupos lógicos de rutas y 
# funciones de vista. Estos blueprints se pueden registrar en tu aplicación principal posteriormente.
```

MONGODB:

1- pip install python flask-pymongo

2- pip install python-dotenv

ESTRUCTURA DE CARPETAS

SRC: todo el contenido de la app va aca dentro. 

VENV: carpeta del entorno virtual en la raiz del proyecto

.env en la raiz del proyecto

.gitignore en la raiz del proyecto

[README.md](http://README.md) en la raiz del proyecto

dentro de cada carpeta dentro de SRC (menos en carpeta utils), creamos un archivo __init__ .py para que cada una funcione como un paquete de python.

pip freeze > requirements.txt ( crea archivo de dependencias para instalarlas desde alli al compartir el proyecto)