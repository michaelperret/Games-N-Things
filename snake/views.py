from django.shortcuts import render, redirect

# Create your views here.
def snake(request):
    return render(request, 'snake.html')