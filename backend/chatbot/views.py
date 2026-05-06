from django.shortcuts import render



import httpx

import json

from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

from django.views.decorators.http import require_http_methods

CHATBOT_URL = "https://workbridge-chatbot.onrender.com"

@csrf_exempt

@require_http_methods(["POST"])

def chat_proxy(request):

    try:

        body = json.loads(request.body)

        with httpx.Client(timeout=60.0) as client:

            response = client.post(f"{CHATBOT_URL}/chat", json=body)

        return JsonResponse(response.json())

    except Exception as e:

        return JsonResponse({"error": str(e)}, status=500)




