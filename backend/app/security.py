import os
import secrets
import time
from datetime import datetime, timedelta
try:
    import jwt
except ImportError:
    import base64
    import json
    import hmac
    import hashlib
    class _FallbackJWT:
        class ExpiredSignatureError(Exception): pass
        class InvalidTokenError(Exception): pass
        @staticmethod
        def encode(payload: dict, key: str, algorithm: str = "HS256") -> str:
            clean = {}
            for k, v in payload.items():
                if isinstance(v, datetime):
                    clean[k] = int(v.timestamp())
                else:
                    clean[k] = v
            header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
            body = base64.urlsafe_b64encode(json.dumps(clean).encode()).decode().rstrip("=")
            sig = base64.urlsafe_b64encode(hmac.new(key.encode(), f"{header}.{body}".encode(), hashlib.sha256).digest()).decode().rstrip("=")
            return f"{header}.{body}.{sig}"
        @staticmethod
        def decode(token: str, key: str, algorithms: list = None) -> dict:
            parts = token.split(".")
            if len(parts) != 3:
                raise _FallbackJWT.InvalidTokenError()
            header, body, sig = parts
            expected_sig = base64.urlsafe_b64encode(hmac.new(key.encode(), f"{header}.{body}".encode(), hashlib.sha256).digest()).decode().rstrip("=")
            if not hmac.compare_digest(sig, expected_sig):
                raise _FallbackJWT.InvalidTokenError()
            padding = "=" * ((4 - len(body) % 4) % 4)
            data = json.loads(base64.urlsafe_b64decode(body + padding).decode())
            if "exp" in data and time.time() > data["exp"]:
                raise _FallbackJWT.ExpiredSignatureError()
            return data
    jwt = _FallbackJWT()

from fastapi import HTTPException, Header, Request, status

# ==============================================================================
# 1. JWT & SESSION CONFIGURATION
# ==============================================================================
JWT_SECRET = os.getenv("JWT_SECRET", "vfstr_eduloan_super_secret_jwt_key_2026_x89a!")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 Hours

# Predefined institutional roles & demo accounts for hackathon verification
ROLE_ACCOUNTS: Dict[str, Dict] = {
    "student": {
        "username": "student",
        "student_id": "261FA04001",
        "name": "Tejasai",
        "role": "STUDENT",
        "department": "CSE 1st Year",
        "password": "student123"
    },
    "261fa04001": {
        "username": "261FA04001",
        "student_id": "261FA04001",
        "name": "Tejasai",
        "role": "STUDENT",
        "department": "CSE 1st Year",
        "password": "student123"
    },
    "admin": {
        "username": "admin",
        "student_id": "ADM-VFSTR-01",
        "name": "Prof. K. Satyanarayana (Registrar / Accounts)",
        "role": "ADMIN",
        "department": "University Financial Administration",
        "password": "admin123"
    },
    "bank": {
        "username": "bank",
        "student_id": "SBI-OFFICER-44",
        "name": "R. Ramanathan (Chief Manager - SBI SME/Loans)",
        "role": "BANK",
        "department": "State Bank of India (VFSTR Campus Branch)",
        "password": "bank123"
    }
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please log in again."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid cryptographic authentication token."
        )

def get_current_user_optional(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    try:
        return decode_access_token(token)
    except HTTPException:
        return None

def verify_role_access(required_roles: List[str], authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header. Bearer token required for this action."
        )
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Bearer Authorization Header format."
        )
    user = decode_access_token(token)
    user_role = user.get("role", "").upper()
    if user_role not in [r.upper() for r in required_roles]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Insufficient privileges. Required role: {', '.join(required_roles)}. Current role: {user_role}"
        )
    return user

# ==============================================================================
# 2. FILE VALIDATION & SIZE LIMITS
# ==============================================================================
MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024   # 8 MB
MAX_DOC_SIZE_BYTES = 15 * 1024 * 1024    # 15 MB

MAGIC_HEADERS = {
    "jpeg": b"\xFF\xD8\xFF",
    "png": b"\x89PNG\r\n\x1a\n",
    "pdf": b"%PDF-",
    "webp": b"RIFF"  # Note: WEBP also has WEBP at byte offset 8
}

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}

def validate_uploaded_file(file_bytes: bytes, filename: str, is_document: bool = False) -> str:
    """
    Validates:
    1. Maximum file size (stops oversized memory exhausts)
    2. File extension sanity
    3. Magic bytes / file signatures (stops executable renaming / MIME spoofing)
    Returns detected sanitized format string.
    """
    max_size = MAX_DOC_SIZE_BYTES if is_document else MAX_IMAGE_SIZE_BYTES
    if len(file_bytes) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowable size of {max_size // (1024 * 1024)}MB."
        )

    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Only JPG, PNG, WEBP, and PDF documents are permitted."
        )

    # Magic byte inspection
    detected_format = None
    if file_bytes.startswith(MAGIC_HEADERS["jpeg"]):
        detected_format = "jpeg"
    elif file_bytes.startswith(MAGIC_HEADERS["png"]):
        detected_format = "png"
    elif file_bytes.startswith(MAGIC_HEADERS["pdf"]):
        detected_format = "pdf"
    elif file_bytes.startswith(MAGIC_HEADERS["webp"]) and len(file_bytes) > 12 and file_bytes[8:12] == b"WEBP":
        detected_format = "webp"

    if not detected_format:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File signature inspection failed: Content does not match valid JPEG, PNG, WEBP, or PDF binary structure."
        )

    return detected_format

def generate_secure_filename(original_filename: str, prefix: str = "doc") -> str:
    """
    Generates an unguessable, cryptographically random, sanitized filename.
    Completely eliminates directory traversal (../..) and null-byte injection attacks.
    """
    _, raw_ext = os.path.splitext(original_filename.lower())
    ext = raw_ext if raw_ext in ALLOWED_EXTENSIONS else ".png"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    entropy = secrets.token_hex(6)
    return f"{prefix}_{timestamp}_{entropy}{ext}"

# ==============================================================================
# 3. RATE LIMITING & BRUTE FORCE PROTECTION
# ==============================================================================
class RateLimiter:
    def __init__(self, requests_per_minute: int = 30, block_duration_seconds: int = 60):
        self.rpm = requests_per_minute
        self.block_duration = block_duration_seconds
        self.requests: Dict[str, List[float]] = {}
        self.blocked: Dict[str, float] = {}

    def check_rate_limit(self, client_id: str):
        now = time.time()
        # Check if temporarily blocked
        if client_id in self.blocked:
            block_expiry = self.blocked[client_id]
            if now < block_expiry:
                retry_after = int(block_expiry - now)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Brute-force protection: Rate limit exceeded. Please retry after {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)}
                )
            else:
                del self.blocked[client_id]

        # Clean old timestamps outside 60-second window
        if client_id not in self.requests:
            self.requests[client_id] = []
        self.requests[client_id] = [t for t in self.requests[client_id] if now - t < 60.0]

        if len(self.requests[client_id]) >= self.rpm:
            self.blocked[client_id] = now + self.block_duration
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded ({self.rpm} req/min). Temporary security cooldown engaged for {self.block_duration}s.",
                headers={"Retry-After": str(self.block_duration)}
            )

        self.requests[client_id].append(now)

verification_rate_limiter = RateLimiter(requests_per_minute=25, block_duration_seconds=45)
code_lookup_rate_limiter = RateLimiter(requests_per_minute=30, block_duration_seconds=60)
