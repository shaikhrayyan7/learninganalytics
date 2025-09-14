import os, json, base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from app_config import SECRET_KEY

def encrypt_data(data: dict) -> dict:
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(SECRET_KEY.encode('utf-8')), modes.CFB(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    raw = json.dumps(data).encode('utf-8')
    encrypted = encryptor.update(raw) + encryptor.finalize()
    return {
        "data": base64.b64encode(encrypted).decode('utf-8'),
        "iv": base64.b64encode(iv).decode('utf-8')
    }

def decrypt_data(enc_obj: dict) -> dict:
    iv = base64.b64decode(enc_obj["iv"])
    encrypted = base64.b64decode(enc_obj["data"])
    cipher = Cipher(algorithms.AES(SECRET_KEY.encode('utf-8')), modes.CFB(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted = decryptor.update(encrypted) + decryptor.finalize()
    return json.loads(decrypted)
