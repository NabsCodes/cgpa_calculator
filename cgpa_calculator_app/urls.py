from django.urls import path
from . import views
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('', views.cgpa_calculator, name='cgpa_calculator'),
    path('login/', LoginView.as_view(template_name='cgpa_calculator_app/login.html'), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
]
