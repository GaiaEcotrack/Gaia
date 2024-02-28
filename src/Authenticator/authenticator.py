import time
import pyotp
import qrcode


key = pyotp.random_base32()
print(key)

# key = "GaiaEcotrackMySuperSecretKey"
# print(key)

# obtiene codigo generado en tiempo real el cual cambia cada 30 seg.
totp = pyotp.TOTP(key)
# Imprimimos el codigo en consola
print(totp.now()) #=> 000000

# Verificamos el codigo generado
input_code = input("Enter 2FA code:")
print(totp.verify(input_code))

# #-------------------------------------------

# Genera URI... name=<mailUser>. issuer_name=<nameApp>
uri = pyotp.totp.TOTP(key).provisioning_uri(name="diegoRosas123",
                                            issuer_name="GaiaecoTrack App")
print(uri)

# Con base a la URI generamos el codigo QR
qrcode.make(uri).save("totp.png")

#-------------------------------------------

# Verificar codigo generado en la App Google Authenticator
totp = pyotp.TOTP(key)

while True:
  totp.verify(input("enter code:"))
