import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from snake.models import Score

@login_required
def snake(request):
    return render(request, 'snake.html')

def profile(request):
    score = Score.objects.all().filter(person=request.user).order_by('score').last()
    return render(request, 'profile.html', {'score': score})

def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('snake')

    else:
        form = UserCreationForm()

    return render(request, "registration/register.html", {'form': form})


@csrf_exempt
def postScore(request):
    if request.method == "POST":
        data = json.loads(request.body)
        score = Score.objects.create(
            score=data['score'],
            person = request.user
        )
    response = serializers.serialize('json', [score])
    return HttpResponse(response, content_type='application/json')