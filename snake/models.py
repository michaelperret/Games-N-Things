from django.contrib.auth.models import User, AbstractUser
from django.db import models

# Create your models here.
# class customUser(AbstractUser):
#     name = models.CharField(max_length=50)
#     score = models.PositiveSmallIntegerField(default=0)
#
#     def __unicode__(self):
#         return u"{}".format(self.name)

class Score(models.Model):
    score = models.PositiveSmallIntegerField(default=0)
    person = models.ForeignKey(User)
    shit = models.CharField(max_length=3, null=True)
    when = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u"{}:{}:{}".format(self.person.username,self.score, self.when)