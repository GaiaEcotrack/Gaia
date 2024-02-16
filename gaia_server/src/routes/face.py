from flask import render_template, request, Blueprint , redirect, url_for , jsonify
import cv2
import numpy as np
import face_recognition

# Importar librerías adicionales
import imutils

# Crear un Blueprint para organizar las rutas
face_route = Blueprint('face', __name__)


@face_route.route('/')
def index():
    return render_template('face.html')

@face_route.route('/compare', methods=['POST'])
def compare():
    if request.method == "POST":
        imagen_cara = request.files["imagen_cara"]
        imagen_dni = request.files["imagen_dni"]

        # Convertir las imágenes a formato OpenCV
        imagen_cara_opencv = cv2.imdecode(np.frombuffer(imagen_cara.read(), np.uint8), cv2.IMREAD_COLOR)
        imagen_dni_opencv = cv2.imdecode(np.frombuffer(imagen_dni.read(), np.uint8), cv2.IMREAD_COLOR)

        # Detección de rostros
        cara_en_foto_tu_cara = face_recognition.face_locations(imagen_cara_opencv)
        cara_en_foto_dni = face_recognition.face_locations(imagen_dni_opencv)

        # Verificar si se detectaron rostros en ambas imágenes
        if not cara_en_foto_tu_cara or not cara_en_foto_dni:
            resultado = "No se detectaron rostros en ambas imágenes."
            return jsonify({"resultado": resultado})

        # Codificar los rostros
        codificacion_cara_tu_cara = face_recognition.face_encodings(imagen_cara_opencv, cara_en_foto_tu_cara)
        codificacion_cara_dni = face_recognition.face_encodings(imagen_dni_opencv, cara_en_foto_dni)

        if not codificacion_cara_tu_cara or not codificacion_cara_dni:
            resultado = "No se pudieron codificar los rostros en ambas imágenes."
            return jsonify({"resultado": resultado})

        # Calcular la distancia entre las codificaciones de rostros
        distancia = np.linalg.norm(codificacion_cara_tu_cara[0] - codificacion_cara_dni[0])

        # Evaluar la distancia
        if distancia < 0.6:
            resultado = "Coinciden."
        else:
            resultado = "No coinciden."

        return jsonify({"resultado": resultado})


# Función para alinear rostros
# Función para alinear rostros
def alinear_rostro(imagen, rostro):
    # Obtener rectángulo del rostro
    (x, y, w, h) = rostro
    # Extraer el rostro de la imagen original
    rostro_imagen = imagen[y:y+h, x:x+w]
    # Calcular el ángulo de rotación necesario para alinear el rostro verticalmente
    angulo_de_rotacion = calcular_angulo_de_rotacion(rostro_imagen)
    # Rotar el rostro para que esté vertical
    rostro_alineado = imutils.rotate_bound(rostro_imagen, angulo_de_rotacion)
    # Devolver el rostro alineado
    return rostro_alineado

# Función para calcular el ángulo de rotación necesario para alinear el rostro verticalmente
def calcular_angulo_de_rotacion(imagen):
    # Aquí deberías implementar el código para calcular el ángulo de rotación necesario
    # Esto podría implicar usar algún método de detección de rostros para detectar la orientación del rostro
    # y calcular el ángulo necesario para alinear el rostro verticalmente.
    # Por ejemplo, puedes utilizar el detector de rostros de `face_recognition` o métodos de OpenCV.
    # Por ahora, simplemente retornar un ángulo de 0 grados.
    return 0

def normalizar_iluminacion(imagen):
    # Convertir la imagen a escala de grises
    gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
    # Aplicar la corrección gamma para normalizar la iluminación
    imagen_normalizada = cv2.cvtColor(cv2.addWeighted(gris, 1.75, gris, 0, 0), cv2.COLOR_GRAY2BGR)
    # Devolver la imagen normalizada
    return imagen_normalizada