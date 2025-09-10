from rest_framework import generics, permissions
from .models import ClaimCheck
from .serializers import RegisterSerializer, ClaimCheckSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import connection

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def match_claim(request):
    nid = request.data.get('nid')
    name = request.data.get('name')
    tx_id = request.data.get('transaction_id')

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT id FROM users WHERE nid=%s AND name=%s",
            [nid, name]
        )
        user = cursor.fetchone()
        if user:
            cursor.execute(
                "SELECT id FROM transactions WHERE transaction_id=%s AND user_id=%s",
                [tx_id, user[0]]
            )
            tx = cursor.fetchone()
            if tx:
                claim = ClaimCheck.objects.create(name=name, nid=nid, transaction_id=tx_id, status='approved')
                return Response({'status': 'approved'})
    claim = ClaimCheck.objects.create(name=name, nid=nid, transaction_id=tx_id, status='rejected')
    return Response({'status': 'rejected'})
