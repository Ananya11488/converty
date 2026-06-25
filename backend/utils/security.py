from fastapi import Header, HTTPException, status

# Hardcoded for now, later you can move it to env variables
API_KEY = "12345"

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )
