from django.contrib.auth.forms import UserCreationForm
from snake.models import customUser

__author__ = 'Michael'
class ScoredUserCreationForm(UserCreationForm):

    class Meta:
        model = customUser
        fields = ('name','username')