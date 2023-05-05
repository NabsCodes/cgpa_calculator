from django.urls import path
from . import views

urlpatterns = [
    path('', views.cgpa_calculator, name='cgpa_calculator'),
]
