from django.shortcuts import render

def cgpa_calculator(request):
    return render(request, 'cgpa_calculator_app/cgpa_calculator.html')
