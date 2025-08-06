import httpx

async def mcp_request(server_url: str, tool_name: str, params: dict):
    payload = {
        "tool_name": tool_name,
        "parameters": params
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(server_url, json=payload, timeout=30.0)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
