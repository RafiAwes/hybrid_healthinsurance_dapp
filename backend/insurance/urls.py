from django.urls import path
from .views import RegisterView, match_claim
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('match-claim/', match_claim, name='match_claim'),
]
