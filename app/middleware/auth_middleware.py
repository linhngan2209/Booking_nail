from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.jwt_token import verify_token
from loguru import logger

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        public_routes = ["/api/v1/login", "/api/v1/register", "/docs", "/redoc", "/openapi.json"]
        if request.url.path in public_routes:
            return await call_next(request)
        token = request.headers.get("Authorization")
        if not token:
            logger.error("Token is missing")
            return Response(content="Token is missing", status_code=401)
        try:
            token = token.split(" ")[1]
            payload = verify_token(token, request)
            if payload is None:
                logger.error("Invalid or expired token")
                return Response(content="Invalid or expired token", status_code=401)
            request.state.user = payload
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {e}")
            return Response(content="Internal Server Error", status_code=500)

        return await call_next(request)
