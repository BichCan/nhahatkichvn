import requests

def test_login():
    url = "http://192.168.1.13:5000/api/login"
    payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Testing backend login API...")
    test_login()
