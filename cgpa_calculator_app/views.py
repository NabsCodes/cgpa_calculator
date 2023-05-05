from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from datetime import datetime

@login_required
def cgpa_calculator(request):
    context = {'timestamp': datetime.now().timestamp()}
    return render(request, 'cgpa_calculator_app/cgpa_calculator.html', context)
