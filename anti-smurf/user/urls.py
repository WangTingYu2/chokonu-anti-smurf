from django.conf.urls import url
from . import views
from user.views import judge

urlpatterns = [
    url(r'^line/$', judge, name='line'),
    # url(r'^index/$', views.IndexView.as_view(), name='user'),
]
