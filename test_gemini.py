from google import genai

client = genai.Client(
    api_key="AQ.Ab8RN6LDM9Dxbp90a6ZIZ8SyOKmmeCNCx_4wJk2BTeUhBXgfOw"
)

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Say hello."
)

print(response.text)