# clases de python que reflejen la logica de la DB
#  aca podriamos tener la conexion a la base de datos, actualmente esta en app.py

from marshmallow import Schema, fields, validate
# Esquema para validar datos de entrada
class UserSchema(Schema):
    username = fields.String(required=False, validate=validate.Length(min=1))
    password = fields.String(required=False, validate=validate.Length(min=6))
    email = fields.Email(required=True)
    nombre_apellidos = fields.String(required=True)  # Nombre y apellidos
    numero_identificacion = fields.String(required=True)  # Número de identificación
    direccion = fields.String(required=True)  # Dirección
    telefono = fields.String(required=True)  # Teléfono

    # Datos de identificación
    documento_identidad = fields.String(required=False)
    certificacion_nacimiento = fields.String(required=False)
    certificacion_matrimonio = fields.String(allow_none=True)  # Permitir que sea nulo

    # Datos financieros
    estado_cuenta_bancario = fields.String(allow_none=True)  # Permitir que sea nulo
    declaraciones_impuestos = fields.String(allow_none=True)  # Permitir que sea nulo
    otros_documentos_financieros = fields.String(allow_none=True)  # Permitir que sea nulo
